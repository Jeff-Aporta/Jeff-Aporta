/**
 * <ja-pagina> — shell mínimo de una página especializada (`blog/index.html`, `blog/<slug>/index.html`):
 * barra fija con la marca (enlace a la portada), las dos vistas como `<ja-link>` al SPA, «Compartir» y el
 * tema; la vista montada por la propia página en el slot; y el pie común (`<ja-pie>`). No enruta: cada
 * enlace carga su página (el SPA con `?s=`, resuelto contra `<html data-spa-base>`), por eso aquí no hay
 * `iswc-app-nav` ni scroll-spy. `activa` marca la vista de la página (atributo o prop).
 *
 * «Compartir»: `<iswc-share-button>` del kit con la URL canónica de la página (`<link rel="canonical">`;
 * si falta, la actual); sin Web Share copia al portapapeles y avisa con el toast.
 */
import { avisar, crearComponente, define, html, pieza } from '../../base/componente.js';
import { estadoSpa } from '../../base/rutas.js';
import type { JaPaginaProps } from '../../consts/schemas/componentes.schemas.js';
import './ja-link.js';
import './ja-marca.js';
import './ja-pie.js';

const JaPagina = crearComponente<JaPaginaProps>(import.meta.url, 'ja-pagina', { activa: 'blog' }, (root, props) => {
  const vistas = [
    { id: 'portafolio', etiqueta: 'Yo', icono: 'mdi:account-tie-outline', state: estadoSpa({ vista: 'portafolio', seccion: 'inicio' }) },
    { id: 'blog', etiqueta: 'Blog', icono: 'mdi:post-outline', state: estadoSpa({ vista: 'blog' }) },
  ] as const;
  const canonica = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || location.href;
  root.append(html`
    <a class="saltar" href="#contenido" data-spa="off">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        ${pieza('ja-link', { state: estadoSpa({ vista: 'portafolio', seccion: 'inicio' }) }, { class: 'marca', 'aria-label': 'Ir al inicio' }, pieza('ja-marca', { subtitulo: 'Full Stack Developer' }))}
        <nav class="vistas" part="vistas" aria-label="Vistas">
          ${vistas.map((v) => pieza('ja-link', { state: v.state, variant: 'nav', icon: v.icono }, { class: 'vista', 'data-activa': v.id === props.activa, 'aria-current': v.id === props.activa ? 'page' : false }, v.etiqueta))}
        </nav>
        <div class="acciones">
          <iswc-share-button class="compartir" url=${canonica} share-title=${document.title} aria-label="Compartir esta página" title="Compartir esta página"><iswc-icon icon="mdi:share-variant-outline"></iswc-icon></iswc-share-button>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
    </header>
    <main id="contenido" class="contenido" part="contenido"><slot></slot></main>
    ${pieza('ja-pie', {})}
  `);
  const compartir = root.querySelector('.compartir')!;
  compartir.addEventListener('iswc-share', (ev) => {
    if ((ev as CustomEvent<{ how: string }>).detail?.how === 'copied') avisar('Enlace copiado', 'success');
  });
  compartir.addEventListener('iswc-error', () => avisar('No se pudo compartir', 'warning'));
}, undefined, ['activa']);

define('ja-pagina', JaPagina);
