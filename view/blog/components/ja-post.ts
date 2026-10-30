/**
 * <ja-post> — una publicación como guía narrada, a todo el ancho:
 *
 *   índice (regreso, título, autor, compartir, progreso y lista de pasos) · tarjeta del paso (`<ja-paso>`) ·
 *   demo del paso (`<ja-luz-demo>`) y controles, fijos al lado mientras se lee.
 *
 * Datos mínimos: con `slug` descarga `blog/<slug>/post.json` (lo escribe el build desde
 * `src/js/contenido/blog/`, validado con `PublicacionSchema`; mientras llega pinta esqueletos del kit) o
 * recibe la publicación completa en `datos`. Así la misma pieza sirve en la SPA (`<ja-app>` la monta por
 * slug) y en la página especializada `blog/<slug>/index.html` (`<ja-post slug="…">` en HTML estático, con
 * el resumen del post como hijos de luz para rastreadores sin JS).
 *
 * «Compartir» entrega la URL limpia y pública (`https://…/blog/<slug>/`) con los componentes del kit:
 * `<iswc-share-button>` (Web Share; sin ella copia) y `<iswc-copy-button>` (portapapeles).
 *
 * Controles solo con ícono (`<ja-boton-icono>`): anterior, escuchar/pausar la narración (voz clonada,
 * `assets/blog/<slug>/voz/NN.mp3`), siguiente y «modo guiado», que al terminar cada narración pasa
 * solo al siguiente paso y lo narra. Las flechas ← → del teclado también cambian de paso, y en
 * pantallas táctiles deslizar el dedo sobre la tarjeta. En tableta y móvil las columnas se apilan, el
 * índice se vuelve una tira de pasos y los controles quedan en un dock fijo abajo.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { audioPaso, fechaLarga } from '../../../src/js/contenido/derivados.js';
import { alCambiarRuta, hrefDe } from '../../../src/js/base/rutas.js';
import { deslizar } from '../../../src/js/base/gestos.js';
import type { JaPostProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { Publicacion } from '../../../src/js/consts/schemas/contenido.schemas.js';
import { cargarPublicacion, urlPublica } from '../utils/publicaciones.js';
import '../../../src/js/components/ja/ja-boton-icono.js';
import '../../../src/js/components/ja/ja-forma.js';
import './ja-luz-demo.js';
import './ja-paso.js';

type Boton = HTMLElement & { props: Record<string, unknown> };
type Host = HTMLElement & { props: Partial<JaPostProps> };

const TECLADO = new WeakSet<HTMLElement>();
/** Slugs cuyo `post.json` no llegó: se pinta «no encontrada» en vez de volver a esperar. */
const PERDIDOS = new Set<string>();

const volverA = () => pieza('ja-boton-icono', { icono: 'mdi:arrow-left', etiqueta: 'Todas las publicaciones', href: hrefDe({ vista: 'blog' }) }, { class: 'volver' });

/** Mientras baja el JSON: la silueta de la guía con esqueletos del kit. */
function esperando(root: ShadowRoot): void {
  root.append(html`
    <div class="guia cargando" part="guia" aria-busy="true" aria-label="Cargando la publicación">
      <aside class="indice">
        <div class="arriba">${volverA()}</div>
        <iswc-skeleton effect="sheen" style="height:2rem;width:85%"></iswc-skeleton>
        <iswc-skeleton effect="sheen" style="height:1rem"></iswc-skeleton>
        <iswc-skeleton effect="sheen" style="height:1rem;width:70%"></iswc-skeleton>
      </aside>
      <section class="escenario"><iswc-skeleton effect="sheen" style="height:22rem;border-radius:1rem"></iswc-skeleton></section>
      <aside class="lado"><iswc-skeleton effect="sheen" style="height:18rem;border-radius:1rem"></iswc-skeleton></aside>
    </div>
  `);
}

function perdido(root: ShadowRoot): void {
  root.append(html`<div class="perdido">${volverA()}<iswc-callout tone="warning"><strong slot="title">Publicación no encontrada</strong>Revisa el enlace o vuelve a la lista del blog.</iswc-callout></div>`);
}

