/**
 * auditar-web.mjs — auditoría de una app estatica ISWC: performance, comportamiento visual y cache.
 *
 * POR QUE ESTE SCRIPT
 *   Una app ISWC son varias paginas (la raiz, el blog, cada publicacion, la galeria de demos).
 *   Cada cambio del kit, del build o de una paleta puede romper algo en una pagina que nadie mira:
 *   la fuente cae a Times New Roman, una hoja no carga, una imagen se rompe, la pagina queda
 *   en blanco, la cache deja de servir y todo va mas lento. Este script lo mira SOLO, en frio, sin
 *   depender de un tester humano, y deja un informe con capturas para verlo con los ojos.
 *
 * COMO TRABAJA (sin dependencias: solo Deno y un Chrome/Edge instalado)
 *   1. Lanza el navegador en modo headless con el puerto de depuracion y habla con el por el
 *      DevTools Protocol (WebSocket nativo de Deno). No instala nada: ni Playwright ni Puppeteer.
 *   2. Por cada pagina: navega, ESPERA a que la app se revele (data-app-ready), mide las Core Web
 *      Vitals reales (LCP, CLS, FCP, TTFB), recoge los errores de consola y las peticiones fallidas,
 *      comprueba que la pagina se ha revelado (data-app-ready), que la fuente aplicada NO es una
 *      serif, que no hay imagenes rotas ni desbordamiento horizontal, y hace una captura.
 *   3. Repite la visita con la cache caliente y compara: si la segunda vez NO mejora, la cache
 *      no esta funcionando y eso se dice en el informe.
 *   4. Escribe informe.md + informe.json + las capturas en la carpeta de salida.
 *
 * USO
 *   deno run -A scripts/auditar/auditar-web.mjs
 *   deno run -A scripts/auditar/auditar-web.mjs --url=https://mi-app.example/ --out=audit/2026-11-21
 *   deno run -A scripts/auditar/auditar-web.mjs --paginas=/,/blog/ --sin-cache
 *
 * OPCIONES
 *   --url=<base>       Base del sitio. Por defecto, la de deno.json (iswc.host).
 *   --paginas=<a,b>    Rutas a auditar (por defecto, todas las del sitemap.xml).
 *   --out=<carpeta>    Donde escribir el informe. Por defecto, audit/<fecha>.
 *   --chrome=<ruta>    Ruta del navegador. Por defecto se busca Chrome o Edge en sus sitios.
 *   --espera=<ms>      Cuanto esperar a que la pagina se revele. Por defecto 25000.
 *   --sin-cache        No hace la segunda visita en caliente.
 *   --sin-capturas     No guarda las capturas (mas rapido).
 *   --movil            Audita ademas con la pantalla de movil (390x844).
 *   --solo=<ruta>      Solo una pagina.
 *
 * SALIDA
 *   0  todo bien.  1  hay fallos (para poder encadenarlo en un gate o en un cron).
 */

// ────────────────────────────────────────────────────────────────────────────
// Opciones
// ────────────────────────────────────────────────────────────────────────────

const args = Deno.args;

function opcion(nombre, porDefecto = "") {
  const prefijo = "--" + nombre + "=";
  const hit = args.find((a) => a.startsWith(prefijo));
  return hit ? hit.slice(prefijo.length) : porDefecto;
}

function tiene(nombre) {
  return args.includes("--" + nombre);
}

async function leerHost() {
  try {
    const txt = await Deno.readTextFile("deno.json");
    const cfg = JSON.parse(txt);
    return (cfg.iswc && cfg.iswc.host) || "";
  } catch {
    return "";
  }
}

const URL_BASE = (opcion("url") || (await leerHost())).replace(/\/+$/, "");
const SALIDA = opcion("out") || ("audit/" + new Date().toISOString().slice(0, 10));
const SIN_CACHE = tiene("sin-cache");
const SIN_CAPTURAS = tiene("sin-capturas");
const MOVIL = tiene("movil");
const SOLO = opcion("solo");
const ESPERA_LISTA = Math.max(2000, Number(opcion("espera") || 25000) || 25000);

/** Umbrales: por debajo de esto se avisa (no se rompe el gate salvo que sea un fallo duro). */
const UMBRAL = {
  lcpMs: 2500,
  cls: 0.1,
  fcpMs: 1800,
  ttfbMs: 800,
  transferidoKb: 900,
  peticiones: 90,
  erroresConsola: 0,
};

