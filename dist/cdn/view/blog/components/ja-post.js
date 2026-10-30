import{crearComponente as E,define as k,html as l,pieza as g}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as y,rutaSitio as m}from"../../../js/contenido/index.js?v=1rdoq5";import{audioPaso as v,fechaLarga as j}from"../../../js/contenido/derivados.js?v=inbaus";import{alCambiarRuta as S,estadoSpa as C}from"../../../js/base/rutas.js?v=mg1isv";import{cargarPublicacion as L}from"../utils/publicaciones.js?v=j14uu1";import"../../../js/components/ja/ja-link.js?v=9dv9k2";import"./ja-paso.js?v=6i96u4";const b=new WeakSet,w=new Set,f=()=>g("ja-link",{state:C({vista:"blog"}),variant:"button",icon:"mdi:arrow-left",shape:"pill"},{class:"volver"},"Todas las publicaciones");function H(t){t.append(l`
    <div class="articulo cargando" part="articulo" aria-busy="true" aria-label="Cargando la publicación">
      ${f()}
      <iswc-skeleton effect="sheen" style="height:2.4rem;width:70%"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:1.1rem"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:14rem;border-radius:1rem"></iswc-skeleton>
      <iswc-skeleton effect="sheen" style="height:14rem;border-radius:1rem"></iswc-skeleton>
    </div>
  `)}function R(t){t.append(l`<div class="articulo perdido">${f()}<iswc-callout tone="warning"><strong slot="title">Publicación no encontrada</strong>Revisa el enlace o vuelve a la lista del blog.</iswc-callout></div>`)}function T(t,e,o){const{perfil:r}=y,n=e.pasos.length;t.append(l`
    <article class="articulo" part="articulo">
      <header class="encabezado" part="encabezado">
        ${f()}
        <h1>${e.titulo}</h1>
        <p class="subtitulo">${e.subtitulo}</p>
        <div class="meta">
          <img src=${m(r.logo)} alt="" width="32" height="32">
          <span class="autor">${r.nombreCorto}</span>
          <span class="sep" aria-hidden="true">·</span>
          <time datetime=${e.fecha}>${j(e.fecha)}</time>
          <span class="sep" aria-hidden="true">·</span>
          <span>${n} pasos</span>
        </div>
        <div class="etiquetas">${e.etiquetas.map(a=>l`<iswc-tag variant="soft" color="brand" pill>${a}</iswc-tag>`)}</div>
        <nav class="indice" part="indice" aria-label="Contenido">
          <ol>${e.pasos.map((a,s)=>l`<li><a href=${`#paso-${s+1}`} data-spa="off">${a.titulo}</a></li>`)}</ol>
        </nav>
      </header>
      <div class="pasos" part="pasos">
        ${e.pasos.map((a,s)=>g("ja-paso",{paso:a,indice:s,total:n,creditos:e.creditos??"",audio:m(v(e,s))},{id:`paso-${s+1}`}))}
      </div>
    </article>
  `);const c=[...t.querySelectorAll("ja-paso")],i=new Audio;i.preload="none";let u=-1,p=!1;const h=a=>c.forEach((s,P)=>s.props={...s.props,sonando:P===a}),d=()=>{i.pause(),p=!1,h(-1)},$=a=>{a!==u&&(i.src=m(v(e,a)),u=a),p=!0,h(a),i.play().catch(d)};if(t.addEventListener("ja-narracion",a=>{const s=a.detail.indice;s===u&&p?d():$(s)}),i.addEventListener("ended",d),i.addEventListener("error",d),t.querySelector(".indice")?.addEventListener("click",a=>{const s=a.target.closest("a");s&&(a.preventDefault(),t.getElementById(s.getAttribute("href").slice(1))?.scrollIntoView({behavior:"smooth",block:"start"}))}),!b.has(o)){b.add(o);const a=S(()=>{o.isConnected||(i.pause(),a())})}}const M=E(import.meta.url,"ja-post",{slug:"",datos:null},(t,e,o)=>{const r=e.datos&&(!e.slug||e.datos.slug===e.slug)?e.datos:null;if(r)return T(t,r,o);if(!e.slug||w.has(e.slug))return R(t);H(t);const n=e.slug;L(n).then(c=>{!o.isConnected||o.props.slug!==n||(c||w.add(n),o.props={datos:c})})},void 0,["slug"]);k("ja-post",M);
