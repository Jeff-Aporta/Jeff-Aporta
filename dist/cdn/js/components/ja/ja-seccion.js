import{crearComponente as c,define as s,html as n,pieza as o}from"../../base/componente.js?v=evs5g9";import"./ja-forma.js?v=pbihtc";import"./ja-ilustracion.js?v=w19l58";const l={cejilla:"",titulo:"",entrada:"",fondo:"base",ilustracion:null},r=new WeakSet;function d(e){if(r.has(e))return;if(r.add(e),typeof IntersectionObserver>"u"){e.setAttribute("data-visible","");return}const a=new IntersectionObserver(t=>{t.some(i=>i.isIntersecting)&&(e.setAttribute("data-visible",""),a.disconnect())},{rootMargin:"0px 0px -12% 0px"});a.observe(e)}const u=c(import.meta.url,"ja-seccion",l,(e,a,t)=>{t.dataset.fondo=a.fondo,d(t);const i=a.fondo==="base"?"peligro":"acento";e.append(n`
    ${o("ja-forma",{tipo:"anillo",tono:i,tam:9,animacion:"girar"},{class:"forma anillo"})}
    ${o("ja-forma",{tipo:"puntos",tono:"marca",tam:4.5,animacion:"derivar",retraso:3},{class:"forma puntos"})}
    ${o("ja-forma",{tipo:"cruz",tono:"lila",tam:1.4,animacion:"girar",retraso:6},{class:"forma cruz"})}
    <div class="contenedor" part="contenedor">
      <header class="encabezado" part="encabezado" ?con-ilustracion=${!!a.ilustracion}>
        <div class="textos">
          ${a.cejilla?n`<p class="cejilla"><span class="raya" aria-hidden="true"></span>${a.cejilla}</p>`:null}
          ${a.titulo?n`<h2 class="titulo" part="titulo">${a.titulo}</h2>`:null}
          ${a.entrada?n`<p class="entrada">${a.entrada}</p>`:null}
        </div>
        ${a.ilustracion?o("ja-ilustracion",{nombre:a.ilustracion},{class:"ilustracion",part:"ilustracion"}):null}
      </header>
      <div class="cuerpo" part="cuerpo"><slot></slot></div>
    </div>
  `)});s("ja-seccion",u);
