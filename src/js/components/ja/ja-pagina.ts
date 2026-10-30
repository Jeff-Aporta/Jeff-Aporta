/**
 * <ja-pagina> — shell mínimo de una página especializada (`blog/index.html`, `blog/<slug>/index.html`):
 * barra fija con la marca (enlace a la portada), las dos vistas como enlaces y el tema; la vista
 * montada por la propia página en el slot; y el pie común (`<ja-pie>`). No enruta: cada enlace carga su
 * página (la portada con `?s=`, el blog con su URL limpia), por eso aquí no hay `iswc-app-nav` ni
 * scroll-spy. `activa` marca la vista de la página (atributo o prop).
 */
import { crearComponente, define, html, pieza } from '../../base/componente.js';
import { hrefDe } from '../../base/rutas.js';
import type { JaPaginaProps } from '../../consts/schemas/componentes.schemas.js';
import './ja-marca.js';
import './ja-pie.js';

const JaPagina = crearComponente<JaPaginaProps>(import.meta.url, 'ja-pagina', { activa: 'blog' }, (root, props) => {
  const vistas = [
    { id: 'portafolio', etiqueta: 'Yo', icono: 'mdi:account-tie-outline', href: hrefDe({ vista: 'portafolio', seccion: 'inicio' }) },
    { id: 'blog', etiqueta: 'Blog', icono: 'mdi:post-outline', href: hrefDe({ vista: 'blog' }) },
  ];
  root.append(html`
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        <a class="marca" href=${hrefDe({ vista: 'portafolio', seccion: 'inicio' })} aria-label="Ir al inicio">${pieza('ja-marca', { subtitulo: 'Full Stack Developer' })}</a>
        <nav class="vistas" part="vistas" aria-label="Vistas">
          ${vistas.map((v) => html`<a class="vista" href=${v.href} ?data-activa=${v.id === props.activa} aria-current=${v.id === props.activa ? 'page' : 'false'}><iswc-icon icon=${v.icono}></iswc-icon>${v.etiqueta}</a>`)}
        </nav>
        <div class="acciones">
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
    </header>
    <main id="contenido" class="contenido" part="contenido"><slot></slot></main>
    ${pieza('ja-pie', {})}
  `);
}, undefined, ['activa']);

define('ja-pagina', JaPagina);
