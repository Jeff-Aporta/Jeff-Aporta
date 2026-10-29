import{crearComponente as $,define as E,html as y,pieza as c}from"../../base/componente.js?v=evs5g9";import{iniciarParalaje as C}from"../../base/paralaje.js?v=uzj8n1";import{alCambiarRuta as k,hrefDe as l,leerRuta as A,navegar as p}from"../../base/rutas.js?v=a5yqf4";import{contenido as f}from"../../contenido/index.js?v=yi9vmp";import{tagsVista as R}from"../../kit-tags.js?v=v9gkz3";import{LoaderAppSchema as P}from"../../consts/schemas/loader.schemas.js?v=nikuky";import"./ja-marca.js?v=e8muxs";const w=new WeakSet,v=new Map;function T(a){const n=P.safeParse(globalThis.iswcLoader);return n.success?(v.has(a)||v.set(a,n.data.load(...R(a)).catch(e=>console.warn(`[ja] vista ${a}`,e))),v.get(a)):Promise.resolve()}function H(a,n){const{sitio:e}=f;return[{id:"vista",label:"Vistas",value:a.vista==="portafolio"?"portafolio":"blog",tabs:[{id:"portafolio",label:"Yo",icon:"mdi:account-tie-outline",href:l({vista:"portafolio",seccion:"inicio"})},{id:"blog",label:"Blog",icon:"mdi:post-outline",href:l({vista:"blog"})}]},{id:"seccion",label:"Secciones de Yo",parent:"portafolio",value:n,tabs:e.secciones.map(t=>({id:t.id,label:t.titulo,href:l({vista:"portafolio",seccion:t.id})}))}]}function q(a){const{sitio:n,blog:e,perfil:t}=f;return a.vista==="blog"?`Blog \xB7 ${t.nombreCorto}`:a.vista==="post"?`${e.find(u=>u.slug===a.slug)?.titulo??"Publicaci\xF3n"} \xB7 ${t.nombreCorto}`:n.titulo}const M=$(import.meta.url,"ja-app",{seccion:"inicio"},(a,n,e)=>{const{perfil:t}=f;a.append(y`
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        <a class="marca" href=${l({vista:"portafolio",seccion:"inicio"})} aria-label="Ir al inicio">${c("ja-marca",{subtitulo:"Full Stack Developer"})}</a>
        <iswc-app-nav class="pestanas"></iswc-app-nav>
        <div class="acciones">
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
      <div class="franja" part="franja">
        <div class="interior"><iswc-app-nav class="secciones"></iswc-app-nav></div>
      </div>
    </header>
    <main id="contenido" class="vista" part="vista"></main>
    <footer class="pie" part="pie">
      <div class="interior">
        ${c("ja-marca",{subtitulo:`${t.titular} \xB7 ${t.ubicacion}`},{class:"firma"})}
        <div class="redes">
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.github} target="_blank" rel="noopener" title="GitHub"><iswc-icon icon="mdi:github"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.youtube} target="_blank" rel="noopener" title="YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${t.contacto.whatsapp} target="_blank" rel="noopener" title="WhatsApp"><iswc-icon icon="mdi:whatsapp"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${`mailto:${t.contacto.email}`} title="Correo"><iswc-icon icon="mdi:email-outline"></iswc-icon></iswc-button>
        </div>
        <p class="legal">© ${new Date().getFullYear()} ${t.nombreCorto}</p>
      </div>
    </footer>
  `);const u=a.querySelector(".pestanas"),h=a.querySelector(".secciones"),S=a.querySelector(".franja"),m=a.querySelector("main");let s=null,r=null;for(const i of["wheel","touchstart","keydown"])addEventListener(i,()=>r=null,{passive:!0});const b=(i,o)=>{const[j,L]=H(i,o);u.rows=[j],h.rows=[{...L,parent:void 0}],S.hidden=i.vista!=="portafolio"},g=()=>{const i=A(),o=!s||s.vista!==i.vista||i.vista==="post"&&s.vista==="post"&&s.slug!==i.slug;o&&(e.vistaLista=T(i.vista==="portafolio"?"portafolio":"blog"),m.replaceChildren(i.vista==="portafolio"?c("ja-portafolio",{}):i.vista==="blog"?c("ja-blog",{}):c("ja-post",{slug:i.slug}))),document.title=q(i),b(i,i.vista==="portafolio"?i.seccion:"inicio"),i.vista==="portafolio"&&i.seccion!=="inicio"?(r=i.seccion,customElements.whenDefined("ja-portafolio").then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>m.querySelector("ja-portafolio")?.irA?.(i.seccion,!o))))):(o||i.vista==="portafolio"&&s?.vista==="portafolio")&&scrollTo({top:0,behavior:o?"auto":"smooth"}),s=i};a.addEventListener("iswc-nav-select",i=>{const o=i.detail;o.row==="vista"?p(o.id==="blog"?{vista:"blog"}:{vista:"portafolio",seccion:"inicio"}):p({vista:"portafolio",seccion:o.id})}),a.querySelector(".marca")?.addEventListener("click",i=>{i.preventDefault(),p({vista:"portafolio",seccion:"inicio"})});let d=!1;a.addEventListener("ja-seccion-visible",i=>{const o=i.detail?.id;if(!(!o||s?.vista!=="portafolio")){if(r){if(o!==r)return;r=null}b(s,o),s={vista:"portafolio",seccion:o},d=!0,p(s,"replace"),d=!1}}),w.has(e)||(w.add(e),k(()=>e.isConnected&&e.recargarRuta?.())),e.recargarRuta=()=>d||g(),C(),g()});E("ja-app",M);
