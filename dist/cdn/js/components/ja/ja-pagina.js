import{avisar as c,crearComponente as l,define as p,html as d,pieza as i}from"../../base/componente.js?v=sz3ptl";import{estadoSpa as t}from"../../base/rutas.js?v=mg1isv";import"./ja-link.js?v=9dv9k2";import"./ja-marca.js?v=uy7ov9";import"./ja-pie.js?v=3alizl";const m=l(import.meta.url,"ja-pagina",{activa:"blog"},(o,e)=>{const n=[{id:"portafolio",etiqueta:"Yo",icono:"mdi:account-tie-outline",state:t({vista:"portafolio",seccion:"inicio"})},{id:"blog",etiqueta:"Blog",icono:"mdi:post-outline",state:t({vista:"blog"})}],r=document.querySelector('link[rel="canonical"]')?.getAttribute("href")||location.href;o.append(d`
    <a class="saltar" href="#contenido" data-spa="off">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        ${i("ja-link",{state:t({vista:"portafolio",seccion:"inicio"})},{class:"marca","aria-label":"Ir al inicio"},i("ja-marca",{subtitulo:"Full Stack Developer"}))}
        <nav class="vistas" part="vistas" aria-label="Vistas">
          ${n.map(a=>i("ja-link",{state:a.state,variant:"nav",icon:a.icono},{class:"vista","data-activa":a.id===e.activa,"aria-current":a.id===e.activa?"page":!1},a.etiqueta))}
        </nav>
        <div class="acciones">
          <iswc-share-button class="compartir" url=${r} share-title=${document.title} aria-label="Compartir esta página" title="Compartir esta página"><iswc-icon icon="mdi:share-variant-outline"></iswc-icon></iswc-share-button>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
    </header>
    <main id="contenido" class="contenido" part="contenido"><slot></slot></main>
    ${i("ja-pie",{})}
  `);const s=o.querySelector(".compartir");s.addEventListener("iswc-share",a=>{a.detail?.how==="copied"&&c("Enlace copiado","success")}),s.addEventListener("iswc-error",()=>c("No se pudo compartir","warning"))},void 0,["activa"]);p("ja-pagina",m);
