import{crearComponente as s,define as n,html as t}from"../../base/componente.js?v=esixd4";const c=s(import.meta.url,"ja-rasgo",{icono:"mdi:star-outline",titulo:"",texto:"",tono:"marca"},(a,o,e)=>{e.dataset.tono=o.tono,a.append(t`
    <article class="tarjeta" part="tarjeta">
      <header>
        <span class="icono" part="icono"><iswc-icon icon=${o.icono}></iswc-icon></span>
        <h3 part="titulo">${o.titulo}</h3>
      </header>
      ${o.texto?t`<p>${o.texto}</p>`:null}
      <slot></slot>
    </article>
  `)});n("ja-rasgo",c);
