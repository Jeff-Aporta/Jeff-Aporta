/**
 * <ja-barra-uso> — fila de uso acumulado de una tecnología: nombre, barra (iswc-progress-bar) y
 * años acumulados (un decimal).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { anios } from '../../../src/js/contenido/derivados.js';
import type { JaBarraUsoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaBarraUso = crearComponente<JaBarraUsoProps>(import.meta.url, 'ja-barra-uso', { nombre: '', meses: 0, maximo: 1 }, (root, props) => {
  const valor = Math.round((props.meses / Math.max(props.maximo, 1)) * 100);
  root.append(html`
    <span class="nombre" part="nombre">${props.nombre}</span>
    <iswc-progress-bar value=${String(valor)} label=${`${props.nombre}: ${anios(props.meses)}`}></iswc-progress-bar>
    <span class="valor" part="valor">${anios(props.meses)}</span>
  `);
});

define('ja-barra-uso', JaBarraUso);
