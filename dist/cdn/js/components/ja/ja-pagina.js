import{crearComponente as n,define as r,html as t,pieza as e}from"../../base/componente.js?v=26a3va";import{hrefDe as i}from"../../base/rutas.js?v=a7fbwz";import"./ja-marca.js?v=27j7lj";import"./ja-pie.js?v=mfv8uv";const l=n(import.meta.url,"ja-pagina",{activa:"blog"},(s,o)=>{const c=[{id:"portafolio",etiqueta:"Yo",icono:"mdi:account-tie-outline",href:i({vista:"portafolio",seccion:"inicio"})},{id:"blog",etiqueta:"Blog",icono:"mdi:post-outline",href:i({vista:"blog"})}];s.append(t`
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        <a class="marca" href=${i({vista:"portafolio",seccion:"inicio"})} aria-label="Ir al inicio">${e("ja-marca",{subtitulo:"Full Stack Developer"})}</a>
        <nav class="vistas" part="vistas" aria-label="Vistas">
          ${c.map(a=>t`<a class="vista" href=${a.href} ?data-activa=${a.id===o.activa} aria-current=${a.id===o.activa?"page":"false"}><iswc-icon icon=${a.icono}></iswc-icon>${a.etiqueta}</a>`)}
        </nav>
        <div class="acciones">
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
    </header>
    <main id="contenido" class="contenido" part="contenido"><slot></slot></main>
    ${e("ja-pie",{})}
  `)},void 0,["activa"]);r("ja-pagina",l);
