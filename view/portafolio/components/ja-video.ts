/**
 * <ja-video> — video de YouTube con fachada: miniatura y botón de reproducir; el reproductor
 * (youtube-nocookie) solo se carga al pulsar, así la página no paga el peso de YouTube al abrir.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { JaVideoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

type Host = HTMLElement & { props: Partial<JaVideoProps> };

const JaVideo = crearComponente<JaVideoProps>(import.meta.url, 'ja-video', { youtubeId: '', titulo: 'Video', activo: false }, (root, props, host) => {
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
  const miniatura = `https://i.ytimg.com/vi/${props.youtubeId}/maxresdefault.jpg`;
  // Si el video no tiene miniatura en alta, YouTube responde 404: se cae a la de calidad alta estándar.
  const respaldo = (ev: Event) => {
    const img = ev.currentTarget as HTMLImageElement;
    if (!img.src.includes('hqdefault')) img.src = `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg`;
  };
  root.append(html`
    <button class="marco fachada" part="marco" type="button" aria-label=${`Reproducir: ${props.titulo}`} onclick=${reproducir}>
      <img src=${miniatura} alt="" loading="lazy" decoding="async" onerror=${respaldo}>
      <span class="velo" aria-hidden="true"></span>
      <span class="play" aria-hidden="true"><iswc-icon icon="mdi:play"></iswc-icon></span>
      <span class="leyenda"><iswc-icon icon="mdi:youtube"></iswc-icon>${props.titulo}</span>
    </button>
  `);
});

define('ja-video', JaVideo);
