import{crearComponente as n,define as a,html as o}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as e}from"../../../js/contenido/index.js?v=1rdoq5";const r=n(import.meta.url,"ja-estudio",{id:""},(t,s)=>{const i=e.educacion.find(c=>c.id===s.id);i&&t.append(o`
    <article class="tarjeta" part="tarjeta">
      <div class="sello"><iswc-icon icon=${i.icono}></iswc-icon><span>${i.sigla}</span></div>
      <div class="texto">
        <p class="nivel">${i.nivel} · ${i.cursando??i.anio}</p>
        <h3>${i.titulo}</h3>
        <p class="institucion">${i.sitio?o`<a href=${i.sitio} target="_blank" rel="noopener">${i.institucion}</a>`:i.institucion}</p>
        <p class="lugar"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${i.lugar}</p>
        ${i.nota?o`<p class="nota"><iswc-icon icon="mdi:trophy-outline"></iswc-icon>${i.nota}</p>`:null}
      </div>
      ${i.certificado?o`<iswc-button class="certificado" color="success" variant="soft" shape="pill" href=${i.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:file-certificate-outline"></iswc-icon>Certificado</iswc-button>`:null}
    </article>
  `)});a("ja-estudio",r);
