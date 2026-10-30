import{crearComponente as r,define as c,html as o}from"../../../js/base/componente.js?v=26a3va";import{contenido as e,rutaSitio as n}from"../../../js/contenido/index.js?v=mecx72";import{fechaLarga as p}from"../../../js/contenido/derivados.js?v=inbaus";import{hrefDe as l}from"../../../js/base/rutas.js?v=a7fbwz";const m=r(import.meta.url,"ja-post-tarjeta",{slug:""},(t,i)=>{const a=e.blog.find(s=>s.slug===i.slug);a&&t.append(o`
    <a class="tarjeta" part="tarjeta" href=${l({vista:"post",slug:a.slug})}>
      <div class="portada"><img src=${n(a.portada.src)} alt=${a.portada.alt} loading="lazy"></div>
      <div class="cuerpo">
        <p class="meta"><iswc-icon icon="mdi:calendar-blank-outline"></iswc-icon>${p(a.fecha)} · <iswc-icon icon="mdi:cards-outline"></iswc-icon>${a.pasos.length} pasos · <iswc-icon icon="mdi:headphones"></iswc-icon>narrada</p>
        <h3>${a.titulo}</h3>
        <p class="resumen">${a.resumen}</p>
        <div class="etiquetas">${a.etiquetas.map(s=>o`<iswc-tag variant="soft" color="brand" pill>${s}</iswc-tag>`)}</div>
        <span class="leer">Empezar la guía <iswc-icon icon="mdi:arrow-right"></iswc-icon></span>
      </div>
    </a>
  `)});c("ja-post-tarjeta",m);
