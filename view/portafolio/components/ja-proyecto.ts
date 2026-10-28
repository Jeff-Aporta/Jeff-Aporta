/**
 * <ja-proyecto> — tarjeta de un proyecto, por id: portada (imagen o logo), categoría,
 * descripción, tecnologías y acciones (demo, código, video).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import type { JaProyectoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaProyecto = crearComponente<JaProyectoProps>(import.meta.url, 'ja-proyecto', { id: '' }, (root, props, host) => {
  const p = contenido.proyectos.find((x) => x.id === props.id);
  if (!p) return;
  host.dataset.tipo = p.tipo;
  // Captura real de la app como portada; si además hay logo, va como sello en la esquina.
  const portada = p.imagen
    ? html`<img class="imagen" src=${rutaSitio(p.imagen)} alt=${`Captura de ${p.titulo}`} loading="lazy" decoding="async">${p.logo ? html`<img class="sello" src=${rutaSitio(p.logo)} alt="" loading="lazy">` : null}`
    : html`<img class="logo" src=${rutaSitio(p.logo ?? '')} alt=${`Logo de ${p.titulo}`} loading="lazy">`;
  root.append(html`
    <article class="tarjeta" part="tarjeta">
      <div class="portada" part="portada">
        ${portada}
        <iswc-tag class="categoria" variant="filled" color="brand" pill>${p.categoria}</iswc-tag>
      </div>
      <div class="cuerpo">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <div class="tecnologias">${p.tecnologias.map((t) => html`<span>${t}</span>`)}</div>
      </div>
      <div class="acciones">
        ${p.demo ? html`<iswc-button color="brand" variant="filled" shape="pill" href=${p.demo} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Demo</iswc-button>` : null}
        ${p.codigo ? html`<iswc-button variant="outlined" shape="pill" href=${p.codigo} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:github"></iswc-icon>Código</iswc-button>` : null}
        ${p.video ? html`<iswc-button variant="ghost" shape="pill" href=${p.video} target="_blank" rel="noopener" title="Ver en YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>` : null}
      </div>
    </article>
  `);
});

define('ja-proyecto', JaProyecto);
