import{crearComponente as $,define as g,html as s,pieza as l}from"../../../js/base/componente.js?v=evs5g9";import{contenido as m,rutaSitio as d}from"../../../js/contenido/index.js?v=kyqswz";import{cifras as b,duracion as w,mesesEmpleo as f,rangoEmpleo as h}from"../../../js/contenido/derivados.js?v=iwigun";import"../../../js/components/ja/ja-forma.js?v=pbihtc";import"../../../js/components/ja/ja-ilustracion.js?v=w19l58";import"../../../js/components/ja/ja-insignia.js?v=cser8h";import"../../../js/components/ja/ja-lista.js?v=rj7zeo";const v=()=>new Set(m.habilidades.flatMap(r=>r.items)).size;function y(r){const{experiencia:t,proyectos:c,habilidades:p}=m,e=i=>i.logo?s`<img class="marca" src=${d(i.logo)} alt="" loading="lazy">`:s`<span class="marca icono"><iswc-icon icon=${i.icono??"mdi:domain"}></iswc-icon></span>`;if(r==="experiencia")return s`<ol class="lista">${t.map(i=>s`
      <li>${e(i)}<div><strong>${i.cargo}</strong><span>${i.empresa} · ${h(i)}</span></div><em>${w(f(i))}</em></li>`)}</ol>
      <p class="nota">Los trabajos al mismo tiempo cuentan una sola vez en el total.</p>`;if(r==="empresas"){const i=t.filter((a,o)=>t.findIndex(n=>n.empresa===a.empresa)===o);return s`<ul class="lista">${i.map(a=>s`
      <li>${e(a)}<div><strong>${a.empresa}</strong><span>${a.sector}</span></div><em>${a.ubicacion}</em></li>`)}</ul>`}if(r==="proyectos"){const i=[...new Set(c.map(a=>a.tipo))];return s`${i.map(a=>s`
      <h3>${a==="Producto"?"Maquetas":a}</h3>
      <ul class="lista">${c.filter(o=>o.tipo===a).map(o=>s`
        <li><span class="marca icono"><iswc-icon icon="mdi:rocket-launch-outline"></iswc-icon></span><div><strong>${o.titulo}</strong><span>${o.categoria}</span></div>
          <a href=${o.demo??o.codigo} target="_blank" rel="noopener" aria-label=${`Abrir ${o.titulo}`}><iswc-icon icon="mdi:arrow-top-right"></iswc-icon></a></li>`)}</ul>`)}`}return s`${p.map(i=>s`
    <h3><iswc-icon icon=${i.icono}></iswc-icon>${i.titulo} <small>${i.items.length}</small></h3>
    <div class="tags">${i.items.map(a=>s`<iswc-tag variant="soft" pill>${a}</iswc-tag>`)}</div>`)}`}const S=[{clase:"f1",props:{tipo:"triangulo",tono:"peligro",tam:2.2,animacion:"girar",retraso:3}},{clase:"f2",props:{tipo:"onda",tono:"marca",tam:4,animacion:"derivar",retraso:1}},{clase:"f3",props:{tipo:"cruz",tono:"lila",tam:1.6,animacion:"girar",retraso:8}},{clase:"f4",props:{tipo:"circulo",tono:"acento",tam:1.2,animacion:"latir",retraso:2}},{clase:"f5",props:{tipo:"zigzag",tono:"exito",tam:3.2,animacion:"flotar",retraso:5}}],j=[{clase:"uno",props:{icono:"mdi:language-typescript",titulo:"TypeScript",subtitulo:"Web Components"}},{clase:"dos",props:{icono:"mdi:robot-happy-outline",titulo:"IA aplicada",subtitulo:"LLM \xB7 MCP"}},{clase:"tres",props:{icono:"mdi:server-network",titulo:"APIs",subtitulo:"REST \xB7 GraphQL"}}],x=$(import.meta.url,"ja-hero",{},r=>{const{perfil:t,experiencia:c,proyectos:p}=m,e=o=>()=>{r.host.getRootNode().host?.irA?.(o)},i=b(c,p.length,v()),a=o=>()=>{const n=r.querySelector("iswc-dialog"),u=n.querySelector(".detalle");n.label=`${o.etiqueta} \xB7 ${o.valor}`,u.replaceChildren(y(o.clave)),n.open=!0};r.append(s`
    ${S.map(o=>l("ja-forma",o.props,{class:`forma ${o.clase}`}))}
    <div class="contenedor principal">
      <div class="texto">
        <iswc-tag class="ubicacion" color="brand" variant="soft" pill><iswc-icon slot="start" class="bandera" icon=${t.bandera}></iswc-icon>${t.ubicacion}</iswc-tag>
        <p class="saludo">Hola, soy</p>
        <h1 class="nombre" part="nombre">${t.nombreCorto}</h1>
        <p class="titular">${t.titular}</p>
        <p class="propuesta">${t.propuesta}</p>
        ${l("ja-lista",{items:t.roles,variante:"linea",tono:"exito"})}
        <div class="acciones">
          <iswc-button color="brand" variant="filled" shape="pill" oniswc-click=${e("proyectos")}>
            Ver proyectos <iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
          </iswc-button>
          <iswc-button color="brand" variant="outlined" shape="pill" oniswc-click=${e("trayectoria")}>
            <iswc-icon slot="start" icon="mdi:timeline-outline"></iswc-icon> Trayectoria
          </iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${d(t.cv)} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:file-eye-outline"></iswc-icon> Hoja de vida
          </iswc-button>
        </div>
      </div>
      <div class="visual">
        ${l("ja-ilustracion",{nombre:"hero"},{class:"fondo"})}
        <figure class="retrato">
          <img src=${d(t.foto.src)} alt=${t.foto.alt} width="717" height="694" fetchpriority="high">
        </figure>
        ${j.map((o,n)=>l("ja-insignia",o.props,{class:`insignia ${o.clase}`,style:`animation-delay:-${n*2}s`}))}
      </div>
    </div>
    <div class="contenedor cifras" part="cifras">
      ${i.map(o=>s`
        <button class="cifra" type="button" aria-haspopup="dialog" onclick=${a(o)}>
          <iswc-stat label=${o.etiqueta} value=${o.valor} helper=${o.detalle} icon=${o.icono} color="brand"></iswc-stat>
          <span class="ver">Ver todo <iswc-icon icon="mdi:arrow-expand"></iswc-icon></span>
        </button>`)}
    </div>
    <iswc-dialog class="modal" light-dismiss backdrop-variant="basic"><div class="detalle"></div></iswc-dialog>
  `)});g("ja-hero",x);
