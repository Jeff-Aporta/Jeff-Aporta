/**
 * <ja-paso> — tarjeta de un paso de una guía, discreta y en el flujo de lectura: número y título, la
 * narración como texto normal del paso, los bloques (`<ja-bloque>`), la demo interactiva del paso
 * (`<ja-luz-demo>`) si la trae y, en el último paso, los créditos. Si el paso tiene narración en audio
 * (`audio`), un único botón pequeño play/pausa en la esquina superior derecha (`iswc-button` ghost,
 * circular) que emite `ja-narracion { indice }`; quién suena lo decide `<ja-post>` (un solo audio a la vez)
 * y lo refleja en `sonando`. Recibe todo por props: no lee el contenido importado.
 */
import { crearComponente, define, emitir, html, pieza } from '../../../src/js/base/componente.js';
import type { JaPasoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import './ja-bloque.js';
import './ja-luz-demo.js';

const INICIAL: JaPasoProps = { paso: null, indice: 0, total: 1, creditos: '', audio: '', sonando: false };

const JaPaso = crearComponente<JaPasoProps>(import.meta.url, 'ja-paso', INICIAL, (root, props, host) => {
  const { paso, indice, total, creditos, audio, sonando } = props;
  if (!paso) return;
  const n = indice + 1;
  const ultimo = indice === total - 1;
  host.id ||= `paso-${n}`;
  host.toggleAttribute('data-sonando', sonando);
  const alternar = () => emitir(host, 'ja-narracion', { indice });
  root.append(html`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <header class="cabecera">
        <p class="numero" aria-hidden="true">${String(n).padStart(2, '0')}</p>
        <h2 id="titulo"><iswc-icon class="icono" icon=${paso.icono} aria-hidden="true"></iswc-icon>${paso.titulo}</h2>
        ${audio
          ? html`<iswc-button class="audio" part="audio" variant="ghost" shape="pill" size="sm" type="button" aria-label=${sonando ? `Pausar la narración del paso ${n}` : `Reproducir la narración del paso ${n}`} aria-pressed=${sonando ? 'true' : 'false'} onclick=${alternar}><iswc-icon icon=${sonando ? 'mdi:pause' : 'mdi:play'}></iswc-icon></iswc-button>`
          : null}
      </header>
      <p class="narracion" part="narracion">${paso.narracion}</p>
      ${paso.bloques.length ? html`<div class="bloques" part="bloques">${paso.bloques.map((b) => pieza('ja-bloque', { bloque: b }))}</div>` : null}
      ${paso.demo
        ? html`<figure class="demo" part="demo">${pieza('ja-luz-demo', { paso: paso.demo.paso })}<figcaption>${paso.demo.leyenda}</figcaption></figure>`
        : null}
      ${ultimo && creditos ? html`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${creditos}</iswc-callout>` : null}
    </article>
  `);
}, (root, props, previos) => {
  // Solo cambió `sonando`: se actualiza el botón sin repintar la tarjeta (ni reiniciar la demo).
  const { sonando: s1, ...a } = props;
  const { sonando: s0, ...b } = previos;
  if (JSON.stringify(a) !== JSON.stringify(b)) return false;
  const boton = root.querySelector('.audio');
  if (!boton) return true;
  const n = props.indice + 1;
  boton.setAttribute('aria-label', s1 ? `Pausar la narración del paso ${n}` : `Reproducir la narración del paso ${n}`);
  boton.setAttribute('aria-pressed', s1 ? 'true' : 'false');
  boton.querySelector('iswc-icon')?.setAttribute('icon', s1 ? 'mdi:pause' : 'mdi:play');
  (root.host as HTMLElement).toggleAttribute('data-sonando', s1);
  return true;
});

define('ja-paso', JaPaso);
