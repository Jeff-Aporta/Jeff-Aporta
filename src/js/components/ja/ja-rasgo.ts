/**
 * <ja-rasgo> — tarjeta de rasgo: ícono en baldosa de color, título y texto; el slot recibe extras
 * (por ejemplo etiquetas de tecnologías). El ícono se balancea al pasar el cursor.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { JaRasgoProps } from '../../consts/schemas/componentes.schemas.js';

const JaRasgo = crearComponente<JaRasgoProps>(import.meta.url, 'ja-rasgo', { icono: 'mdi:star-outline', titulo: '', texto: '', tono: 'marca' }, (root, props, host) => {
  host.dataset.tono = props.tono;
  root.append(html`
    <article class="tarjeta" part="tarjeta">
      <header>
        <span class="icono" part="icono"><iswc-icon icon=${props.icono}></iswc-icon></span>
        <h3 part="titulo">${props.titulo}</h3>
      </header>
      ${props.texto ? html`<p>${props.texto}</p>` : null}
      <slot></slot>
    </article>
  `);
});

define('ja-rasgo', JaRasgo);
