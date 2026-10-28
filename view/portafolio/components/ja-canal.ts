/**
 * <ja-canal> — un canal de contacto: ícono, título, valor como enlace y, si `copiar` trae texto,
 * el botón de copiar del kit; si no, una flecha de salida.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { JaCanalProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaCanal = crearComponente<JaCanalProps>(import.meta.url, 'ja-canal', { icono: 'mdi:link', titulo: '', valor: '', url: '', copiar: '' }, (root, props) => {
  const externo = /^https?:/.test(props.url);
  root.append(html`
    <span class="icono" part="icono"><iswc-icon icon=${props.icono}></iswc-icon></span>
    <a part="enlace" href=${props.url} target=${externo ? '_blank' : '_self'} rel="noopener">
      <small>${props.titulo}</small>
      <strong>${props.valor}</strong>
    </a>
    ${props.copiar
      ? html`<iswc-copy-button value=${props.copiar} tooltip=${`Copiar ${props.titulo.toLowerCase()}`}></iswc-copy-button>`
      : html`<iswc-icon class="salir" icon="mdi:arrow-top-right"></iswc-icon>`}
  `);
});

define('ja-canal', JaCanal);
