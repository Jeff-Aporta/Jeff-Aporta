/**
 * rutas.ts — navegación de la SPA con URL limpias para el blog y `?s=` para el portafolio. Router
 * propio (el `createSpaState` del kit solo entiende `?s=` en una misma ruta): funciona estático en
 * GitHub Pages porque cada URL limpia tiene su propio HTML generado por el build.
 *
 *   <raíz>/                 · { sec }   → portafolio (y la sección a mostrar, en `?s=`)
 *   <raíz>/blog/                        → lista de publicaciones
 *   <raíz>/blog/<slug>/                 → una publicación completa
 *   <raíz>/?s={ v: 'blog' | 'post', p } → enlaces viejos: se reconocen y se reescriben a la URL limpia
 *
 * La raíz del sitio sale de la URL de este módulo (`…/dist/cdn/js/base/rutas.js` o un bundle bajo
 * `dist/cdn/`), así vale servido desde `/` o desde `/Jeff-Aporta/`. Las claves de `?s=` que no son de la
 * ruta (`theme`, `palette`, las escribe el kit) se conservan al navegar; `tabs` (pestañas recordadas por
 * `iswc-tab-group state`) solo dentro de la misma vista. Los enlaces se arman con `hrefDe` y son `<a>`
 * normales: dentro de la SPA (`<ja-app>` presente) se interceptan y navegan sin recargar, también desde
 * shadow DOM; en una página especializada (`blog/<slug>/index.html`) cargan la página destino.
 */
import { b64urlDecode, b64urlEncode } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@a1df39adb9e421de874dd624901b72daa9e25e5c/dist/cdn/core/spa-state.min.js';
import type { RutaSpa } from '../consts/schemas/componentes.schemas.js';

type Estado = Record<string, unknown>;

const CLAVES_RUTA = ['v', 'sec', 'p'];
const PORTADA: RutaSpa = { vista: 'portafolio', seccion: 'inicio' };

/** Estado de `?s=` → ruta (también los enlaces viejos `{ v, p }`). Sin estado (o desconocido) es la portada. */
export function rutaDe(estado: Estado): RutaSpa {
  if (estado.v === 'post' && typeof estado.p === 'string' && estado.p) return { vista: 'post', slug: estado.p };
  if (estado.v === 'blog') return { vista: 'blog' };
  return { vista: 'portafolio', seccion: typeof estado.sec === 'string' && estado.sec ? estado.sec : 'inicio' };
}

/** Ruta → claves de la ruta en `?s=`: solo la sección del portafolio (el blog va en el pathname). */
export function estadoDe(ruta: RutaSpa): Estado {
  return ruta.vista === 'portafolio' && ruta.seccion !== 'inicio' ? { sec: ruta.seccion } : {};
}

/**
 * Ruta → estado completo para un enlace `?s=` a la página SPA (`<ja-link state>`): la sección del
 * portafolio, `{ v: 'blog' }` o `{ v: 'post', p }`. Dentro de la SPA el router lo reconoce y lo reescribe a
 * la URL limpia; desde una página especializada lleva al SPA.
 */
export function estadoSpa(ruta: RutaSpa): Estado {
  if (ruta.vista === 'blog') return { v: 'blog' };
  if (ruta.vista === 'post') return { v: 'post', p: ruta.slug };
  return estadoDe(ruta);
}

/** URL canónica y pública de una ruta, para compartir: `base` es la URL publicada del sitio (con `/` final). */
export function urlCompartir(ruta: RutaSpa, base: string): string {
  const url = new URL(rutaRelativa(ruta), base);
  const estado = estadoDe(ruta);
  if (Object.keys(estado).length) url.searchParams.set('s', b64urlEncode(JSON.stringify(estado)));
  return url.href;
}

/** Ruta → pathname relativo a la raíz del sitio: `''`, `'blog/'` o `'blog/<slug>/'`. */
export function rutaRelativa(ruta: RutaSpa): string {
  if (ruta.vista === 'blog') return 'blog/';
  if (ruta.vista === 'post') return `blog/${ruta.slug}/`;
  return '';
}

/** `?s=` de una URL → estado (vacío si falta o está corrupto). */
export function estadoDeUrl(url: URL): Estado {
  try {
    const crudo = url.searchParams.get('s');
    const estado: unknown = crudo ? JSON.parse(b64urlDecode(crudo)) : {};
    return typeof estado === 'object' && estado !== null && !Array.isArray(estado) ? (estado as Estado) : {};
  } catch {
    return {};
  }
}

/**
 * URL → ruta, dada la raíz del sitio (pathname con `/` final). `null` si la URL no es una página de la
 * SPA (assets, `view/`, otra carpeta). Acepta con o sin `index.html` y el blog con o sin `/` final.
 */
export function rutaDeUrl(url: URL, raiz: string): RutaSpa | null {
  if (!url.pathname.startsWith(raiz)) return null;
  const rel = url.pathname.slice(raiz.length);
  const blog = rel.match(/^blog(?:\/([a-z0-9-]+))?\/?(?:index\.html)?$/);
  if (blog) return blog[1] ? { vista: 'post', slug: blog[1] } : { vista: 'blog' };
  if (rel !== '' && rel !== 'index.html') return null;
  return rutaDe(estadoDeUrl(url));
}

