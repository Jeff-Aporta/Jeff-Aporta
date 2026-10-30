import{crearComponente as r,define as p,html as s,pieza as d}from"../../../js/base/componente.js?v=26a3va";import"./ja-bloque.js?v=psk84g";const u=r(import.meta.url,"ja-paso",{paso:null,indice:0,total:1,creditos:""},(e,c)=>{const{paso:a,indice:o,total:i,creditos:t}=c;if(!a)return;const l=o===i-1;e.append(s`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <span class="pliegue" aria-hidden="true"></span>
      <header class="cabecera">
        <span class="sello" aria-hidden="true">${String(o+1).padStart(2,"0")}</span>
        <div class="textos">
          <p class="cejilla">Paso ${o+1} de ${i}</p>
          <h2 id="titulo">${a.titulo}</h2>
        </div>
        <span class="icono" aria-hidden="true"><iswc-icon icon=${a.icono}></iswc-icon></span>
      </header>
      <blockquote class="narracion" part="narracion">
        <iswc-icon icon="mdi:microphone-outline" aria-hidden="true"></iswc-icon>
        <p>${a.narracion}</p>
      </blockquote>
      ${a.bloques.length?s`<div class="bloques" part="bloques">${a.bloques.map(n=>d("ja-bloque",{bloque:n}))}</div>`:null}
      ${l&&t?s`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${t}</iswc-callout>`:null}
    </article>
  `)});p("ja-paso",u);
