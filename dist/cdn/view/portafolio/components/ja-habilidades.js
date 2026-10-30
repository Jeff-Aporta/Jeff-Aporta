import{crearComponente as h,define as b,html as s,pieza as l}from"../../../js/base/componente.js?v=sz3ptl";import{contenido as g}from"../../../js/contenido/index.js?v=1rdoq5";import{usoAreas as v,usoTecnologias as $}from"../../../js/contenido/derivados.js?v=inbaus";import"../../../js/components/ja/ja-rasgo.js?v=ggaabm";import"./ja-barra-uso.js?v=zslmyf";const t=8,m=["marca","acento","lila","exito","peligro","marca","acento","lila"],p=e=>{const n=Math.max(...e.map(o=>o.meses),1);return s`<div class="barras">${e.map(o=>l("ja-barra-uso",{nombre:o.nombre,meses:o.meses,maximo:n}))}</div>`},j=h(import.meta.url,"ja-habilidades",{},(e,n,o)=>{const{experiencia:c,habilidades:r}=g,d=a=>s`
    <div class="items">
      ${a.map((i,u)=>s`<iswc-tag class=${u<t?"":"extra"} variant="outlined" pill>${i}</iswc-tag>`)}
      ${a.length>t?s`<button type="button" class="mas" aria-label=${`Ver ${a.length-t} tecnolog\xEDas m\xE1s`} onclick=${()=>o.toggleAttribute("data-todas",!0)}>+${a.length-t} más</button>`:null}
    </div>`;e.append(s`
    <div class="areas" part="areas">
      ${r.map((a,i)=>l("ja-rasgo",{icono:a.icono,titulo:a.titulo,texto:a.descripcion,tono:m[i%m.length]},{},d(a.items)))}
    </div>
    <iswc-card class="uso" part="uso" variant="outlined">
      <div class="uso-cabeza">
        <h3>Experiencia acumulada</h3>
        <p>Cuánto tiempo he usado cada área y tecnología en mis trabajos. Cada mes cuenta una sola vez.</p>
      </div>
      <div class="bloques">
        <section>
          <h4>Por área</h4>
          ${p(v(c,r))}
        </section>
        <section>
          <h4>Por tecnología</h4>
          ${p($(c,12))}
        </section>
      </div>
    </iswc-card>
  `)});b("ja-habilidades",j);
