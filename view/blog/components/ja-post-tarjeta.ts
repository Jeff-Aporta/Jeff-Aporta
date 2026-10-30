/**
 * <ja-post-tarjeta> — tarjeta de una publicación en la lista del blog: portada, fecha, número de
 * pasos, título, resumen y etiquetas. Toda la tarjeta es un `<ja-link>` al post (estado `{ v: 'post', p }`,
 * que la SPA navega sin recargar y reescribe a la URL limpia `blog/<slug>/`). Lee el contenido importado:
 * la lista no necesita descargar JSON.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { fechaLarga } from '../../../src/js/contenido/derivados.js';
import { estadoSpa } from '../../../src/js/base/rutas.js';
import type { JaPostTarjetaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-link.js';

const JaPostTarjeta = crearComponente<JaPostTarjetaProps>(import.meta.url, 'ja-post-tarjeta', { slug: '' }, (root, props) => {
  const p = contenido.blog.find((x) => x.slug === props.slug);
  if (!p) return;
  const cuerpo = html`
    <div class="portada"><img src=${rutaSitio(p.portada.src)} alt=${p.portada.alt} loading="lazy"></div>
    <div class="cuerpo">
      <p class="meta"><iswc-icon icon="mdi:calendar-blank-outline"></iswc-icon>${fechaLarga(p.fecha)} · <iswc-icon icon="mdi:cards-outline"></iswc-icon>${p.pasos.length} pasos · <iswc-icon icon="mdi:headphones"></iswc-icon>narrada</p>
      <h3>${p.titulo}</h3>
      <p class="resumen">${p.resumen}</p>
      <div class="etiquetas">${p.etiquetas.map((e) => html`<iswc-tag variant="soft" color="brand" pill>${e}</iswc-tag>`)}</div>
      <span class="leer">Leer la guía <iswc-icon icon="mdi:arrow-right"></iswc-icon></span>
    </div>
  `;
  root.append(pieza('ja-link', { state: estadoSpa({ vista: 'post', slug: p.slug }) }, { class: 'tarjeta', part: 'tarjeta' }, cuerpo));
});

define('ja-post-tarjeta', JaPostTarjeta);