// ────────────────────────────────────────────────────────────────────────────
// Cliente del DevTools Protocol (WebSocket nativo de Deno, sin dependencias)
// ────────────────────────────────────────────────────────────────────────────

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendientes = new Map();
    this.oyentes = new Map();
    ws.onmessage = (ev) => this._llega(JSON.parse(ev.data));
    ws.onclose = () => {
      for (const [, p] of this.pendientes) p.rechaza(new Error("el navegador cerro la conexion"));
      this.pendientes.clear();
    };
  }

  static async conectar(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.onopen = () => res();
      ws.onerror = () => rej(new Error("no se pudo abrir el WebSocket del navegador: " + url));
    });
    return new Cdp(ws);
  }

  _llega(msg) {
    if (msg.id !== undefined) {
      const p = this.pendientes.get(msg.id);
      if (!p) return;
      this.pendientes.delete(msg.id);
      if (msg.error) p.rechaza(new Error(msg.error.message + " (" + JSON.stringify(msg.error) + ")"));
      else p.resuelve(msg.result);
      return;
    }
    const lista = this.oyentes.get(msg.method) || [];
    for (const fn of lista.slice()) fn(msg.params, msg.sessionId);
  }

  on(evento, fn) {
    if (!this.oyentes.has(evento)) this.oyentes.set(evento, []);
    this.oyentes.get(evento).push(fn);
    return fn;
  }

  /** Quita un oyente: si no, los listeners se acumulan pagina tras pagina y los
   *  recuentos de red se mezclan entre navegaciones. */
  off(evento, fn) {
    const lista = this.oyentes.get(evento);
    if (!lista) return;
    const i = lista.indexOf(fn);
    if (i >= 0) lista.splice(i, 1);
  }

  enviar(method, params = {}, sessionId) {
    const id = ++this.id;
    const carga = { id, method, params };
    if (sessionId) carga.sessionId = sessionId;
    this.ws.send(JSON.stringify(carga));
    return new Promise((resuelve, rechaza) => {
      this.pendientes.set(id, { resuelve, rechaza });
    });
  }

  cerrar() {
    try {
      this.ws.close();
    } catch {
      /* ya cerrado */
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Navegador
// ────────────────────────────────────────────────────────────────────────────

const BUSCADORES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
];

async function buscarNavegador() {
  const directo = opcion("chrome");
  if (directo) return directo;
  for (const ruta of BUSCADORES) {
    try {
      const info = await Deno.stat(ruta);
      if (info.isFile) return ruta;
    } catch {
      /* no esta */
    }
  }
  // Ultimo intento: el chrome del runtime de DSH
  const raiz = Deno.env.get("LOCALAPPDATA") || "";
  if (raiz) {
    const alt = raiz + "\\Google\\Chrome\\Application\\chrome.exe";
    try {
      const info = await Deno.stat(alt);
      if (info.isFile) return alt;
    } catch {
      /* no esta */
    }
  }
  return "";
}

async function lanzarNavegador(ruta) {
  const perfil = await Deno.makeTempDir({ prefix: "auditar-web-" });
  const puerto = 0;
  const cmd = new Deno.Command(ruta, {
    args: [
      "--headless=new",
      "--remote-debugging-port=" + puerto,
      "--user-data-dir=" + perfil,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--hide-scrollbars",
      "--window-size=1440,1000",
      "about:blank",
    ],
    stdout: "null",
    stderr: "null",
  });
  const proc = cmd.spawn();

  // Chrome escribe el puerto real en DevToolsActivePort dentro del perfil.
  let url = "";
  for (let i = 0; i < 100; i++) {
    await esperar(100);
    try {
      const txt = await Deno.readTextFile(Deno.build.os === "windows" ? perfil + "\\DevToolsActivePort" : perfil + "/DevToolsActivePort");
      const lineas = txt.split(/\r?\n/);
      if (lineas[0] && lineas[0].trim()) {
        url = "http://127.0.0.1:" + lineas[0].trim();
        break;
      }
    } catch {
      /* todavia no */
    }
  }
  if (!url) {
    try {
      proc.kill();
    } catch {
      /* ya estaba muerto */
    }
    await Deno.remove(perfil, { recursive: true }).catch(() => {});
    throw new Error("el navegador no abrio el puerto de depuracion (" + ruta + ")");
  }
  const info = await (await fetch(url + "/json/version")).json();
  return { proc, perfil, wsUrl: info.webSocketDebuggerUrl };
}

async function esperar(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

// ────────────────────────────────────────────────────────────────────────────
// Sonda de una pagina: metricas, errores y captura
// ────────────────────────────────────────────────────────────────────────────

/**
 * Script de pagina: recoge las señales de comportamiento sin depender de la red.
 *
 * OJO, DOS DETALLES QUE IMPORTAN:
 *   1. Los PerformanceObserver entregan EN COLA. Si se lee el valor en el mismo tick en el que
 *      se registra el observador, LCP y CLS salen SIEMPRE a 0. Por eso la sonda es async y
 *      espera un turno antes de leer.
 *   2. El observer con buffered:true entrega las entradas ya ocurridas, que es lo unico
 *      que se puede leer despues de que la pagina ya termino de cargar.
 */
const SONDA = `
(async () => {
  const nav = performance.getEntriesByType("navigation")[0] || {};
  const paints = {};
  for (const p of performance.getEntriesByType("paint")) paints[p.name] = p.startTime;

  let lcp = 0;
  let cls = 0;
  // 1) Chrome expone el LCP como entradas de performance cuando el navegador lo soporta.
  try {
    for (const e of performance.getEntriesByType("largest-contentful-paint")) {
      lcp = Math.max(lcp, e.startTime);
    }
  } catch (e) { /* no disponible */ }
  // 2) El observer cubre el resto de navegadores (y confirma el valor).
  await new Promise((res) => {
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    } catch (e) { /* sin observador */ }
    setTimeout(res, 300);
  });

  const cuerpo = document.body;
  // Los titulos de una app ISWC viven dentro de shadow DOM, y anidado
  // (ja-app > ja-blog > ja-seccion > h2). Ademas, el resumen estatico para buscadores
  // se queda en el DOM principal pero en display:none, y a ese no se le puede pedir
  // la fuente: se elige el primer titulo VISIBLE.
  const titulos = [];
  const recoger = (raiz) => {
    for (const el of raiz.querySelectorAll ? raiz.querySelectorAll("h1, h2, h3") : []) titulos.push(el);
    for (const el of raiz.querySelectorAll ? raiz.querySelectorAll("*") : []) {
      if (el.shadowRoot) recoger(el.shadowRoot);
    }
  };
  try { recoger(document); } catch (e) { /* sin titulos */ }
  let h1 = null;
  for (const el of titulos) {
    const c = getComputedStyle(el);
    if (c && c.display !== "none" && c.visibility !== "hidden" && c.fontFamily) { h1 = el; break; }
  }
  if (!h1 && titulos.length) h1 = titulos[0];
  const cs = cuerpo ? getComputedStyle(cuerpo) : null;
  const csH = h1 ? getComputedStyle(h1) : null;
  const raiz = document.documentElement;
  const rotas = [];
  for (const img of document.images) {
    if (!img.complete || img.naturalWidth === 0) rotas.push(img.currentSrc || img.src || "(sin src)");
  }
  // Que el body tenga caja NO significa que se vea: con visibility:hidden sigue midiendo.
  const rect = cuerpo ? cuerpo.getBoundingClientRect() : null;
  const visibilidad = cs ? cs.visibility : "";
  const opacidad = cs ? Number(cs.opacity) : 0;
  const cuerpoVisible = !!cuerpo && !!rect && rect.width > 0 && rect.height > 0 &&
    visibilidad !== "hidden" && visibilidad !== "collapse" && opacidad > 0;
  return {
    url: String(location.href),
    lcp: Math.round(lcp),
    cls: Math.round(cls * 10000) / 10000,
    fcp: Math.round(paints["first-contentful-paint"] || paints["first-paint"] || 0),
    firstPaint: Math.round(paints["first-paint"] || 0),
    ttfb: Math.round(nav.responseStart || 0),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
    load: Math.round(nav.loadEventEnd || 0),
    fuenteCuerpo: cs ? cs.fontFamily : "",
    fuenteTitulo: csH ? csH.fontFamily : "",
    textoTitulo: h1 ? (h1.textContent || "").trim().slice(0, 60) : "",
    fuenteInterCargada: (function () {
      try { return document.fonts.check("16px Inter"); } catch (e) { return null; }
    })(),
    paginaRevelada: raiz.hasAttribute("data-app-ready"),
    visibilidadCuerpo: visibilidad,
    opacidadCuerpo: opacidad,
    cuerpoVisible: cuerpoVisible,
    imagenesRotas: rotas,
    desbordeHorizontal: raiz.scrollWidth > raiz.clientWidth + 1,
    elementos: document.querySelectorAll("*").length,
    tituloPagina: document.title || "",
    metas: document.querySelectorAll('meta[name="description"]').length,
    canonical: !!document.querySelector('link[rel="canonical"]'),
  };
})()
`;

/** Expresion corta para preguntar como va la pagina sin evaluarla entera. */
const ESTADO = `
(() => {
  const cuerpo = document.body;
  const cs = cuerpo ? getComputedStyle(cuerpo) : null;
  const scripts = Array.from(document.scripts || []);
  return {
    url: String(location.href),
    listo: document.readyState === "complete",
    revelada: document.documentElement.hasAttribute("data-app-ready"),
    mecanismo: scripts.some((s) => (s.textContent || "").indexOf("data-app-ready") >= 0),
    oculta: !!cs && (cs.visibility === "hidden" || cs.visibility === "collapse" ||
      cs.display === "none" || Number(cs.opacity) === 0),
  };
})()
`;

async function auditarPagina(cdp, sessionId, pagina, opciones) {
  const red = {
    peticiones: 0,
    bytes: 0,
    desdeCache: 0,
    cacheables: 0,
    fallos: [],
    errores: [],
    avisos: [],
  };

  // Cada navegacion tiene su propio conjunto de peticiones: sin esto, las respuestas
  // tardias de la pagina anterior se cuelan en el recuento de la siguiente.
  let enNavegacion = false;
  let framePrincipal = "";
  const ids = new Set();

  const onPeticion = (p) => {
    // El frame principal no cambia entre navegaciones (el loaderId si). Con el frameId
    // se sabe exactamente cuando empieza la navegacion que hay que medir.
    const esPrincipal = p.type === "Document" && (p.frameId === framePrincipal || !framePrincipal);
    if (esPrincipal) {
      enNavegacion = true;
      ids.clear();
    }
    if (enNavegacion) ids.add(p.requestId);
  };
  const onRespuesta = (p) => {
    if (!ids.has(p.requestId) || !p.response) return;
    red.peticiones++;
    const r = p.response;
    // Solo cuenta como cache lo que el NAVEGADOR sirve de su cache (no lo que dice el CDN).
    if (r.fromDiskCache || r.fromPrefetchCache) red.desdeCache++;
    const cc = (r.headers && (r.headers["cache-control"] || r.headers["Cache-Control"])) || "";
    if (/max-age=[1-9]/.test(cc) || /public/.test(cc) || /immutable/.test(cc)) red.cacheables++;
    if (r.status >= 400) red.fallos.push(r.status + " " + p.type + " " + r.url);
  };
  const onAcabado = (p) => {
    if (!ids.has(p.requestId)) return;
    if (typeof p.encodedDataLength === "number") red.bytes += p.encodedDataLength;
  };
  const onFallo = (p) => {
    if (!ids.has(p.requestId)) return;
    red.fallos.push((p.errorText || "fallo") + " " + (p.type || "") + " " + (p.requestId || ""));
  };
  const onConsola = (p) => {
    const texto = p.type + ": " + (p.args || []).map((a) => a.value ?? a.description ?? "?").join(" ");
    if (p.type === "error") red.errores.push(texto);
    else if (p.type === "warning") red.avisos.push(texto);
  };
  const onExcepcion = (p) => {
    const d = p.exceptionDetails || {};
    red.errores.push("excepcion: " + (d.exception && (d.exception.description || d.exception.value) || d.text || "?"));
  };

  cdp.on("Network.requestWillBeSent", onPeticion);
  cdp.on("Network.responseReceived", onRespuesta);
  cdp.on("Network.loadingFinished", onAcabado);
  cdp.on("Network.loadingFailed", onFallo);
  cdp.on("Runtime.consoleAPICalled", onConsola);
  cdp.on("Runtime.exceptionThrown", onExcepcion);

  try {
    await cdp.enviar("Network.enable", {}, sessionId);
    await cdp.enviar("Runtime.enable", {}, sessionId);
    await cdp.enviar("Page.enable", {}, sessionId);
    if (opciones.movil) {
      await cdp.enviar("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      }, sessionId);
    } else {
      await cdp.enviar("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 1000,
        deviceScaleFactor: 1,
        mobile: false,
      }, sessionId);
    }

    enNavegacion = false;
    ids.clear();
    red.peticiones = 0;
    red.bytes = 0;
    red.desdeCache = 0;
    red.cacheables = 0;
    red.fallos.length = 0;
    red.errores.length = 0;
    red.avisos.length = 0;

    // Id del frame principal: sirve para separar las peticiones de esta navegacion
    // de las que llegan tarde de la pagina anterior.
    try {
      const arbol = await cdp.enviar("Page.getFrameTree", {}, sessionId);
      framePrincipal = (arbol && arbol.frameTree && arbol.frameTree.frame && arbol.frameTree.frame.id) || "";
    } catch {
      /* si no se puede, se cuentan todas las peticiones */
    }

    const inicio = Date.now();
    await cdp.enviar("Page.navigate", { url: pagina.url }, sessionId);

    // Sin esto se mide una pagina EN BLANCO: la app esconde el body hasta que arranca.
    const revelado = await esperarRevelada(cdp, sessionId, pagina.url, ESPERA_LISTA);
    await esperar(500);

    // Se reintenta la sonda hasta que devuelva la pagina correcta: si se evalua en el
    // contexto viejo, los datos serian de la pagina anterior.
    const wanted = String(pagina.url).replace(/\/+$/, "");
    let m = {};
    for (let intento = 0; intento < 10; intento++) {
      try {
        const evaluado = await cdp.enviar("Runtime.evaluate", {
          expression: SONDA,
          returnByValue: true,
          awaitPromise: true,
        }, sessionId);
        const v = (evaluado && evaluado.result && evaluado.result.value) || {};
        if (String(v.url || "").replace(/\/+$/, "").startsWith(wanted)) {
          m = v;
          break;
        }
      } catch {
        /* la pagina esta cambiando de contexto */
      }
      await esperar(300);
    }
    const total = Date.now() - inicio;

    const capturas = [];
    if (!opciones.sinCapturas) {
      const captura = await cdp.enviar("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      }, sessionId);
      if (captura && captura.data) {
        const nombre = pagina.ruta.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "raiz";
        const rel = "capturas/" + nombre + (opciones.sufijo || "") + ".png";
        const destino = SALIDA + "/" + rel;
        await Deno.writeFile(destino, Uint8Array.from(atob(captura.data), (c) => c.charCodeAt(0)));
        capturas.push(rel);
      }
    }

    return {
      ruta: pagina.ruta,
      url: pagina.url,
      totalMs: total,
      revelado: revelado,
      metricas: Object.assign({}, m, {
        peticiones: red.peticiones,
        transferidoKb: Math.round((red.bytes / 1024) * 10) / 10,
        desdeCache: red.desdeCache,
        cacheables: red.cacheables,
        erroresConsola: red.errores,
        avisosConsola: red.avisos,
        fallosRed: red.fallos,
      }),
      capturas,
    };
  } finally {
    // Sin quitar los oyentes se acumulan: en la visita "caliente" se contarian dos veces
    // las peticiones y el informe diria barbaridades.
    cdp.off("Network.requestWillBeSent", onPeticion);
    cdp.off("Network.responseReceived", onRespuesta);
    cdp.off("Network.loadingFinished", onAcabado);
    cdp.off("Network.loadingFailed", onFallo);
    cdp.off("Runtime.consoleAPICalled", onConsola);
    cdp.off("Runtime.exceptionThrown", onExcepcion);
  }
}

/**
 * Espera a que la pagina este lista de verdad.
 *   - readyState "complete" no basta: la app ISWC se revela con data-app-ready y hasta
 *     entonces el body esta en visibility:hidden (pantalla en blanco, sin LCP ni FCP).
 *   - Si la pagina no usa ese mecanismo, no se espera de mas.
 */
async function esperarRevelada(cdp, sessionId, urlEsperada, msMax) {
  const inicio = Date.now();
  const tope = inicio + msMax;
  const wanted = String(urlEsperada).replace(/\/+$/, "");
  while (Date.now() < tope) {
    let estado = null;
    try {
      const r = await cdp.enviar("Runtime.evaluate", {
        expression: ESTADO,
        returnByValue: true,
      }, sessionId);
      estado = (r && r.result && r.result.value) || null;
    } catch {
      /* la pagina esta cambiando de contexto */
    }
    // Mientras no se haya cargado la pagina correcta no se puede concluir nada: al navegar,
    // el contexto vivo es el de la pagina anterior (about:blank) y daria respuestas en falso.
    if (estado && estado.listo && String(estado.url || "").replace(/\/+$/, "").startsWith(wanted)) {
      if (estado.revelada) {
        return { ms: Date.now() - inicio, motivo: "data-app-ready" };
      }
      if (!estado.mecanismo) {
        return { ms: Date.now() - inicio, motivo: "la pagina no usa data-app-ready" };
      }
      // Espera a que la app marque el atributo. Si tras 2.5 s la pagina ya se ve y no usa
      // el mecanismo, no tiene sentido seguir esperando.
      if (!estado.oculta && Date.now() - inicio > 2500) {
        return { ms: Date.now() - inicio, motivo: "visible sin data-app-ready" };
      }
    }
    await esperar(150);
  }
  return { ms: Date.now() - inicio, motivo: "timeout (" + msMax + " ms) sin data-app-ready" };
}

// ────────────────────────────────────────────────────────────────────────────
// Descubrimiento de paginas y de la cache
// ────────────────────────────────────────────────────────────────────────────

async function paginasDelSitio(base) {
  const pedidas = opcion("paginas");
  if (pedidas) {
    return pedidas.split(",").map((r) => r.trim()).filter(Boolean).map((ruta) => ({
      ruta,
      url: base + (ruta.startsWith("/") ? ruta : "/" + ruta),
      titulo: "",
      bytes: 0,
    }));
  }
  const lista = [];
  const vistos = new Set();
  const anadir = (ruta) => {
    const limpio = ruta.split("#")[0].split("?")[0];
    if (!limpio || limpio === "/index.html") {
      if (vistos.has("/")) return;
      vistos.add("/");
      lista.push({ ruta: "/", url: base + "/", titulo: "", bytes: 0 });
      return;
    }
    if (vistos.has(limpio)) return;
    vistos.add(limpio);
    lista.push({ ruta: limpio, url: base + limpio, titulo: "", bytes: 0 });
  };
  try {
    const res = await fetch(base + "/sitemap.xml", { redirect: "follow" });
    if (res.ok) {
      const xml = await res.text();
      for (const m of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
        const u = m[1].trim();
        if (!u.startsWith(base)) continue;
        anadir(u.slice(base.length) || "/");
      }
    }
  } catch {
    /* sin sitemap: se usa lo que haya */
  }
  if (!lista.length) anadir("/");
  return lista;
}

/** La cache del CDN/Paginas: lo que dice la cabecera, no lo que suponemos. */
async function auditarCache(base, rutas) {
  const salida = [];
  const probadas = rutas.slice(0, 8);
  for (const r of probadas) {
    try {
      const res = await fetch(base + r, { method: "HEAD", redirect: "follow" });
      const h = res.headers;
      salida.push({
        ruta: r,
        estado: res.status,
        cacheControl: h.get("cache-control") || "(ninguno)",
        etag: h.get("etag") || "(ninguno)",
        age: h.get("age") || "(ninguno)",
        encoding: h.get("content-encoding") || "(ninguno)",
        cacheStorage: h.get("x-cache") || h.get("cf-cache-status") || "",
        bytes: Number(h.get("content-length") || 0),
      });
    } catch (e) {
      salida.push({ ruta: r, estado: "fallo: " + e.message });
    }
  }
  return salida;
}

// ────────────────────────────────────────────────────────────────────────────
// Dictamen
// ────────────────────────────────────────────────────────────────────────────

function dictaminar(frio, caliente) {
  const problemas = [];
  const avisos = [];
  const m = frio.metricas;

  if (!m.paginaRevelada) problemas.push("la pagina NO se revelo (falta data-app-ready): se ve en blanco");
  if (m.cuerpoVisible === false) {
    problemas.push("el body no se ve (visibility=" + (m.visibilidadCuerpo || "?") +
      ", opacity=" + (m.opacidadCuerpo ?? "?") + "): nada visible");
  }

  const fuente = (m.fuenteCuerpo || "").toLowerCase();
  const serif = /serif/.test(fuente) && !/sans-serif/.test(fuente);
  if (serif) problemas.push("la fuente del cuerpo es una SERIF (" + m.fuenteCuerpo + "): se ve Times New Roman");
  if (m.fuenteInterCargada === false) avisos.push("Inter no se cargo (document.fonts.check dio false)");

  if (m.imagenesRotas && m.imagenesRotas.length) problemas.push("imagenes rotas: " + m.imagenesRotas.slice(0, 5).join(", "));
  if (m.desbordeHorizontal) problemas.push("desborde horizontal (la pagina se desplaza a los lados)");
  if (!m.tituloPagina) avisos.push("la pagina no tiene <title>");
  if (!m.metas) avisos.push("la pagina no tiene meta description");
  if (!m.canonical) avisos.push("la pagina no tiene link canonical");
  if (m.erroresConsola && m.erroresConsola.length) problemas.push("errores en consola: " + m.erroresConsola.slice(0, 3).join(" | "));
  if (m.avisosConsola && m.avisosConsola.length) avisos.push("avisos en consola: " + m.avisosConsola.slice(0, 3).join(" | "));
  if (m.fallosRed && m.fallosRed.length) problemas.push("peticiones fallidas: " + m.fallosRed.slice(0, 3).join(" | "));

  if (m.lcp > UMBRAL.lcpMs) problemas.push("LCP " + m.lcp + " ms (por encima de " + UMBRAL.lcpMs + ")");
  else if (m.lcp > 0) avisos.push("LCP " + m.lcp + " ms");
  if (m.cls > UMBRAL.cls) problemas.push("CLS " + m.cls + " (por encima de " + UMBRAL.cls + ")");
  else if (m.cls > 0.05) avisos.push("CLS " + m.cls);
  if (m.fcp > UMBRAL.fcpMs) problemas.push("FCP " + m.fcp + " ms (por encima de " + UMBRAL.fcpMs + ")");
  else if (m.fcp > 0) avisos.push("FCP " + m.fcp + " ms");
  if (m.ttfb > UMBRAL.ttfbMs) avisos.push("TTFB " + m.ttfb + " ms");
  if (m.transferidoKb > UMBRAL.transferidoKb) avisos.push("transfiere " + m.transferidoKb + " KB");
  if (m.peticiones > UMBRAL.peticiones) avisos.push("hace " + m.peticiones + " peticiones");

  if (caliente) {
    const c = caliente.metricas;
    if (c.totalMs >= frio.totalMs) {
      problemas.push("la segunda visita (cache caliente) NO fue mas rapida: " + frio.totalMs + " ms -> " + c.totalMs + " ms. La cache no esta sirviendo.");
    }
    if (c.desdeCache === 0 && c.peticiones > 3) {
      avisos.push("la segunda visita no sirvio nada desde la cache del navegador");
    }
  }
  return { problemas, avisos };
}

// ────────────────────────────────────────────────────────────────────────────
// Informe
// ────────────────────────────────────────────────────────────────────────────

function lineaMd(s) {
  return String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function num(v, sufijo = "") {
  return (v === undefined || v === null || v === "") ? "-" : String(v) + sufijo;
}

function informeMd(resultados, cache, meta) {
  const L = [];
  L.push("# Auditoria de " + meta.url);
  L.push("");
  L.push("- fecha: " + meta.fecha);
  L.push("- navegador: " + meta.navegador);
  L.push("- deno: " + meta.deno);
  L.push("- paginas: " + resultados.length);
  const rotos = resultados.filter((r) => r.problemas.length).length;
  L.push("- con problemas: **" + rotos + "**");
  L.push("");
  L.push("## Resumen");
  L.push("");
  L.push("| pagina | LCP | CLS | FCP | TTFB | KB | peticiones | cache | estado |");
  L.push("|---|---|---|---|---|---|---|---|---|");
  for (const r of resultados) {
    const m = r.frio ? r.frio.metricas : {};
    const c = r.caliente ? r.caliente.metricas : null;
    L.push("| " + lineaMd(r.ruta) + " | " + num(m.lcp, " ms") + " | " + num(m.cls) + " | " +
      num(m.fcp, " ms") + " | " + num(m.ttfb, " ms") + " | " + num(m.transferidoKb) + " | " +
      num(m.peticiones) + " | " + (c ? c.desdeCache + "/" + c.peticiones : "-") + " | " +
      (r.problemas.length ? "**FALLA**" : (r.avisos.length ? "aviso" : "bien")) + " |");
  }
  L.push("");
  for (const r of resultados) {
    L.push("## " + r.ruta);
    L.push("");
    L.push("- url: " + r.url);
    if (r.frio) {
      const m = r.frio.metricas;
      const rev = r.frio.revelado || {};
      L.push("- frio: " + r.frio.totalMs + " ms | " + m.peticiones + " peticiones | " + m.transferidoKb + " KB | " +
        (m.desdeCache || 0) + " desde cache | " + (m.cacheables || 0) + " cacheables");
      L.push("- revelado: " + (rev.motivo || "?") + " en " + (rev.ms ?? "?") + " ms");
      L.push("- fuente del cuerpo: " + (m.fuenteCuerpo || "?"));
      L.push("- fuente de los titulos: " + (m.fuenteTitulo || "?") +
        (m.textoTitulo ? " (" + m.textoTitulo + ")" : ""));
      L.push("- Inter cargada: " + (m.fuenteInterCargada === null ? "no comprobable" : m.fuenteInterCargada));
      L.push("- data-app-ready: " + m.paginaRevelada + " | body visible: " + m.cuerpoVisible +
        " (visibility=" + (m.visibilidadCuerpo || "?") + ", opacity=" + (m.opacidadCuerpo ?? "?") + ")");
      L.push("- elementos: " + m.elementos + " | imagenes rotas: " + (m.imagenesRotas || []).length);
      L.push("- navegacion: DCL " + m.domContentLoaded + " ms | load " + m.load + " ms | primer pintado " + (m.firstPaint || 0) + " ms");
    }
    if (r.caliente) {
      const m = r.caliente.metricas;
      const rev = r.caliente.revelado || {};
      L.push("- caliente: " + r.caliente.totalMs + " ms | " + m.peticiones + " peticiones | " + m.transferidoKb + " KB | " +
        m.desdeCache + " desde cache | " + (m.cacheables || 0) + " cacheables");
      L.push("- revelado (caliente): " + (rev.motivo || "?") + " en " + (rev.ms ?? "?") + " ms");
    }
    if (r.problemas.length) {
      L.push("");
      L.push("**Problemas:**");
      for (const p of r.problemas) L.push("- " + p);
    }
    if (r.avisos.length) {
      L.push("");
      L.push("Avisos:");
      for (const a of r.avisos) L.push("- " + a);
    }
    if (r.capturas.length) {
      L.push("");
      L.push("Capturas: " + r.capturas.map((c) => "[" + c.split("/").pop() + "](" + c + ")").join(", "));
    }
    L.push("");
  }
  L.push("## Cache (cabeceras reales)");
  L.push("");
  L.push("| ruta | estado | cache-control | etag | age | encoding | bytes |");
  L.push("|---|---|---|---|---|---|---|");
  for (const c of cache) {
    L.push("| " + lineaMd(c.ruta) + " | " + (c.estado ?? "-") + " | " + (c.cacheControl ?? "-") + " | " +
      (c.etag ?? "-") + " | " + (c.age ?? "-") + " | " + (c.encoding ?? "-") + " | " + (c.bytes ?? "-") + " |");
  }
  L.push("");
  return L.join("\n");
}

// ────────────────────────────────────────────────────────────────────────────
// Programa
// ────────────────────────────────────────────────────────────────────────────

async function principal() {
  if (!URL_BASE) {
    console.error("no se sabe el sitio: pasa --url=https://... o pon iswc.host en deno.json");
    Deno.exit(2);
  }
  const nav = await buscarNavegador();
  if (!nav) {
    console.error("no hay navegador: instala Chrome o Edge, o pasa --chrome=<ruta>");
    Deno.exit(2);
  }
  console.log("sitio:   " + URL_BASE);
  console.log("chrome:  " + nav);
  console.log("salida:  " + SALIDA);

  await Deno.mkdir(SALIDA, { recursive: true });
  const capturasDir = SALIDA + "/capturas";
  if (!SIN_CAPTURAS) await Deno.mkdir(capturasDir, { recursive: true });

  let paginas = await paginasDelSitio(URL_BASE);
  if (SOLO) paginas = paginas.filter((p) => p.ruta === SOLO || p.ruta === "/" + SOLO);
  console.log("paginas: " + paginas.map((p) => p.ruta).join(", "));

  const navegador = await lanzarNavegador(nav);
  const cdp = await Cdp.conectar(navegador.wsUrl);
  const { targetId } = await cdp.enviar("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.enviar("Target.attachToTarget", { targetId, flatten: true });

  const opciones = { movil: MOVIL, sinCapturas: SIN_CAPTURAS, carpeta: capturasDir, sufijo: "" };
  const resultados = [];

  for (const pagina of paginas) {
    console.log("");
    console.log("> " + pagina.ruta);
    const frio = await auditarPagina(cdp, sessionId, pagina, opciones);
    let caliente = null;
    if (!SIN_CACHE) {
      await esperar(400);
      caliente = await auditarPagina(cdp, sessionId, pagina, { ...opciones, sufijo: "-caliente" });
    }
    const d = dictaminar(frio, caliente);
    resultados.push({
      ruta: pagina.ruta,
      url: pagina.url,
      problemas: d.problemas,
      avisos: d.avisos,
      frio,
      caliente,
      capturas: frio.capturas.concat(caliente ? caliente.capturas : []),
    });
    console.log("  revelado: " + (frio.revelado?.motivo || "?") + " en " + (frio.revelado?.ms ?? "?") + " ms");
    for (const p of d.problemas) console.log("  FALLA: " + p);
    for (const a of d.avisos) console.log("  aviso: " + a);
    if (!d.problemas.length && !d.avisos.length) console.log("  bien");
  }

  const rutasCache = ["/", "/index.html", "/dist/cdn/styles/app.css", "/dist/cdn/boot.js", "/sitemap.xml"];
  const cache = await auditarCache(URL_BASE, rutasCache);

  cdp.cerrar();
  try {
    navegador.proc.kill();
  } catch {
    /* ya estaba */
  }
  await Deno.remove(navegador.perfil, { recursive: true }).catch(() => {});

  const meta = {
    url: URL_BASE,
    fecha: new Date().toISOString(),
    navegador: nav,
    deno: Deno.version.deno,
  };
  await Deno.writeTextFile(SALIDA + "/informe.md", informeMd(resultados, cache, meta));
  await Deno.writeTextFile(
    SALIDA + "/informe.json",
    JSON.stringify({ meta, umbrales: UMBRAL, cache, resultados }, null, 2),
  );

  const conProblemas = resultados.filter((r) => r.problemas.length);
  console.log("");
  console.log("informe: " + SALIDA + "/informe.md");
  console.log(resultados.length + " paginas, " + conProblemas.length + " con problemas");
  Deno.exit(conProblemas.length ? 1 : 0);
}

if (import.meta.main) {
  await principal();
}
