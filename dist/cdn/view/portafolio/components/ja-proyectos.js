import{crearComponente as d,define as u,html as a,pieza as b}from"../../../js/base/componente.js?v=evs5g9";import{contenido as y}from"../../../js/contenido/index.js?v=yi9vmp";import{deslizar as $}from"../../../js/base/gestos.js?v=6stx69";import"./ja-proyecto.js?v=g48ctx";const i=[["Producto","Maquetas","","mdi:application-outline"],["Open source","Open source","","mdi:github"],["Educativo","Educativo","","mdi:school-outline"],["Laboratorio","Laboratorio","","mdi:flask-outline"]],P=d(import.meta.url,"ja-proyectos",{tipo:"Producto"},(r,n)=>{const{proyectos:e}=y;r.append(a`
    <iswc-tab-group id="proyectos" state active=${n.tipo} part="pestanas">
      ${i.map(([o,t,p,l])=>a`
        <iswc-tab slot="nav" panel=${o}>
          <iswc-icon icon=${l}></iswc-icon>
          <span class="cuenta">${e.filter(m=>m.tipo===o).length}</span>
          <span class="nombre">${t}${p?a`<span class="largo">${p}</span>`:null}</span>
        </iswc-tab>
      `)}
      ${i.map(([o])=>a`
        <iswc-tab-panel name=${o}>
          <div class=${`rejilla ${o==="Laboratorio"?"laboratorio":"productos"}`}>
            ${e.filter(t=>t.tipo===o).map(t=>b("ja-proyecto",{id:t.id}))}
          </div>
        </iswc-tab-panel>
      `)}
    </iswc-tab-group>
  `);const s=r.querySelector("iswc-tab-group"),c=i.map(([o])=>o);$(s,o=>{const t=c[c.indexOf(s.active)+o];t&&(s.active=t)})});u("ja-proyectos",P);
