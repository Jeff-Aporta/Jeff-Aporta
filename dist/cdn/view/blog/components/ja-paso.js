import{crearComponente as n,define as l,html as e,pieza as r}from"../../../js/base/componente.js?v=esixd4";import{contenido as d}from"../../../js/contenido/index.js?v=mecx72";import"./ja-bloque.js?v=lsizf1";const p=n(import.meta.url,"ja-paso",{slug:"",indice:0},(t,o)=>{const a=d.blog.find(i=>i.slug===o.slug),s=a?.pasos[o.indice];if(!a||!s)return;const c=o.indice===a.pasos.length-1;t.append(e`
    <article class="tarjeta" part="tarjeta" aria-labelledby="titulo">
      <span class="pliegue" aria-hidden="true"></span>
      <header class="cabecera">
        <span class="sello" aria-hidden="true">${String(o.indice+1).padStart(2,"0")}</span>
        <div class="textos">
          <p class="cejilla">Paso ${o.indice+1} de ${a.pasos.length}</p>
          <h2 id="titulo">${s.titulo}</h2>
        </div>
        <span class="icono" aria-hidden="true"><iswc-icon icon=${s.icono}></iswc-icon></span>
      </header>
      <blockquote class="narracion" part="narracion">
        <iswc-icon icon="mdi:microphone-outline" aria-hidden="true"></iswc-icon>
        <p>${s.narracion}</p>
      </blockquote>
      ${s.bloques.length?e`<div class="bloques" part="bloques">${s.bloques.map(i=>r("ja-bloque",{bloque:i}))}</div>`:null}
      ${c&&a.creditos?e`<iswc-callout class="creditos" tone="info"><strong slot="title">Créditos</strong>${a.creditos}</iswc-callout>`:null}
    </article>
  `)});l("ja-paso",p);
