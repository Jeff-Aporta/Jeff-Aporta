/**
 * <ja-post-tarjeta> — tarjeta de una publicación en la lista del blog: portada, fecha, número de
 * pasos, título, resumen y etiquetas. Toda la tarjeta enlaza a la vista completa (URL limpia `blog/<slug>/`,
 * que la SPA navega sin recargar). Lee el contenido importado: la lista no necesita descargar JSON.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { fechaLarga } from '../../../src/js/contenido/derivados.js';
import { hrefDe } from '../../../src/js/base/rutas.js';
import type { JaPostTarjetaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaPostTarjeta = crearComponente<JaPostTarjetaProps>(import.meta.url, 'ja-post-tarjeta', { slug: '' }, (root, props) => {
  const p = contenido.blog.find((x) => x.slug === props.slug);
  if (!p) return;
  root.append(html`
    <a class="tarjeta" part="tarjeta" href=${hrefDe({ vista: 'post', slug: p.slug })}>
      <div class="portada"><img src=${rutaSitio(p.portada.src)} alt=${p.portada.alt} loading="lazy"></div>
      <div class="cuerpo">
        <p class="meta"><iswc-icon icon="mdi:calendar-blank-outline"></iswc-icon>${fechaLarga(p.fecha)} · <iswc-icon icon="mdi:cards-outline"></iswc-icon>${p.pasos.length} pasos · <iswc-icon icon="mdi:headphones"></iswc-icon>narrada</p>
        <h3>${p.titulo}</h3>
        <p class="resumen">${p.resumen}</p>
        <div class="etiquetas">${p.etiquetas.map((e) => html`<iswc-tag variant="soft" color="brand" pill>${e}</iswc-tag>`)}</div>
        <span class="leer">Empezar la guía <iswc-icon icon="mdi:arrow-right"></iswc-icon></span>
      </div>
    </a>
  `);
});

define('ja-post-tarjeta', JaPostTarjeta);
