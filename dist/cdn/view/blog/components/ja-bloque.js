import{crearComponente as s,define as n,html as e}from"../../../js/base/componente.js?v=esixd4";const l=s(import.meta.url,"ja-bloque",{bloque:null},(i,t,c)=>{const o=t.bloque;o&&(c.dataset.tipo=o.tipo,o.tipo==="md"&&i.append(e`<iswc-md-render class="texto" readonly value=${o.md}></iswc-md-render>`),o.tipo==="nota"&&i.append(e`
      <iswc-callout tone=${o.tono}>
        <strong slot="title">${o.titulo}</strong>
        <iswc-md-render class="texto" readonly value=${o.md}></iswc-md-render>
      </iswc-callout>
    `),o.tipo==="codigo"&&i.append(e`
      <figure class="codigo">
        ${o.titulo?e`<figcaption><iswc-icon icon="mdi:code-tags"></iswc-icon>${o.titulo}</figcaption>`:null}
        <iswc-code lang=${o.lenguaje} readonly compact line-numbers value=${o.codigo}></iswc-code>
      </figure>
    `))});n("ja-bloque",l);
