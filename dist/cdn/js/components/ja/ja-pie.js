import{crearComponente as o,define as e,html as a,pieza as n}from"../../base/componente.js?v=sz3ptl";import{contenido as c}from"../../contenido/index.js?v=1rdoq5";import"./ja-marca.js?v=uy7ov9";const s=o(import.meta.url,"ja-pie",{},i=>{const{perfil:t}=c;i.append(a`
    <footer class="pie" part="pie">
      <div class="interior">
        ${n("ja-marca",{subtitulo:`${t.titular} \xB7 ${t.ubicacion}`},{class:"firma"})}
        <div class="redes" part="redes">
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.github} target="_blank" rel="noopener" title="GitHub"><iswc-icon icon="mdi:github"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.youtube} target="_blank" rel="noopener" title="YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.whatsapp} target="_blank" rel="noopener" title="WhatsApp"><iswc-icon icon="mdi:whatsapp"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${`mailto:${t.contacto.email}`} title="Correo"><iswc-icon icon="mdi:email-outline"></iswc-icon></iswc-button>
        </div>
        <p class="legal" part="legal">© ${new Date().getFullYear()} ${t.nombreCorto}</p>
      </div>
    </footer>
  `)});e("ja-pie",s);
