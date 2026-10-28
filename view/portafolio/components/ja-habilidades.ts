/**
 * <ja-habilidades> — un `<ja-rasgo>` por área (con sus tecnologías como `iswc-tag`) y el uso real,
 * calculado desde la experiencia sin doble conteo: primero por área (IA incluida) y luego por
 * tecnología, cada fila un `<ja-barra-uso>`.
 *
 * Cada área muestra sus primeras `VISIBLES` tecnologías y un botón «+N más»; al pulsar cualquiera se
 * despliegan todas las áreas.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import { usoAreas, usoTecnologias } from '../../../src/js/contenido/derivados.js';
import type { SinProps, Tono } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { UsoTecnologia } from '../../../src/js/consts/schemas/contenido.schemas.js';
import '../../../src/js/components/ja/ja-rasgo.js';
import './ja-barra-uso.js';

const VISIBLES = 8;

const TONOS: Tono[] = ['marca', 'acento', 'lila', 'exito', 'peligro', 'marca', 'acento', 'lila'];

const barras = (lista: UsoTecnologia[]) => {
  const maximo = Math.max(...lista.map((u) => u.meses), 1);
  return html`<div class="barras">${lista.map((u) => pieza('ja-barra-uso', { nombre: u.nombre, meses: u.meses, maximo }))}</div>`;
};

const JaHabilidades = crearComponente<SinProps>(import.meta.url, 'ja-habilidades', {}, (root, _props, host) => {
  const { experiencia, habilidades } = contenido;
  const etiquetas = (items: string[]) => html`
    <div class="items">
      ${items.map((i, k) => html`<iswc-tag class=${k < VISIBLES ? '' : 'extra'} variant="outlined" pill>${i}</iswc-tag>`)}
      ${items.length > VISIBLES ? html`<button type="button" class="mas" aria-label=${`Ver ${items.length - VISIBLES} tecnologías más`} onclick=${() => host.toggleAttribute('data-todas', true)}>+${items.length - VISIBLES} más</button>` : null}
    </div>`;
  root.append(html`
    <div class="areas" part="areas">
      ${habilidades.map((g, i) => pieza('ja-rasgo', { icono: g.icono, titulo: g.titulo, texto: g.descripcion, tono: TONOS[i % TONOS.length] }, {}, etiquetas(g.items)))}
    </div>
    <iswc-card class="uso" part="uso" variant="outlined">
      <div class="uso-cabeza">
        <h3>Experiencia acumulada</h3>
        <p>Cuánto tiempo he usado cada área y tecnología en mis trabajos. Cada mes cuenta una sola vez.</p>
      </div>
      <div class="bloques">
        <section>
          <h4>Por área</h4>
          ${barras(usoAreas(experiencia, habilidades))}
        </section>
        <section>
          <h4>Por tecnología</h4>
          ${barras(usoTecnologias(experiencia, 12))}
        </section>
      </div>
    </iswc-card>
  `);
});

define('ja-habilidades', JaHabilidades);
