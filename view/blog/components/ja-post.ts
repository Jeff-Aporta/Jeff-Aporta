/**
 * <ja-post> — una publicación en una sola página: encabezado (título, subtítulo, autor, fecha,
 * etiquetas), un índice compacto con anclas y TODOS los pasos seguidos en un solo flujo de lectura
 * (`<ja-paso>`, cada uno con su demo). Sin paginación ni controles grandes: cada paso con narración lleva
 * su propio botón pequeño play/pausa; aquí vive el único `Audio`, así al reproducir un paso se pausa el
 * que sonara. El «Compartir» va en la barra del sitio (`<ja-app>` / `<ja-pagina>`), no aquí.
 *
 * Datos mínimos: con `slug` descarga `blog/<slug>/post.json` (lo escribe el build desde
 * `src/js/contenido/blog/`, validado con `PublicacionSchema`; mientras llega pinta esqueletos del kit) o
 * recibe la publicación completa en `datos`. Así la misma pieza sirve en la SPA (`<ja-app>` la monta por
 * slug) y en la página especializada `blog/<slug>/index.html` (`<ja-post slug="…">` en HTML estático, con
 * el resumen del post como hijos de luz para rastreadores sin JS).
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { audioPaso, fechaLarga } from '../../../src/js/contenido/derivados.js';
import { alCambiarRuta, estadoSpa } from '../../../src/js/base/rutas.js';
import type { JaPostProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { Publicacion } from '../../../src/js/consts/schemas/contenido.schemas.js';
import { cargarPublicacion } from '../utils/publicaciones.js';
import '../../../src/js/components/ja/ja-link.js';
import './ja-paso.js';

type Host = HTMLElement & { props: Partial<JaPostProps> };
type Paso = HTMLElement & { props: Record<string, unknown> };

const ESCUCHANDO = new WeakSet<HTMLElement>();
/** Slugs cuyo `post.json` no llegó: se pinta «no encontrada» en vez de volver a esperar. */
const PERDIDOS = new Set<string>();

const volver = () => pieza('ja-link', { state: estadoSpa({ vista: 'blog' }), variant: 'button', icon: 'mdi:arrow-left', shape: 'pill' }, { class: 'volver' }, 'Todas las publicaciones');

/** Mientras baja el JSON: la silueta de la publicación con esqueletos del kit. */
function esperando(root: ShadowRoot): void {
  root.append(html`
    <div class="articulo cargando" part="articulo" aria-busy="true" aria-label="Cargando la publicación">
      ${volver()}
      <iswc-skeleton effect="sheen" style="height:2.4rem;width:70%"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:1.1rem"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:14rem;border-radius:1rem"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:14rem;border-radius:1rem"></iswc-skeleton>
    </div>
  `);
}

function perdido(root: ShadowRoot): void {
  root.append(html`<div class="articulo perdido">${volver()}<iswc-callout tone="warning"><strong slot="title">Publicación no encontrada</strong>Revisa el enlace o vuelve a la lista del blog.</iswc-callout></div>`);
}

function articulo(root: ShadowRoot, p: Publicacion, host: HTMLElement): void {
  const { perfil } = contenido;
  const total = p.pasos.length;
  root.append(html`
    <article class="articulo" part="articulo">
      <header class="encabezado" part="encabezado">
        ${volver()}
        <h1>${p.titulo}</h1>
        <p class="subtitulo">${p.subtitulo}</p>
        <div class="meta">
          <img src=${rutaSitio(perfil.logo)} alt="" width="32" height="32">
          <span class="autor">${perfil.nombreCorto}</span>
          <span class="sep" aria-hidden="true">·</span>
          <time datetime=${p.fecha}>${fechaLarga(p.fecha)}</time>
          <span class="sep" aria-hidden="true">·</span>
          <span>${total} pasos</span>
        </div>
        <div class="etiquetas">${p.etiquetas.map((e) => html`<iswc-tag variant="soft" color="brand" pill>${e}</iswc-tag>`)}</div>
        <nav class="indice" part="indice" aria-label="Contenido">
          <ol>${p.pasos.map((paso, i) => html`<li><a href=${`#paso-${i + 1}`} data-spa="off">${paso.titulo}</a></li>`)}</ol>
        </nav>
      </header>
      <div class="pasos" part="pasos">
        ${p.pasos.map((paso, i) => pieza('ja-paso', { paso, indice: i, total, creditos: p.creditos ?? '', audio: rutaSitio(audioPaso(p, i)) }, { id: `paso-${i + 1}` }))}
      </div>
    </article>
  `);

  // Un solo audio para toda la publicación: reproducir un paso pausa el que sonara.
  const pasos = [...root.querySelectorAll<Paso>('ja-paso')];
  const audio = new Audio();
  audio.preload = 'none';
  let actual = -1;
  // Estado propio (no `audio.paused`): el botón responde al instante, antes de que `play()` resuelva.
  let sonando = false;
  const marcar = (i: number) => pasos.forEach((el, k) => (el.props = { ...el.props, sonando: k === i }));
  const detener = () => {
    audio.pause();
    sonando = false;
    marcar(-1);
  };
  const reproducir = (i: number) => {
    if (i !== actual) {
      audio.src = rutaSitio(audioPaso(p, i));
      actual = i;
    }
    sonando = true;
    marcar(i);
    audio.play().catch(detener);
  };
  root.addEventListener('ja-narracion', (ev) => {
    const i = (ev as CustomEvent<{ indice: number }>).detail.indice;
    if (i === actual && sonando) detener();
    else reproducir(i);
  });
  audio.addEventListener('ended', detener);
  audio.addEventListener('error', detener);
  // Las anclas del índice bajan suave al paso (el router no las toca: `data-spa="off"`).
  root.querySelector('.indice')?.addEventListener('click', (ev) => {
    const a = (ev.target as HTMLElement).closest('a');
    if (!a) return;
    ev.preventDefault();
    root.getElementById(a.getAttribute('href')!.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (!ESCUCHANDO.has(host)) {
    ESCUCHANDO.add(host);
    // Al salir de la publicación (la SPA la desmonta al cambiar de ruta) la narración se detiene.
    const baja = alCambiarRuta(() => {
      if (host.isConnected) return;
      audio.pause();
      baja();
    });
  }
}

const JaPost = crearComponente<JaPostProps>(import.meta.url, 'ja-post', { slug: '', datos: null }, (root, props, host) => {
  // `datos` manda si no hay slug o si es la publicación de ese slug; si no, se descarga el JSON del slug.
  const datos = props.datos && (!props.slug || props.datos.slug === props.slug) ? props.datos : null;
  if (datos) return articulo(root, datos, host);
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
