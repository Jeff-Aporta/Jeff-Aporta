import{crearComponente as e,define as m,html as n}from"../../../js/base/componente.js?v=evs5g9";import{duracion as r}from"../../../js/contenido/derivados.js?v=iwigun";const t=e(import.meta.url,"ja-barra-uso",{nombre:"",meses:0,maximo:1},(s,a)=>{const o=Math.round(a.meses/Math.max(a.maximo,1)*100);s.append(n`
    <span class="nombre" part="nombre">${a.nombre}</span>
    <iswc-progress-bar value=${String(o)} label=${`${a.nombre}: ${r(a.meses)}`}></iswc-progress-bar>
    <span class="valor" part="valor">${r(a.meses)}</span>
  `)});m("ja-barra-uso",t);
