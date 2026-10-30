import{crearComponente as c,define as e,html as t,pieza as n}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as p,rutaSitio as l}from"../../../js/contenido/index.js?v=1rdoq5";import{fechaLarga as m}from"../../../js/contenido/derivados.js?v=inbaus";import{estadoSpa as d}from"../../../js/base/rutas.js?v=mg1isv";import"../../../js/components/ja/ja-link.js?v=9dv9k2";const u=c(import.meta.url,"ja-post-tarjeta",{slug:""},(o,i)=>{const a=p.blog.find(s=>s.slug===i.slug);if(!a)return;const r=t`
    <div class="portada"><img src=${l(a.portada.src)} alt=${a.portada.alt} loading="lazy"></div>
    <div class="cuerpo">
      <p class="meta"><iswc-icon icon="mdi:calendar-blank-outline"></iswc-icon>${m(a.fecha)} · <iswc-icon icon="mdi:cards-outline"></iswc-icon>${a.pasos.length} pasos · <iswc-icon icon="mdi:headphones"></iswc-icon>narrada</p>
      <h3>${a.titulo}</h3>
      <p class="resumen">${a.resumen}</p>
      <div class="etiquetas">${a.etiquetas.map(s=>t`<iswc-tag variant="soft" color="brand" pill>${s}</iswc-tag>`)}</div>
      <span class="leer">Leer la guía <iswc-icon icon="mdi:arrow-right"></iswc-icon></span>
    </div>
  `;o.append(n("ja-link",{state:d({vista:"post",slug:a.slug})},{class:"tarjeta",part:"tarjeta"},r))});e("ja-post-tarjeta",u);
