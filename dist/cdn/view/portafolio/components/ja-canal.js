import{crearComponente as c,define as i,html as a}from"../../../js/base/componente.js?v=sz3ptl";const l=c(import.meta.url,"ja-canal",{icono:"mdi:link",titulo:"",valor:"",url:"",copiar:""},(t,o)=>{const n=/^https?:/.test(o.url);t.append(a`
    <span class="icono" part="icono"><iswc-icon icon=${o.icono}></iswc-icon></span>
    <a part="enlace" href=${o.url} target=${n?"_blank":"_self"} rel="noopener">
      <small>${o.titulo}</small>
      <strong>${o.valor}</strong>
    </a>
    ${o.copiar?a`<iswc-copy-button value=${o.copiar} tooltip=${`Copiar ${o.titulo.toLowerCase()}`}></iswc-copy-button>`:a`<iswc-icon class="salir" icon="mdi:arrow-top-right"></iswc-icon>`}
  `)});i("ja-canal",l);
