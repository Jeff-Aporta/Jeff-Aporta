/**
 * <ja-educacion> — formación académica: una `<ja-estudio>` por estudio, en rejilla.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import './ja-estudio.js';

const JaEducacion = crearComponente<SinProps>(import.meta.url, 'ja-educacion', {}, (root) => {
  root.append(html`<div class="lista" part="lista">${contenido.educacion.map((s) => pieza('ja-estudio', { id: s.id }))}</div>`);
});

define('ja-educacion', JaEducacion);
