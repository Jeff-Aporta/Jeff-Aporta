import{crearComponente as r,define as n,html as l,pieza as a}from"../../../js/base/componente.js?v=evs5g9";import{contenido as s,rutaSitio as p}from"../../../js/contenido/index.js?v=yi9vmp";import"../../../js/components/ja/ja-ilustracion.js?v=0dkv6w";import"./ja-canal.js?v=vxeduu";const u=r(import.meta.url,"ja-contacto",{},i=>{const{perfil:t}=s,o=t.contacto,e=[{icono:"mdi:email-outline",titulo:"Correo",valor:o.email,url:`mailto:${o.email}`,copiar:o.email},{icono:"mdi:phone-outline",titulo:"Tel\xE9fono",valor:o.telefono,url:`tel:${o.telefono.replace(/\s/g,"")}`,copiar:o.telefono},{icono:"mdi:whatsapp",titulo:"WhatsApp",valor:"Escr\xEDbeme directo",url:o.whatsapp,copiar:""},{icono:"mdi:github",titulo:"GitHub",valor:"github.com/Jeff-Aporta",url:o.github,copiar:""},{icono:"mdi:youtube",titulo:"YouTube",valor:"@JeffAporta",url:o.youtube,copiar:""}];i.append(l`
    <div class="rejilla">
      <div class="canales" part="canales">${e.map(c=>a("ja-canal",c))}</div>
      <iswc-card class="cta" part="cta" variant="outlined">
        ${a("ja-ilustracion",{nombre:"contacto"},{class:"figura"})}
        <h3>¿Conversamos?</h3>
        <p>Hablemos de arquitectura, producto, IA aplicada o de tu próximo reto técnico. Trabajo en remoto o híbrido con equipos de Colombia y del exterior.</p>
        <div class="acciones">
          <iswc-button color="success" variant="soft" shape="pill" href=${o.whatsapp} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:whatsapp"></iswc-icon> WhatsApp
          </iswc-button>
          <iswc-button color="brand" variant="outlined" shape="pill" href=${p(t.cv)} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:file-eye-outline"></iswc-icon> Hoja de vida
          </iswc-button>
        </div>
      </iswc-card>
    </div>
  `)});n("ja-contacto",u);
