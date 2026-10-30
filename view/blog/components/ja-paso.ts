/**
 * <ja-paso> — tarjeta de un paso de una publicación guiada: sello con el número, ícono, título, la
 * transcripción de la narración (lo que dice la voz) y los bloques del paso (`<ja-bloque>`). En el
 * último paso suma los créditos de la publicación. Recibe el paso por props (`paso`, `indice`, `total`,
 * `creditos`): no lee el contenido importado, así `<ja-post>` le pasa lo que viene de `post.json`.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import type { JaPasoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import './ja-bloque.js';

const JaPaso = crearComponente<JaPasoProps>(import.meta.url, 'ja-paso', { paso: null, indice: 0, total: 1, creditos: '' }, (root, props) => {
  const { paso, indice, total, creditos } = props;
  if (!paso) return;
  const ultimo = indice === total - 1;
  root.append(html`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <span class="pliegue" aria-hidden="true"></span>
      <header class="cabecera">
        <span class="sello" aria-hidden="true">${String(indice + 1).padStart(2, '0')}</span>
        <div class="textos">
          <p class="cejilla">Paso ${indice + 1} de ${total}</p>
          <h2 id="titulo">${paso.titulo}</h2>
        </div>
        <span class="icono" aria-hidden="true"><iswc-icon icon=${paso.icono}></iswc-icon></span>
      </header>
      <blockquote class="narracion" part="narracion">
        <iswc-icon icon="mdi:microphone-outline" aria-hidden="true"></iswc-icon>
        <p>${paso.narracion}</p>
      </blockquote>
      ${paso.bloques.length ? html`<div class="bloques" part="bloques">${paso.bloques.map((b) => pieza('ja-bloque', { bloque: b }))}</div>` : null}
      ${ultimo && creditos ? html`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${creditos}</iswc-callout>` : null}
    </article>
  `);
});

define('ja-paso', JaPaso);
