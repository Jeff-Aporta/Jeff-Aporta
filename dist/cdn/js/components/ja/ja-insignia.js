import{crearComponente as n,define as a,html as s}from"../../base/componente.js?v=evs5g9";const e=n(import.meta.url,"ja-insignia",{icono:"mdi:star-outline",titulo:"",subtitulo:"",flotar:!0},(i,t,o)=>{o.toggleAttribute("data-flotar",t.flotar),i.append(s`
    <iswc-icon part="icono" icon=${t.icono}></iswc-icon>
    <span class="textos"><strong>${t.titulo}</strong><small>${t.subtitulo}</small></span>
  `)});a("ja-insignia",e);
