/**
 * <ja-lista> — lista con un ícono por ítem: `columna` (logros, viñetas) o `linea` (roles en fila).
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { JaListaProps } from '../../consts/schemas/componentes.schemas.js';

const JaLista = crearComponente<JaListaProps>(import.meta.url, 'ja-lista', { items: [], icono: 'mdi:check-circle', tono: 'exito', variante: 'columna' }, (root, props, host) => {
  host.dataset.variante = props.variante;
  host.dataset.tono = props.tono;
  root.append(html`<ul part="lista">${props.items.map((i) => html`<li><iswc-icon icon=${props.icono}></iswc-icon><span>${i}</span></li>`)}</ul>`);
});

define('ja-lista', JaLista);
