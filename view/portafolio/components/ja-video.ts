/**
 * <ja-video> — video de YouTube con fachada: miniatura y botón de reproducir; el reproductor
 * (youtube-nocookie) solo se carga al pulsar, así la página no paga el peso de YouTube al abrir.
 *
 * La MINIATURA tampoco entra en la descarga inicial: se pide cuando la fachada va a verse (la trae
 * un `IntersectionObserver`) y, si no hay copia propia, se cae a la de YouTube (y su respaldo).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { JaVideoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

type Host = HTMLElement & { props: Partial<JaVideoProps> };

const JaVideo = crearComponente<JaVideoProps>(import.meta.url, 'ja-video', { youtubeId: '', titulo: 'Video', activo: false, miniatura: '' }, (root, props, host) => {
  if (!props.youtubeId) return;
  if (props.activo) {
    const src = `https://www.youtube-nocookie.com/embed/${props.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    root.append(html`<div class="marco" part="marco"><iframe src=${src} title=${props.titulo} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`);
    return;
  }
  const reproducir = () => {
    (host as Host).props = { activo: true };
    emitir(host, 'ja-video-play', { youtubeId: props.youtubeId });
  };
  // La miniatura del propio sitio si la hay; si no, la de YouTube.
  const propia = props.miniatura;
  const remota = `https://i.ytimg.com/vi/${props.youtubeId}/maxresdefault.jpg`;
  // Si el video no tiene miniatura en alta, YouTube responde 404: se cae a la de calidad alta estándar.
  const respaldo = `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg`;
  root.append(html`
    <button class="marco fachada" part="marco" type="button" aria-label=${`Reproducir: ${props.titulo}`} onclick=${reproducir}>
      <img alt="" width="1280" height="720" loading="lazy" decoding="async">
      <span class="velo" aria-hidden="true"></span>
      <span class="play" aria-hidden="true"><iswc-icon icon="mdi:play"></iswc-icon></span>
      <span class="leyenda"><iswc-icon icon="mdi:youtube"></iswc-icon>${props.titulo}</span>
    </button>
  `);
  const img = root.querySelector('img')!;
  img.addEventListener('error', () => {
    if (img.src !== respaldo) img.src = respaldo;
  });
  // La fachada está bajo el pliegue: la miniatura se pide al acercarse a la pantalla, no al arrancar.
  const pedir = () => {
    img.src = propia || remota;
  };
  if (typeof IntersectionObserver === 'function') {
    const obs = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      pedir();
    }, { rootMargin: '200px' });
    obs.observe(img);
  } else pedir();
});

define('ja-video', JaVideo);
