/**
 * <ja-paso> — tarjeta de un paso de una publicación guiada: sello con el número, ícono, título, la
 * transcripción de la narración (lo que dice la voz) y los bloques del paso (`<ja-bloque>`). En el
 * último paso suma los créditos de la publicación.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import type { JaPasoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import './ja-bloque.js';

const JaPaso = crearComponente<JaPasoProps>(import.meta.url, 'ja-paso', { slug: '', indice: 0 }, (root, props) => {
  const p = contenido.blog.find((x) => x.slug === props.slug);
  const paso = p?.pasos[props.indice];
  if (!p || !paso) return;
  const ultimo = props.indice === p.pasos.length - 1;
  root.append(html`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <span class="pliegue" aria-hidden="true"></span>
      <header class="cabecera">
        <span class="sello" aria-hidden="true">${String(props.indice + 1).padStart(2, '0')}</span>
        <div class="textos">
          <p class="cejilla">Paso ${props.indice + 1} de ${p.pasos.length}</p>
          <h2 id="titulo">${paso.titulo}</h2>
        </div>
        <span class="icono" aria-hidden="true"><iswc-icon icon=${paso.icono}></iswc-icon></span>
      </header>
      <blockquote class="narracion" part="narracion">
        <iswc-icon icon="mdi:microphone-outline" aria-hidden="true"></iswc-icon>
        <p>${paso.narracion}</p>
      </blockquote>
      ${paso.bloques.length ? html`<div class="bloques" part="bloques">${paso.bloques.map((b) => pieza('ja-bloque', { bloque: b }))}</div>` : null}
      ${ultimo && p.creditos ? html`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${p.creditos}</iswc-callout>` : null}
    </article>
  `);
});

define('ja-paso', JaPaso);
