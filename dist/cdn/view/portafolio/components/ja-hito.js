import{crearComponente as j,define as C,emitir as H,html as e,pieza as P}from"../../../js/base/componente.js?v=26a3va";import{contenido as m,rutaSitio as b}from"../../../js/contenido/index.js?v=mecx72";import{duracion as u,fechaCorta as $,mesesCalendario as J,mesesPeriodo as h,rangoPeriodo as z}from"../../../js/contenido/derivados.js?v=inbaus";import"../../../js/components/ja/ja-ilustracion.js?v=2qqi50";const r=18,A=matchMedia("(max-width: 40rem)"),g={inicio:"Inicio",fin:"Fin",cambio:"Cambio de contrato",sub:"Inicio de subproyecto"};function I(c){const o=c.evento,t=A.matches?14:22,i=d=>t/2+d*t,l=c.carriles*t,a=(d,x,y)=>e`<span class=${`linea c${d%6}`} style=${`left:${i(d)-1.5}px;top:${x};bottom:${y}`}></span>`,v=o.tipo==="actual"?a(0,"50%","0"):o.ultimo?a(0,"0",`calc(50% - ${r}px)`):a(0,"0","0"),s=o.carril===0||o.tipo==="periodo"?null:o.tipo==="cambio"||o.tipo==="sub"?a(o.carril,"0","0"):o.tipo==="inicio"?a(o.carril,"0","50%"):a(o.carril,"50%","0"),n=i(o.carril)-i(0),p=e`<svg class=${`curva c${o.carril%6}`} style=${`left:${i(0)}px;top:50%;width:${n}px;height:${r}px`} viewBox=${`0 0 ${n} ${r}`} preserveAspectRatio="none" aria-hidden="true"><path d=${`M${n} 0C${n} ${r*.65} 0 ${r*.35} 0 ${r}`}></path></svg>`,f=e`<svg class=${`curva c${o.carril%6}`} style=${`left:${i(0)}px;top:calc(50% - ${r}px);width:${n}px;height:${r}px`} viewBox=${`0 0 ${n} ${r}`} preserveAspectRatio="none" aria-hidden="true"><path d=${`M0 0C0 ${r*.65} ${n} ${r*.35} ${n} ${r}`}></path></svg>`,w=o.carril===0||o.tipo==="cambio"||o.tipo==="sub"?null:o.tipo==="inicio"?p:o.tipo==="fin"?f:e`${p}${f}`;return e`
    <div class="tramo" part="tramo" style=${`width:${l}px`} aria-hidden="true">
      ${v}
      ${o.pasantes.map(d=>a(d,"0","0"))}
      ${s}
      ${w}
      <span class=${`punto c${o.carril%6}`} style=${`left:${i(o.carril)}px`}></span>
    </div>
  `}function M(c,o){const t=c.evento;if(t.tipo==="actual"){const{experiencia:s}=m;return e`
      <article class="tarjeta actual" part="tarjeta">
        <p class="etiqueta">Actualidad</p>
        <h3>${u(J(s))} de trayectoria</h3>
        <p class="detalle">${s.length} empresas · ${s.reduce((n,p)=>n+p.periodos.length,0)} vinculaciones · ${s.filter(n=>n.certificado).length} con certificado laboral</p>
      </article>
    `}const i=m.experiencia.find(s=>s.id===t.empleoId),l=i.periodos[t.periodo],a=t.tipo==="sub"?i.subproyectos.find(s=>s.id===t.sub):void 0;if(a){const s=m.proyectos.find(p=>p.id===a.proyecto),n=s?.demo??s?.codigo;return e`
      <article class="tarjeta sub" part="tarjeta">
        <p class="etiqueta">${g.sub}<span class="movil"> · ${$(t.fecha)}</span></p>
        <div class="cabeza">
          ${a.logo?e`<img class="logo" src=${b(a.logo)} alt="" loading="lazy">`:e`<span class="logo inicial">${a.nombre.slice(0,2)}</span>`}
          <div>
            <h3>${a.nombre}</h3>
            <p class="empresa">Dentro de ${i.empresa}</p>
          </div>
        </div>
        <p class="detalle">${z({desde:a.desde,hasta:a.hasta,contrato:""})} · ${u(h({desde:a.desde,hasta:a.hasta,contrato:""}))} · ${a.resumen}</p>
        ${n?e`
          <div class="acciones">
            <iswc-button color="brand" variant="soft" shape="pill" href=${n} target="_blank" rel="noopener">
              <iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Ver ${a.nombre}
            </iswc-button>
          </div>`:null}
      </article>
    `}const v=i.logo?e`<img class=${i.logoClaro?"logo claro":"logo"} src=${b(i.logo)} alt="" loading="lazy">`:i.icono?e`<span class="logo icono"><iswc-icon icon=${i.icono}></iswc-icon></span>`:e`<span class="logo inicial">${i.empresa.slice(0,2)}</span>`;return e`
    <article class=${`tarjeta ${t.tipo}`} part="tarjeta">
      <p class="etiqueta">${t.tipo==="periodo"?`${$(t.desde)} \u2013 ${$(t.fecha)}`:e`${g[t.tipo]}<span class="movil"> · ${$(t.fecha)}</span>`}</p>
      <div class="cabeza">
        ${v}
        <div>
          <h3>${i.cargo}</h3>
          <p class="empresa">${i.empresa}${i.subproyectos.length?e`<span class="incluye"> · incluye ${i.subproyectos.map(s=>s.nombre).join(", ")}</span>`:null}</p>
        </div>
      </div>
      <p class="detalle">${t.tipo==="inicio"?`${l.contrato} \xB7 ${i.modalidad} \xB7 ${i.ubicacion}`:t.tipo==="cambio"?`${i.periodos[t.periodo-1]?.contrato??""} (${u(h(i.periodos[t.periodo-1]??l))}) \u2192 ${l.contrato}`:t.tipo==="periodo"?`${u(h(l))} \xB7 ${l.contrato} \xB7 ${i.modalidad}${i.certificado?" \xB7 certificado":""}`:`${u(h(l))} \xB7 ${l.contrato}${i.certificado?" \xB7 certificado":""}`}</p>
      ${c.acciones?e`
        <div class="acciones">
          <iswc-button class="ver" color="brand" variant="soft" shape="pill" onclick=${()=>H(o,"ja-hito-detalle",{id:i.id})}>
            <iswc-icon slot="start" icon="mdi:text-box-search-outline"></iswc-icon>Ver detalle
          </iswc-button>
          ${i.certificado?e`<iswc-button color="success" variant="ghost" shape="pill" href=${i.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:paperclip"></iswc-icon>Certificado</iswc-button>`:null}
        </div>`:null}
    </article>
  `}function R(c){if(!c)return null;const o=c.tipo==="sub"?c.sub:(c.tipo==="inicio"||c.tipo==="periodo")&&c.periodo===0?c.empleoId:null;return o&&m.ilustraciones[o]?e`<div class="arte" aria-hidden="true">${P("ja-ilustracion",{nombre:o})}</div>`:null}const O=j(import.meta.url,"ja-hito",{evento:null,carriles:1,acciones:!1},(c,o,t)=>{o.evento&&(t.dataset.tipo=o.evento.tipo,c.append(e`
    <time class="fecha" datetime=${o.evento.fecha}>${o.evento.tipo==="actual"?"Hoy":$(o.evento.fecha)}${o.evento.desde?e`<small>${$(o.evento.desde)}</small>`:null}</time>
    ${I(o)}
    ${M(o,t)}
    ${R(o.evento)}
  `))});C("ja-hito",O);
