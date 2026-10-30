import{crearComponente as v,define as h,emitir as f,html as a,pieza as p}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as m,rutaSitio as c}from"../../../js/contenido/index.js?v=1rdoq5";import{contratos as y,duracion as n,mesesEmpleo as j,mesesPeriodo as u,rangoEmpleo as k,rangoPeriodo as g}from"../../../js/contenido/derivados.js?v=inbaus";import"../../../js/components/ja/ja-lista.js?v=d8v9lh";const z={Presencial:"mdi:office-building-outline",Remoto:"mdi:laptop",H\u00EDbrido:"mdi:home-city-outline"},P=v(import.meta.url,"ja-empleo",{id:"",abierto:!1},(t,e,s)=>{const i=m.experiencia.find(o=>o.id===e.id);if(!i)return;s.toggleAttribute("data-abierto",e.abierto);const $=()=>{const o=!s.props.abierto;s.props={abierto:o},f(s,"ja-empleo-toggle",{id:i.id,abierto:o})},b=i.logo?i.logoClaro?a`<span class="logo caja"><img class="claro" src=${c(i.logo)} alt=${`Logo de ${i.empresa}`} loading="lazy"></span>`:a`<img class="logo" src=${c(i.logo)} alt=${`Logo de ${i.empresa}`} loading="lazy">`:i.icono?a`<span class="logo icono" aria-hidden="true"><iswc-icon icon=${i.icono}></iswc-icon></span>`:a`<span class="logo inicial" aria-hidden="true">${i.empresa.slice(0,2)}</span>`,w=i.subproyectos.length?a`
        <section class="subproyectos">
          <h4>Proyectos dentro de ${i.empresa}</h4>
          ${i.subproyectos.map(o=>{const r={desde:o.desde,hasta:o.hasta,contrato:""},d=m.proyectos.find(l=>l.id===o.proyecto)?.demo;return a`
              <article class="subproyecto">
                ${o.logo?a`<img class="sublogo" src=${c(o.logo)} alt=${`Logo de ${o.nombre}`} loading="lazy">`:null}
                <div class="subcuerpo">
                  <div class="subcabeza">
                    <h5>${o.nombre}</h5>
                    <span>${g(r)} · ${n(u(r))}</span>
                  </div>
                  <p>${o.resumen}</p>
                  ${o.logros.length?p("ja-lista",{items:o.logros,icono:"mdi:check-decagram-outline",tono:"marca"}):null}
                  <div class="subpie">
                    <div class="tecnologias">${o.tecnologias.map(l=>a`<iswc-tag variant="soft" pill>${l}</iswc-tag>`)}</div>
                    ${d?a`<iswc-button variant="ghost" shape="pill" href=${d} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Ver ${o.nombre}</iswc-button>`:null}
                  </div>
                </div>
              </article>`})}
        </section>`:null;t.append(a`
      <article class="tarjeta" part="tarjeta">
        <button class="cabeza" type="button" aria-expanded=${String(e.abierto)} aria-controls="cuerpo" onclick=${$}>
          ${b}
          <div class="titulos">
            <h3>${i.cargo}</h3>
            <p class="empresa">${i.empresa}<span>· ${i.sector}</span></p>
            <ul class="meta">
              <li><iswc-icon icon="mdi:calendar-range"></iswc-icon>${k(i)}</li>
              <li><iswc-icon icon="mdi:timer-sand"></iswc-icon>${n(j(i))}</li>
              <li><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${i.ubicacion}</li>
              <li><iswc-icon icon=${z[i.modalidad]??"mdi:laptop"}></iswc-icon>${i.modalidad}</li>
            </ul>
          </div>
          <div class="lateral">
            ${i.certificado?a`<iswc-tag class="sello" color="success" variant="soft" pill><iswc-icon slot="start" icon="mdi:check-decagram"></iswc-icon><span class="sello-texto">Certificado<small class="adjunto"><iswc-icon icon="mdi:paperclip"></iswc-icon>adjunto</small></span></iswc-tag>`:null}
            <iswc-icon class="flecha" icon="mdi:chevron-down"></iswc-icon>
          </div>
        </button>
        <div id="cuerpo" class="cuerpo" part="cuerpo" ?hidden=${!e.abierto}>
          <p class="resumen">${i.resumen}</p>
          <div class="columnas">
            <div>
              <h4>Logros y responsabilidades</h4>
              ${p("ja-lista",{items:i.logros,icono:"mdi:check-decagram-outline",tono:"marca"})}
            </div>
            <div>
              <h4>Vinculación</h4>
              <ul class="periodos">
                ${i.periodos.map(o=>a`<li><strong>${g(o)}</strong><span>${o.contrato} · ${n(u(o))}</span></li>`)}
              </ul>
              <p class="contratos">${y(i).join(" \xB7 ")}</p>
            </div>
          </div>
          ${w}
          ${i.galeria.length?a`<div class="galeria">${i.galeria.map(o=>a`<a href=${c(o.src)} target="_blank" rel="noopener"><img src=${c(o.src)} alt=${o.alt} loading="lazy"></a>`)}</div>`:null}
          <div class="pie">
            <div class="tecnologias">${i.tecnologias.map(o=>a`<iswc-tag variant="soft" pill>${o}</iswc-tag>`)}</div>
            <div class="enlaces">
              ${i.sitio?a`<iswc-button variant="ghost" shape="pill" href=${i.sitio} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:web"></iswc-icon>Sitio web</iswc-button>`:null}
              ${i.certificado?a`<iswc-button color="success" variant="soft" shape="pill" href=${i.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:file-certificate-outline"></iswc-icon>Ver certificado</iswc-button>`:null}
            </div>
          </div>
        </div>
      </article>
    `)},(t,e,s,i)=>e.id!==s.id?!1:(i.toggleAttribute("data-abierto",e.abierto),t.querySelector(".cabeza")?.setAttribute("aria-expanded",String(e.abierto)),t.querySelector(".cuerpo")?.toggleAttribute("hidden",!e.abierto),!0));h("ja-empleo",P);
