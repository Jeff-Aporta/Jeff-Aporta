/**
 * <ja-insignia> — pastilla con ícono, título y subtítulo; flota suavemente en loop (`flotar`).
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { JaInsigniaProps } from '../../consts/schemas/componentes.schemas.js';

const JaInsignia = crearComponente<JaInsigniaProps>(import.meta.url, 'ja-insignia', { icono: 'mdi:star-outline', titulo: '', subtitulo: '', flotar: true }, (root, props, host) => {
  host.toggleAttribute('data-flotar', props.flotar);
  root.append(html`
    <iswc-icon part="icono" icon=${props.icono}></iswc-icon>
    <span class="textos"><strong>${props.titulo}</strong><small>${props.subtitulo}</small></span>
  `);
});

define('ja-insignia', JaInsignia);
