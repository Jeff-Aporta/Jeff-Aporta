import{crearComponente as e,define as m,html as n}from"../../../js/base/componente.js?v=sz3ptl";import{anios as s}from"../../../js/contenido/derivados.js?v=inbaus";const t=e(import.meta.url,"ja-barra-uso",{nombre:"",meses:0,maximo:1},(r,a)=>{const o=Math.round(a.meses/Math.max(a.maximo,1)*100);r.append(n`
    <span class="nombre" part="nombre">${a.nombre}</span>
    <iswc-progress-bar value=${String(o)} label=${`${a.nombre}: ${s(a.meses)}`}></iswc-progress-bar>
    <span class="valor" part="valor">${s(a.meses)}</span>
  `)});m("ja-barra-uso",t);
