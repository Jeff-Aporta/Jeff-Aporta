/**
 * <ja-proyectos> — catálogo de proyectos en pestañas del kit (`iswc-tab-group`): productos
 * publicados y laboratorio creativo. Cada tarjeta es un `<ja-proyecto>`. En pantallas táctiles,
 * deslizar el dedo sobre las tarjetas pasa a la pestaña vecina.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import { deslizar } from '../../../src/js/base/gestos.js';
import type { JaProyectosProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import './ja-proyecto.js';

const PESTANAS: Array<[JaProyectosProps['tipo'], string, string, string]> = [
  ['Producto', 'Maquetas', '', 'mdi:application-outline'],
  ['Open source', 'Open source', '', 'mdi:github'],
  ['Educativo', 'Educativo', '', 'mdi:school-outline'],
  ['Laboratorio', 'Laboratorio', '', 'mdi:flask-outline'],
];

const JaProyectos = crearComponente<JaProyectosProps>(import.meta.url, 'ja-proyectos', { tipo: 'Producto' }, (root, props) => {
  const { proyectos } = contenido;
  root.append(html`
    <iswc-tab-group id="proyectos" state active=${props.tipo} part="pestanas">
      ${PESTANAS.map(([tipo, etiqueta, resto, icono]) => html`
        <iswc-tab slot="nav" panel=${tipo}>
          <iswc-icon icon=${icono}></iswc-icon>
          <span class="cuenta">${proyectos.filter((p) => p.tipo === tipo).length}</span>
          <span class="nombre">${etiqueta}${resto ? html`<span class="largo">${resto}</span>` : null}</span>
        </iswc-tab>
      `)}
      ${PESTANAS.map(([tipo]) => html`
        <iswc-tab-panel name=${tipo}>
          <div class=${`rejilla ${tipo === 'Laboratorio' ? 'laboratorio' : 'productos'}`}>
            ${proyectos.filter((p) => p.tipo === tipo).map((p) => pieza('ja-proyecto', { id: p.id }))}
          </div>
        </iswc-tab-panel>
      `)}
    </iswc-tab-group>
  `);
  const grupo = root.querySelector('iswc-tab-group') as HTMLElement & { active: string };
  const tipos = PESTANAS.map(([tipo]) => tipo);
  deslizar(grupo, (paso) => {
    const destino = tipos[tipos.indexOf(grupo.active as JaProyectosProps['tipo']) + paso];
    if (destino) grupo.active = destino;
  });
});

define('ja-proyectos', JaProyectos);
