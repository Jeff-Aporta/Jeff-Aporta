/**
 * <ja-empleo> — tarjeta de un empleo, por id: empresa, cargo, fechas, modalidad, duración,
 * tecnologías y, al abrir, resumen, logros, periodos con su contrato, subproyectos (proyectos con término
 * propio dentro de la empresa), galería, sitio web y certificado. Sin logo propio usa el ícono genérico `icono`.
 *
 * Abrir/cerrar cambia `props.abierto` con repintado parcial (solo el cuerpo) y avisa `ja-empleo-toggle`.
 */
import { crearComponente, define, emitir, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { contratos, duracion, mesesEmpleo, mesesPeriodo, rangoEmpleo, rangoPeriodo } from '../../../src/js/contenido/derivados.js';
import type { JaEmpleoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-lista.js';

type Host = HTMLElement & { props: Partial<JaEmpleoProps> };

const ICONO_MODALIDAD: Record<string, string> = { Presencial: 'mdi:office-building-outline', Remoto: 'mdi:laptop', 'Híbrido': 'mdi:home-city-outline' };

const JaEmpleo = crearComponente<JaEmpleoProps>(
  import.meta.url,
  'ja-empleo',
  { id: '', abierto: false },
  (root, props, host) => {
    const e = contenido.experiencia.find((x) => x.id === props.id);
    if (!e) return;
    host.toggleAttribute('data-abierto', props.abierto);
    const alternar = () => {
      const abierto = !(host as Host).props.abierto;
      (host as Host).props = { abierto };
      emitir(host, 'ja-empleo-toggle', { id: e.id, abierto });
    };
    const marca = e.logo
      ? e.logoClaro
        ? html`<span class="logo caja"><img class="claro" src=${rutaSitio(e.logo)} alt=${`Logo de ${e.empresa}`} loading="lazy"></span>`
        : html`<img class="logo" src=${rutaSitio(e.logo)} alt=${`Logo de ${e.empresa}`} loading="lazy">`
      : e.icono
        ? html`<span class="logo icono" aria-hidden="true"><iswc-icon icon=${e.icono}></iswc-icon></span>`
        : html`<span class="logo inicial" aria-hidden="true">${e.empresa.slice(0, 2)}</span>`;
    const subproyectos = e.subproyectos.length
      ? html`
        <section class="subproyectos">
          <h4>Proyectos dentro de ${e.empresa}</h4>
          ${e.subproyectos.map((s) => {
            const periodo = { desde: s.desde, hasta: s.hasta, contrato: '' };
            const demo = contenido.proyectos.find((x) => x.id === s.proyecto)?.demo;
            return html`
              <article class="subproyecto">
                ${s.logo ? html`<img class="sublogo" src=${rutaSitio(s.logo)} alt=${`Logo de ${s.nombre}`} loading="lazy">` : null}
                <div class="subcuerpo">
                  <div class="subcabeza">
                    <h5>${s.nombre}</h5>
                    <span>${rangoPeriodo(periodo)} · ${duracion(mesesPeriodo(periodo))}</span>
                  </div>
                  <p>${s.resumen}</p>
                  ${s.logros.length ? pieza('ja-lista', { items: s.logros, icono: 'mdi:check-decagram-outline', tono: 'marca' }) : null}
                  <div class="subpie">
                    <div class="tecnologias">${s.tecnologias.map((t) => html`<iswc-tag variant="soft" pill>${t}</iswc-tag>`)}</div>
                    ${demo ? html`<iswc-button variant="ghost" shape="pill" href=${demo} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Ver ${s.nombre}</iswc-button>` : null}
                  </div>
                </div>
              </article>`;
          })}
        </section>`
      : null;
    root.append(html`
      <article class="tarjeta" part="tarjeta">
        <button class="cabeza" type="button" aria-expanded=${String(props.abierto)} aria-controls="cuerpo" onclick=${alternar}>
          ${marca}
          <div class="titulos">
            <h3>${e.cargo}</h3>
            <p class="empresa">${e.empresa}<span>· ${e.sector}</span></p>
            <ul class="meta">
              <li><iswc-icon icon="mdi:calendar-range"></iswc-icon>${rangoEmpleo(e)}</li>
              <li><iswc-icon icon="mdi:timer-sand"></iswc-icon>${duracion(mesesEmpleo(e))}</li>
              <li><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${e.ubicacion}</li>
              <li><iswc-icon icon=${ICONO_MODALIDAD[e.modalidad] ?? 'mdi:laptop'}></iswc-icon>${e.modalidad}</li>
            </ul>
          </div>
          <div class="lateral">
            ${e.certificado ? html`<iswc-tag class="sello" color="success" variant="soft" pill><iswc-icon slot="start" icon="mdi:check-decagram"></iswc-icon><span class="sello-texto">Certificado<small class="adjunto"><iswc-icon icon="mdi:paperclip"></iswc-icon>adjunto</small></span></iswc-tag>` : null}
            <iswc-icon class="flecha" icon="mdi:chevron-down"></iswc-icon>
          </div>
        </button>
        <div id="cuerpo" class="cuerpo" part="cuerpo" ?hidden=${!props.abierto}>
          <p class="resumen">${e.resumen}</p>
          <div class="columnas">
            <div>
              <h4>Logros y responsabilidades</h4>
              ${pieza('ja-lista', { items: e.logros, icono: 'mdi:check-decagram-outline', tono: 'marca' })}
            </div>
            <div>
              <h4>Vinculación</h4>
              <ul class="periodos">
                ${e.periodos.map((p) => html`<li><strong>${rangoPeriodo(p)}</strong><span>${p.contrato} · ${duracion(mesesPeriodo(p))}</span></li>`)}
              </ul>
              <p class="contratos">${contratos(e).join(' · ')}</p>
            </div>
          </div>
          ${subproyectos}
          ${e.galeria.length ? html`<div class="galeria">${e.galeria.map((g) => html`<a href=${rutaSitio(g.src)} target="_blank" rel="noopener"><img src=${rutaSitio(g.src)} alt=${g.alt} loading="lazy"></a>`)}</div>` : null}
          <div class="pie">
            <div class="tecnologias">${e.tecnologias.map((t) => html`<iswc-tag variant="soft" pill>${t}</iswc-tag>`)}</div>
            <div class="enlaces">
              ${e.sitio ? html`<iswc-button variant="ghost" shape="pill" href=${e.sitio} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:web"></iswc-icon>Sitio web</iswc-button>` : null}
              ${e.certificado ? html`<iswc-button color="success" variant="soft" shape="pill" href=${e.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:file-certificate-outline"></iswc-icon>Ver certificado</iswc-button>` : null}
            </div>
          </div>
        </div>
      </article>
    `);
  },
  (root, props, previos, host) => {
    if (props.id !== previos.id) return false;
    host.toggleAttribute('data-abierto', props.abierto);
    root.querySelector('.cabeza')?.setAttribute('aria-expanded', String(props.abierto));
    root.querySelector('.cuerpo')?.toggleAttribute('hidden', !props.abierto);
    return true;
  },
);

define('ja-empleo', JaEmpleo);
