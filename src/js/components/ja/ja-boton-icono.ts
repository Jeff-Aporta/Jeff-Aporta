/**
 * <ja-boton-icono> — botón redondo solo con ícono, en volumen de plastilina sobre papel.
 *
 * La `etiqueta` no se ve: va a `aria-label` y al tooltip (`title`). Con `href` es un enlace; sin él,
 * un `<button>` cuyo `click` burbujea al host. `activo` lo deja hundido (alternadores como «modo
 * guiado»); `deshabilitado` lo apaga.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { JaBotonIconoProps } from '../../consts/schemas/componentes.schemas.js';

const INICIAL: JaBotonIconoProps = { icono: 'mdi:circle-outline', etiqueta: '', href: '', tono: 'papel', tam: 'md', activo: false, deshabilitado: false };

const JaBotonIcono = crearComponente<JaBotonIconoProps>(import.meta.url, 'ja-boton-icono', INICIAL, (root, props, host) => {
  host.dataset.tono = props.tono;
  host.dataset.tam = props.tam;
  host.toggleAttribute('data-activo', props.activo);
  host.toggleAttribute('data-deshabilitado', props.deshabilitado);
  const icono = html`<iswc-icon icon=${props.icono} aria-hidden="true"></iswc-icon>`;
  root.append(props.href && !props.deshabilitado
    ? html`<a class="boton" part="boton" href=${props.href} aria-label=${props.etiqueta} title=${props.etiqueta}>${icono}</a>`
    : html`<button class="boton" part="boton" type="button" aria-label=${props.etiqueta} title=${props.etiqueta} aria-pressed=${props.activo ? 'true' : 'false'} ?disabled=${props.deshabilitado}>${icono}</button>`);
});

define('ja-boton-icono', JaBotonIcono);
