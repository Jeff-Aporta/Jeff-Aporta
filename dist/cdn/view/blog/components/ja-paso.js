import{crearComponente as $,define as f,emitir as g,html as i,pieza as u}from"../../../js/base/componente.js?v=sz3ptl";import"./ja-bloque.js?v=2pu5sm";import"./ja-luz-demo.js?v=w9e5vk";const h={paso:null,indice:0,total:1,creditos:"",audio:"",sonando:!1},y=$(import.meta.url,"ja-paso",h,(r,n,e)=>{const{paso:a,indice:s,total:d,creditos:l,audio:t,sonando:o}=n;if(!a)return;const c=s+1,p=s===d-1;e.id||=`paso-${c}`,e.toggleAttribute("data-sonando",o);const m=()=>g(e,"ja-narracion",{indice:s});r.append(i`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <header class="cabecera">
        <p class="numero" aria-hidden="true">${String(c).padStart(2,"0")}</p>
        <h2 id="titulo"><iswc-icon class="icono" icon=${a.icono} aria-hidden="true"></iswc-icon>${a.titulo}</h2>
        ${t?i`<iswc-button class="audio" part="audio" variant="ghost" shape="pill" size="sm" type="button" aria-label=${o?`Pausar la narraci\xF3n del paso ${c}`:`Reproducir la narraci\xF3n del paso ${c}`} aria-pressed=${o?"true":"false"} onclick=${m}><iswc-icon icon=${o?"mdi:pause":"mdi:play"}></iswc-icon></iswc-button>`:null}
      </header>
      <p class="narracion" part="narracion">${a.narracion}</p>
      ${a.bloques.length?i`<div class="bloques" part="bloques">${a.bloques.map(b=>u("ja-bloque",{bloque:b}))}</div>`:null}
      ${a.demo?i`<figure class="demo" part="demo">${u("ja-luz-demo",{paso:a.demo.paso})}<figcaption>${a.demo.leyenda}</figcaption></figure>`:null}
      ${p&&l?i`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${l}</iswc-callout>`:null}
    </article>
  `)},(r,n,e)=>{const{sonando:a,...s}=n,{sonando:d,...l}=e;if(JSON.stringify(s)!==JSON.stringify(l))return!1;const t=r.querySelector(".audio");if(!t)return!0;const o=n.indice+1;return t.setAttribute("aria-label",a?`Pausar la narraci\xF3n del paso ${o}`:`Reproducir la narraci\xF3n del paso ${o}`),t.setAttribute("aria-pressed",a?"true":"false"),t.querySelector("iswc-icon")?.setAttribute("icon",a?"mdi:pause":"mdi:play"),r.host.toggleAttribute("data-sonando",a),!0});f("ja-paso",y);