function guia(root: ShadowRoot, p: Publicacion, host: HTMLElement): void {
  const { perfil } = contenido;
  const total = p.pasos.length;
  const enlace = urlPublica(p.slug);
  root.append(html`
    ${pieza('ja-forma', { tipo: 'semicirculo', tono: 'acento', tam: 7, animacion: 'flotar' }, { class: 'forma f1' })}
    ${pieza('ja-forma', { tipo: 'zigzag', tono: 'lila', tam: 4, animacion: 'derivar', retraso: 2 }, { class: 'forma f2' })}
    ${pieza('ja-forma', { tipo: 'puntos', tono: 'marca', tam: 4.5, animacion: 'derivar', retraso: 4 }, { class: 'forma f3' })}
    <div class="guia" part="guia">
      <aside class="indice" part="indice" aria-label="Pasos de la guía">
        <div class="arriba">
          ${volverA()}
          <span class="insignia"><iswc-icon icon="mdi:headphones"></iswc-icon>Guía narrada</span>
        </div>
        <h1>${p.titulo}</h1>
        <p class="subtitulo">${p.subtitulo}</p>
        <div class="autor">
          <img src=${rutaSitio(perfil.logo)} alt="" width="36" height="36">
          <div><strong>${perfil.nombreCorto}</strong><span>${fechaLarga(p.fecha)}</span></div>
        </div>
        <div class="compartir" part="compartir">
          <iswc-share-button class="share" share-title=${p.titulo} text=${p.resumen} url=${enlace}></iswc-share-button>
          <iswc-copy-button class="copiar" value=${enlace} tooltip="full" copy-label="Copiar enlace" success-label="Enlace copiado" error-label="No se pudo copiar"></iswc-copy-button>
        </div>
        <div class="avance">
          <span class="cuenta"></span>
          <iswc-progress-bar class="barra" max=${total} value="1"></iswc-progress-bar>
        </div>
        <ol class="pasos">
          ${p.pasos.map((paso, i) => html`
            <li><button type="button" class="paso" data-i=${i}>
              <span class="num">${i + 1}</span>
              <iswc-icon icon=${paso.icono} aria-hidden="true"></iswc-icon>
              <span class="nombre">${paso.titulo}</span>
            </button></li>`)}
        </ol>
      </aside>
      <section class="escenario" part="escenario" aria-live="polite">
        <div class="zona-paso"></div>
      </section>
      <aside class="lado" part="lado">
        <figure class="demo">
          <span class="cinta c1" aria-hidden="true"></span>
          <span class="cinta c2" aria-hidden="true"></span>
          <div class="zona-demo"></div>
          <figcaption></figcaption>
        </figure>
        <nav class="controles" aria-label="Controles de la guía">
          ${pieza('ja-boton-icono', { icono: 'mdi:chevron-left', etiqueta: 'Paso anterior' }, { class: 'anterior' })}
          ${pieza('ja-boton-icono', { icono: 'mdi:play', etiqueta: 'Escuchar este paso', tono: 'marca', tam: 'lg' }, { class: 'escuchar' })}
          ${pieza('ja-boton-icono', { icono: 'mdi:chevron-right', etiqueta: 'Paso siguiente' }, { class: 'siguiente' })}
          <span class="onda" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          ${pieza('ja-boton-icono', { icono: 'mdi:auto-mode', etiqueta: 'Modo guiado: narra y avanza solo' }, { class: 'guiado' })}
          <p class="atajo"><kbd>←</kbd><kbd>→</kbd> cambian de paso</p>
        </nav>
      </aside>
    </div>
  `);

  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T;
  const zonaPaso = q('.zona-paso');
  const zonaDemo = q('.zona-demo');
  const leyenda = q('figcaption');
  const figura = q('.demo');
  const cuenta = q('.cuenta');
  const barra = q('.barra');
  const items = [...root.querySelectorAll<HTMLButtonElement>('.paso')];
  const [anterior, escuchar, siguiente, guiadoBtn] = ['.anterior', '.escuchar', '.siguiente', '.guiado'].map((s) => q<Boton>(s));
  const audio = new Audio();
  audio.preload = 'none';
  let actual = -1;
  let sonando = false;
  let guiado = false;

  const fijar = (b: Boton, cambios: Record<string, unknown>) => (b.props = { ...b.props, ...cambios });

  const pintarAudio = () => {
    host.toggleAttribute('data-sonando', sonando);
    fijar(escuchar!, { icono: sonando ? 'mdi:pause' : 'mdi:play', etiqueta: sonando ? 'Pausar la narración' : 'Escuchar este paso' });
    fijar(guiadoBtn!, { activo: guiado });
  };

  const reproducir = () => {
    audio.play().then(() => {
      sonando = true;
      pintarAudio();
    }, () => {
      sonando = false;
      pintarAudio();
    });
  };

  const ir = (i: number, desdeUsuario = true) => {
    if (i < 0 || i >= total || i === actual) return;
    const previo = actual;
    actual = i;
    const paso = p.pasos[i]!;
    zonaPaso.replaceChildren(pieza('ja-paso', { paso, indice: i, total, creditos: p.creditos ?? '' }));
    const demo = paso.demo;
    figura.hidden = !demo;
    if (demo && (previo < 0 || p.pasos[previo]?.demo?.paso !== demo.paso)) zonaDemo.replaceChildren(pieza('ja-luz-demo', { paso: demo.paso }));
    leyenda.textContent = demo?.leyenda ?? '';
    cuenta.textContent = `Paso ${i + 1} de ${total}`;
    barra.setAttribute('value', String(i + 1));
    items.forEach((b, k) => {
      b.toggleAttribute('data-hecho', k < i);
      b.toggleAttribute('data-actual', k === i);
      if (k === i) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    items[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    fijar(anterior!, { deshabilitado: i === 0 });
    fijar(siguiente!, { deshabilitado: i === total - 1 });
    audio.src = rutaSitio(audioPaso(p, i));
    if (sonando) reproducir();
    // Si la tarjeta quedó arriba de la ventana (móvil, scroll largo), se trae a la vista.
    if (desdeUsuario && previo >= 0 && zonaPaso.getBoundingClientRect().top < 0) zonaPaso.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  audio.addEventListener('ended', () => {
    if (guiado && actual < total - 1) ir(actual + 1, false);
    else {
      sonando = false;
      pintarAudio();
    }
  });
  audio.addEventListener('error', () => {
    sonando = false;
    pintarAudio();
  });

  for (const b of items) b.addEventListener('click', () => ir(Number(b.dataset.i)));
  deslizar(zonaPaso, (paso) => ir(actual + paso));
  anterior!.addEventListener('click', () => ir(actual - 1));
  siguiente!.addEventListener('click', () => ir(actual + 1));
  escuchar!.addEventListener('click', () => {
    if (sonando) {
      audio.pause();
      sonando = false;
      pintarAudio();
    } else reproducir();
  });
  guiadoBtn!.addEventListener('click', () => {
    guiado = !guiado;
    if (guiado && !sonando) reproducir();
    pintarAudio();
  });
  if (!TECLADO.has(host)) {
    TECLADO.add(host);
    // Al salir de la publicación (la SPA la desmonta al cambiar de ruta) la narración se detiene.
    const baja = alCambiarRuta(() => {
      if (host.isConnected) return;
      audio.pause();
      baja();
    });
    addEventListener('keydown', (ev) => {
      if (!host.isConnected || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      const destino = ev.composedPath()[0] as HTMLElement | undefined;
      if (destino && /^(INPUT|TEXTAREA|SELECT)$/.test(destino.tagName)) return;
      if (ev.key === 'ArrowRight') ir(actual + 1);
      if (ev.key === 'ArrowLeft') ir(actual - 1);
    });
  }
  ir(0, false);
  pintarAudio();
}

const JaPost = crearComponente<JaPostProps>(import.meta.url, 'ja-post', { slug: '', datos: null }, (root, props, host) => {
  // `datos` manda si no hay slug o si es la publicación de ese slug; si no, se descarga el JSON del slug.
  const datos = props.datos && (!props.slug || props.datos.slug === props.slug) ? props.datos : null;
  if (datos) return guia(root, datos, host);
  if (!props.slug || PERDIDOS.has(props.slug)) return perdido(root);
  esperando(root);
  const slug = props.slug;
  void cargarPublicacion(slug).then((p) => {
    if (!host.isConnected || (host as Host).props.slug !== slug) return;
    if (!p) PERDIDOS.add(slug);
    (host as Host).props = { datos: p };
  });
}, undefined, ['slug']);

define('ja-post', JaPost);
