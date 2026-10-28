/**
 * <ja-bloque> — un bloque dentro de un paso de una publicación guiada: markdown (`iswc-md-render`),
 * código (`iswc-code`) o nota (`iswc-callout` + markdown).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { JaBloqueProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaBloque = crearComponente<JaBloqueProps>(import.meta.url, 'ja-bloque', { bloque: null }, (root, props, host) => {
  const b = props.bloque;
  if (!b) return;
  host.dataset.tipo = b.tipo;
  if (b.tipo === 'md') root.append(html`<iswc-md-render class="texto" readonly value=${b.md}></iswc-md-render>`);
  if (b.tipo === 'nota') {
    root.append(html`
      <iswc-callout tone=${b.tono}>
        <strong slot="title">${b.titulo}</strong>
        <iswc-md-render class="texto" readonly value=${b.md}></iswc-md-render>
      </iswc-callout>
    `);
  }
  if (b.tipo === 'codigo') {
    root.append(html`
      <figure class="codigo">
        ${b.titulo ? html`<figcaption><iswc-icon icon="mdi:code-tags"></iswc-icon>${b.titulo}</figcaption>` : null}
        <iswc-code lang=${b.lenguaje} readonly compact line-numbers value=${b.codigo}></iswc-code>
      </figure>
    `);
  }
});

define('ja-bloque', JaBloque);
