import{crearComponente as s,define as l,html as n,pieza as i}from"../../../js/base/componente.js?v=evs5g9";import{contenido as p,rutaSitio as t}from"../../../js/contenido/index.js?v=yi9vmp";import"../../../js/components/ja/ja-forma.js?v=pbihtc";import"../../../js/components/ja/ja-rasgo.js?v=ih5ylz";import"./ja-video.js?v=adnpt9";const r=["marca","acento","exito","peligro"],d=s(import.meta.url,"ja-perfil",{},c=>{const{perfil:o}=p;c.append(n`
    <div class="principal">
      <div class="video">
        ${i("ja-forma",{tipo:"puntos",tono:"acento",tam:6,animacion:"derivar"},{class:"deco puntos"})}
        ${i("ja-forma",{tipo:"anillo",tono:"peligro",tam:3.5,animacion:"girar",retraso:4},{class:"deco anillo"})}
        ${i("ja-video",{youtubeId:o.video.youtubeId,titulo:o.video.titulo})}
      </div>
      <div class="resumen">
        ${o.resumen.map((a,e)=>n`<p class=${e===0?"lead":""}>${a}</p>`)}
        <iswc-button color="brand" variant="soft" shape="pill" href=${o.video.canal} target="_blank" rel="noopener">
          <iswc-icon slot="start" icon="mdi:youtube"></iswc-icon> Canal de YouTube
        </iswc-button>
        <article class="cv" part="cv">
          <a class="portada" href=${t(o.cv)} target="_blank" rel="noopener" aria-label="Abrir la hoja de vida en PDF">
            <img src=${t(o.cvTarjeta.icono)} alt="" width="256" height="256" loading="lazy">
          </a>
          <div class="cv-texto">
            <h3>Conoce mi CV actualizado</h3>
            <p>${o.cvTarjeta.paginas} ${o.cvTarjeta.paginas===1?"p\xE1gina":"p\xE1ginas"} · PDF · actualizado en ${o.cvTarjeta.actualizado}</p>
            <div class="cv-acciones">
              <iswc-button color="brand" variant="filled" shape="pill" href=${t(o.cv)} target="_blank" rel="noopener">
                <iswc-icon slot="start" icon="mdi:eye-outline"></iswc-icon> Ver
              </iswc-button>
              <iswc-button color="brand" variant="outlined" shape="pill" href=${t(o.cv)} download="Jeffrey-Agudelo-CV.pdf" target="_blank" rel="noopener">
                <iswc-icon slot="start" icon="mdi:download"></iswc-icon> Descargar
              </iswc-button>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div class="pilares" part="pilares">
      ${o.pilares.map((a,e)=>i("ja-rasgo",{icono:a.icono,titulo:a.titulo,texto:a.texto,tono:r[e%r.length]}))}
    </div>
  `)});l("ja-perfil",d);
