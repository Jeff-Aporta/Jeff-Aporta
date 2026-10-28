/**
 * <ja-hito> — una fila del gráfico de ramas: fecha, el tramo del grafo (tronco, ramas que cruzan, la
 * rama del evento con su curva hacia el tronco y el punto) y la tarjeta del evento (inicio, fin o
 * actualidad). Cada carril tiene su color; las ramas que nacen o vuelven al tronco se curvan como en
 * el grafo de commits de GitHub. Con `acciones`, la tarjeta lleva el certificado adjunto de la empresa
 * y «Ver detalle» (la ficha, donde está su sitio web): emite `ja-hito-detalle` con el id del empleo.
 *
 * La fila `sub` es el inicio de un subproyecto (Fyxtoken dentro de COREMSA): su propia tarjeta sobre la
 * rama de la empresa. Al arranque de cada empresa (y de cada subproyecto) con composición en
 * `contenido.ilustraciones`, la ilustración va al lado contrario de la tarjeta (solo en pantallas anchas).
 */
import { crearComponente, define, emitir, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { duracion, fechaCorta, mesesCalendario, mesesPeriodo, rangoPeriodo } from '../../../src/js/contenido/derivados.js';
import type { JaHitoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-ilustracion.js';

const CURVA = 18;
// Separación entre carriles: más estrecha en móvil para dejarle ancho a la tarjeta.
const MOVIL = matchMedia('(max-width: 40rem)');
const ROTULO: Record<string, string> = { inicio: 'Inicio', fin: 'Fin', cambio: 'Cambio de contrato', sub: 'Inicio de subproyecto' };

function tramo(p: JaHitoProps) {
  const e = p.evento!;
  const PASO = MOVIL.matches ? 14 : 22;
  const x = (c: number) => PASO / 2 + c * PASO;
  const ancho = p.carriles * PASO;
  const linea = (c: number, desde: string, hasta: string) => html`<span class=${`linea c${c % 6}`} style=${`left:${x(c) - 1.5}px;top:${desde};bottom:${hasta}`}></span>`;
  const tronco = e.tipo === 'actual' ? linea(0, '50%', '0') : e.ultimo ? linea(0, '0', `calc(50% - ${CURVA}px)`) : linea(0, '0', '0');
  const propia = e.carril === 0 || e.tipo === 'periodo' ? null : e.tipo === 'cambio' || e.tipo === 'sub' ? linea(e.carril, '0', '0') : e.tipo === 'inicio' ? linea(e.carril, '0', '50%') : linea(e.carril, '50%', '0');
  const w = x(e.carril) - x(0);
  // La rama nace del tronco por debajo del punto (inicio) y vuelve al tronco por encima (fin).
  const nace = html`<svg class=${`curva c${e.carril % 6}`} style=${`left:${x(0)}px;top:50%;width:${w}px;height:${CURVA}px`} viewBox=${`0 0 ${w} ${CURVA}`} preserveAspectRatio="none" aria-hidden="true"><path d=${`M${w} 0C${w} ${CURVA * 0.65} 0 ${CURVA * 0.35} 0 ${CURVA}`}></path></svg>`;
  const vuelve = html`<svg class=${`curva c${e.carril % 6}`} style=${`left:${x(0)}px;top:calc(50% - ${CURVA}px);width:${w}px;height:${CURVA}px`} viewBox=${`0 0 ${w} ${CURVA}`} preserveAspectRatio="none" aria-hidden="true"><path d=${`M0 0C0 ${CURVA * 0.65} ${w} ${CURVA * 0.35} ${w} ${CURVA}`}></path></svg>`;
  const curva = e.carril === 0 || e.tipo === 'cambio' || e.tipo === 'sub' ? null : e.tipo === 'inicio' ? nace : e.tipo === 'fin' ? vuelve : html`${nace}${vuelve}`;
  return html`
    <div class="tramo" part="tramo" style=${`width:${ancho}px`} aria-hidden="true">
      ${tronco}
      ${e.pasantes.map((c) => linea(c, '0', '0'))}
      ${propia}
      ${curva}
      <span class=${`punto c${e.carril % 6}`} style=${`left:${x(e.carril)}px`}></span>
    </div>
  `;
}

function tarjeta(p: JaHitoProps, host: HTMLElement) {
  const e = p.evento!;
  if (e.tipo === 'actual') {
    const { experiencia } = contenido;
    return html`
      <article class="tarjeta actual" part="tarjeta">
        <p class="etiqueta">Actualidad</p>
        <h3>${duracion(mesesCalendario(experiencia))} de trayectoria</h3>
        <p class="detalle">${experiencia.length} empresas · ${experiencia.reduce((s, x) => s + x.periodos.length, 0)} vinculaciones · ${experiencia.filter((x) => x.certificado).length} con certificado laboral</p>
      </article>
    `;
  }
  const empleo = contenido.experiencia.find((x) => x.id === e.empleoId)!;
  const periodo = empleo.periodos[e.periodo]!;
  const sub = e.tipo === 'sub' ? empleo.subproyectos.find((x) => x.id === e.sub) : undefined;
  if (sub) {
    const proyecto = contenido.proyectos.find((x) => x.id === sub.proyecto);
    const destino = proyecto?.demo ?? proyecto?.codigo;
    return html`
      <article class="tarjeta sub" part="tarjeta">
        <p class="etiqueta">${ROTULO.sub}<span class="movil"> · ${fechaCorta(e.fecha)}</span></p>
        <div class="cabeza">
          ${sub.logo ? html`<img class="logo" src=${rutaSitio(sub.logo)} alt="" loading="lazy">` : html`<span class="logo inicial">${sub.nombre.slice(0, 2)}</span>`}
          <div>
            <h3>${sub.nombre}</h3>
            <p class="empresa">Dentro de ${empleo.empresa}</p>
          </div>
        </div>
        <p class="detalle">${rangoPeriodo({ desde: sub.desde, hasta: sub.hasta, contrato: '' })} · ${duracion(mesesPeriodo({ desde: sub.desde, hasta: sub.hasta, contrato: '' }))} · ${sub.resumen}</p>
        ${destino ? html`
          <div class="acciones">
            <iswc-button color="brand" variant="soft" shape="pill" href=${destino} target="_blank" rel="noopener">
              <iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Ver ${sub.nombre}
            </iswc-button>
          </div>` : null}
      </article>
    `;
  }
  const marca = empleo.logo
    ? html`<img class=${empleo.logoClaro ? 'logo claro' : 'logo'} src=${rutaSitio(empleo.logo)} alt="" loading="lazy">`
    : empleo.icono
      ? html`<span class="logo icono"><iswc-icon icon=${empleo.icono}></iswc-icon></span>`
      : html`<span class="logo inicial">${empleo.empresa.slice(0, 2)}</span>`;
  return html`
    <article class=${`tarjeta ${e.tipo}`} part="tarjeta">
      <p class="etiqueta">${e.tipo === 'periodo' ? `${fechaCorta(e.desde)} – ${fechaCorta(e.fecha)}` : html`${ROTULO[e.tipo]}<span class="movil"> · ${fechaCorta(e.fecha)}</span>`}</p>
      <div class="cabeza">
        ${marca}
        <div>
          <h3>${empleo.cargo}</h3>
          <p class="empresa">${empleo.empresa}${empleo.subproyectos.length ? html`<span class="incluye"> · incluye ${empleo.subproyectos.map((x) => x.nombre).join(', ')}</span>` : null}</p>
        </div>
      </div>
      <p class="detalle">${e.tipo === 'inicio'
        ? `${periodo.contrato} · ${empleo.modalidad} · ${empleo.ubicacion}`
        : e.tipo === 'cambio'
          ? `${empleo.periodos[e.periodo - 1]?.contrato ?? ''} (${duracion(mesesPeriodo(empleo.periodos[e.periodo - 1] ?? periodo))}) → ${periodo.contrato}`
          : e.tipo === 'periodo'
          ? `${duracion(mesesPeriodo(periodo))} · ${periodo.contrato} · ${empleo.modalidad}${empleo.certificado ? ' · certificado' : ''}`
          : `${duracion(mesesPeriodo(periodo))} · ${periodo.contrato}${empleo.certificado ? ' · certificado' : ''}`}</p>
      ${p.acciones ? html`
        <div class="acciones">
          <iswc-button class="ver" color="brand" variant="soft" shape="pill" onclick=${() => emitir(host, 'ja-hito-detalle', { id: empleo.id })}>
            <iswc-icon slot="start" icon="mdi:text-box-search-outline"></iswc-icon>Ver detalle
          </iswc-button>
          ${empleo.certificado ? html`<iswc-button color="success" variant="ghost" shape="pill" href=${empleo.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:paperclip"></iswc-icon>Certificado</iswc-button>` : null}
        </div>` : null}
    </article>
  `;
}

/** Ilustración del arranque de una empresa (su primer periodo) o de un subproyecto, si tiene composición. */
function arte(e: JaHitoProps['evento']) {
  if (!e) return null;
  const nombre = e.tipo === 'sub' ? e.sub : (e.tipo === 'inicio' || e.tipo === 'periodo') && e.periodo === 0 ? e.empleoId : null;
  return nombre && contenido.ilustraciones[nombre] ? html`<div class="arte" aria-hidden="true">${pieza('ja-ilustracion', { nombre })}</div>` : null;
}

const JaHito = crearComponente<JaHitoProps>(import.meta.url, 'ja-hito', { evento: null, carriles: 1, acciones: false }, (root, props, host) => {
  if (!props.evento) return;
  host.dataset.tipo = props.evento.tipo;
  root.append(html`
    <time class="fecha" datetime=${props.evento.fecha}>${props.evento.tipo === 'actual' ? 'Hoy' : fechaCorta(props.evento.fecha)}${props.evento.desde ? html`<small>${fechaCorta(props.evento.desde)}</small>` : null}</time>
    ${tramo(props)}
    ${tarjeta(props, host)}
    ${arte(props.evento)}
  `);
});

define('ja-hito', JaHito);
