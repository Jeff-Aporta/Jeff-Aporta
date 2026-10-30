import{crearComponente as e,define as l,html as o}from"../../base/componente.js?v=esixd4";import{contenido as c,rutaSitio as m}from"../../contenido/index.js?v=mecx72";const n=e(import.meta.url,"ja-marca",{subtitulo:"Full Stack Developer",compacta:!1},(r,t,s)=>{s.toggleAttribute("data-compacta",t.compacta);const{perfil:a}=c;r.append(o`
    <img class="logo" part="logo" src=${m(a.logo)} alt="" width="44" height="44">
    <span class="textos">
      <strong part="nombre">${a.nombreCorto}</strong>
      ${t.subtitulo?o`<small part="subtitulo">${t.subtitulo}</small>`:null}
    </span>
  `)});l("ja-marca",n);