/** Clave de vista: cada vista (portafolio, blog, cada publicación) es una entrada del historial; cambiar de sección no. */
const claveVista = (r: RutaSpa): string => (r.vista === 'post' ? `post:${r.slug}` : r.vista);

/* ── Lo que depende del documento ───────────────────────────── */

let raiz: string | null = null;
/** Pathname de la raíz del sitio (con `/` final), a partir de la URL de este módulo bajo `dist/cdn/`. */
export function raizSitio(): string {
  if (raiz) return raiz;
  const m = import.meta.url.match(/^(.*?\/)dist\/cdn\//);
  raiz = m ? new URL(m[1]!).pathname : location.pathname.replace(/[^/]*$/, '');
  return raiz;
}

/** Lo que ya viaja en `?s=` y no es de la ruta (tema, paleta, pestañas del kit). */
const conservado = (): Estado => Object.fromEntries(Object.entries(estadoDeUrl(new URL(location.href))).filter(([k]) => !CLAVES_RUTA.includes(k)));

/** Ruta actual (pathname y `?s=`). */
export const leerRuta = (): RutaSpa => rutaDeUrl(new URL(location.href), raizSitio()) ?? PORTADA;

/** Estado completo de una ruta: lo conservado + la ruta. Las pestañas recordadas (`tabs`) son de la vista: otra vista arranca sin ellas. */
function completo(ruta: RutaSpa): Estado {
  const { tabs, ...resto } = conservado();
  const mismaVista = claveVista(leerRuta()) === claveVista(ruta);
  return { ...resto, ...(mismaVista && tabs ? { tabs } : {}), ...estadoDe(ruta) };
}

/** `href` de una ruta: pathname limpio desde la raíz del sitio y, si hace falta, su `?s=`. */
export function hrefDe(ruta: RutaSpa): string {
  const estado = completo(ruta);
  const url = new URL(raizSitio() + rutaRelativa(ruta), location.origin);
  if (Object.keys(estado).length) url.searchParams.set('s', b64urlEncode(JSON.stringify(estado)));
  return url.pathname + url.search;
}

let oyentes: Array<(ruta: RutaSpa) => void> = [];
const notificar = () => {
  const ruta = leerRuta();
  for (const fn of oyentes) {
    try {
      fn(ruta);
    } catch (e) {
      console.warn('[ja] rutas', e);
    }
  }
};

/** Navega dentro de la SPA. `replace` deja la URL al día sin crear historial (scroll-spy). */
export function navegar(ruta: RutaSpa, modo?: 'push' | 'replace'): void {
  const href = hrefDe(ruta);
  const cambia = claveVista(leerRuta()) !== claveVista(ruta);
  if (href !== location.pathname + location.search) history[(modo ?? (cambia ? 'push' : 'replace')) === 'push' ? 'pushState' : 'replaceState'](null, '', href);
  notificar();
}

/** Un enlace viejo (`?s=` con `{ v }` en la raíz) se reescribe a su URL limpia, sin crear historial. */
function normalizarUrl(): void {
  const ruta = leerRuta();
  if (ruta.vista === 'portafolio') return;
  const href = hrefDe(ruta);
  if (href !== location.pathname + location.search) history.replaceState(null, '', href);
}

/**
 * Enlaces a páginas de la SPA (`<a>`, también dentro de shadow DOM): se navegan sin recargar. Se
 * excluyen clic con modificadores o botón no principal, `target` distinto de `_self`, `download`,
 * `data-spa="off"` y lo que no sea una ruta de la SPA (assets, PDF, externos).
 */
function alClicEnlace(e: MouseEvent): void {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.composedPath().find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && n.hasAttribute('href'));
  if (!a || a.getAttribute('data-spa') === 'off' || a.hasAttribute('download')) return;
  const target = (a.getAttribute('target') || '').toLowerCase();
  if (target && target !== '_self') return;
  let destino: URL;
  try {
    destino = new URL(a.href, location.href);
  } catch {
    return;
  }
  if (destino.origin !== location.origin) return;
  const ruta = rutaDeUrl(destino, raizSitio());
  if (!ruta) return;
  e.preventDefault();
  navegar(ruta);
}

let instalado = false;
/** Una vez por documento y solo en la SPA (`<ja-app>`): enlaces viejos, atrás/adelante y clics en enlaces. */
function instalar(): void {
  if (instalado || typeof document === 'undefined' || !document.querySelector('ja-app')) return;
  instalado = true;
  normalizarUrl();
  addEventListener('popstate', notificar);
  addEventListener('click', alClicEnlace, true);
}

/** Avisa cada cambio de ruta (navegación propia, enlaces y atrás/adelante). */
export function alCambiarRuta(fn: (ruta: RutaSpa) => void): () => void {
  instalar();
  oyentes.push(fn);
  return () => {
    oyentes = oyentes.filter((f) => f !== fn);
  };
}
