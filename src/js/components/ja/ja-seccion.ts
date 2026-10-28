/**
 * <ja-seccion> — bloque de página con encabezado común y el contenido en el slot.
 *
 * Encabezado: cejilla, título, entrada y (opcional) una ilustración que flota suavemente. El fondo
 * alterna (`base`, `suave`, `marca`) con `<ja-forma>` memphis animadas. Al entrar en la ventana el
 * encabezado y el contenido aparecen con un desplazamiento suave (una sola vez).
 */
import { crearComponente, define, html, pieza } from '../../base/componente.js';
import type { JaSeccionProps } from '../../consts/schemas/componentes.schemas.js';
import './ja-forma.js';
import './ja-ilustracion.js';

const INICIAL: JaSeccionProps = { cejilla: '', titulo: '', entrada: '', fondo: 'base', ilustracion: null };
const OBSERVADOS = new WeakSet<HTMLElement>();

/** Marca `data-visible` cuando la sección entra en la ventana (sin IntersectionObserver, visible de una vez). */
function observarEntrada(host: HTMLElement): void {
  if (OBSERVADOS.has(host)) return;
  OBSERVADOS.add(host);
  if (typeof IntersectionObserver === 'undefined') {
    host.setAttribute('data-visible', '');
    return;
  }
  const io = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    host.setAttribute('data-visible', '');
    io.disconnect();
  }, { rootMargin: '0px 0px -12% 0px' });
  io.observe(host);
}

const JaSeccion = crearComponente<JaSeccionProps>(import.meta.url, 'ja-seccion', INICIAL, (root, props, host) => {
  host.dataset.fondo = props.fondo;
  observarEntrada(host);
  const acento = props.fondo === 'base' ? 'peligro' : 'acento';
  root.append(html`
    ${pieza('ja-forma', { tipo: 'anillo', tono: acento, tam: 9, animacion: 'girar' }, { class: 'forma anillo' })}
    ${pieza('ja-forma', { tipo: 'puntos', tono: 'marca', tam: 4.5, animacion: 'derivar', retraso: 3 }, { class: 'forma puntos' })}
    ${pieza('ja-forma', { tipo: 'cruz', tono: 'lila', tam: 1.4, animacion: 'girar', retraso: 6 }, { class: 'forma cruz' })}
    <div class="contenedor" part="contenedor">
      <header class="encabezado" part="encabezado" ?con-ilustracion=${Boolean(props.ilustracion)}>
        <div class="textos">
          ${props.cejilla ? html`<p class="cejilla"><span class="raya" aria-hidden="true"></span>${props.cejilla}</p>` : null}
          ${props.titulo ? html`<h2 class="titulo" part="titulo">${props.titulo}</h2>` : null}
          ${props.entrada ? html`<p class="entrada">${props.entrada}</p>` : null}
        </div>
        ${props.ilustracion ? pieza('ja-ilustracion', { nombre: props.ilustracion }, { class: 'ilustracion', part: 'ilustracion' }) : null}
      </header>
      <div class="cuerpo" part="cuerpo"><slot></slot></div>
    </div>
  `);
});

define('ja-seccion', JaSeccion);
