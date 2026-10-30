import{crearComponente as l,define as r,html as i}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as d,rutaSitio as a}from"../../../js/contenido/index.js?v=1rdoq5";const p=l(import.meta.url,"ja-proyecto",{id:""},(e,c,s)=>{const o=d.proyectos.find(t=>t.id===c.id);if(!o)return;s.dataset.tipo=o.tipo;const n=o.imagen?i`<img class="imagen" src=${a(o.imagen)} alt=${`Captura de ${o.titulo}`} loading="lazy" decoding="async">${o.logo?i`<img class="sello" src=${a(o.logo)} alt="" loading="lazy">`:null}`:i`<img class="logo" src=${a(o.logo??"")} alt=${`Logo de ${o.titulo}`} loading="lazy">`;e.append(i`
    <article class="tarjeta" part="tarjeta">
      <div class="portada" part="portada">
        ${n}
        <iswc-tag class="categoria" variant="filled" color="brand" pill>${o.categoria}</iswc-tag>
      </div>
      <div class="cuerpo">
        <h3>${o.titulo}</h3>
        <p>${o.descripcion}</p>
        <div class="tecnologias">${o.tecnologias.map(t=>i`<span>${t}</span>`)}</div>
      </div>
      <div class="acciones">
        ${o.demo?i`<iswc-button color="brand" variant="filled" shape="pill" href=${o.demo} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:open-in-new"></iswc-icon>Demo</iswc-button>`:null}
        ${o.codigo?i`<iswc-button variant="outlined" shape="pill" href=${o.codigo} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:github"></iswc-icon>Código</iswc-button>`:null}
        ${o.video?i`<iswc-button variant="ghost" shape="pill" href=${o.video} target="_blank" rel="noopener" title="Ver en YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>`:null}
      </div>
    </article>
  `)});r("ja-proyecto",p);
