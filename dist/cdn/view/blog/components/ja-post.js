import{crearComponente as I,define as J,html as j,pieza as i}from"../../../js/base/componente.js?v=esixd4";import{contenido as T,rutaSitio as z}from"../../../js/contenido/index.js?v=mecx72";import{audioPaso as K,fechaLarga as N}from"../../../js/contenido/derivados.js?v=iwigun";import{alCambiarRuta as V,hrefDe as G}from"../../../js/base/rutas.js?v=a5yqf4";import{deslizar as O}from"../../../js/base/gestos.js?v=6stx69";import"../../../js/components/ja/ja-boton-icono.js?v=p3vqmq";import"../../../js/components/ja/ja-forma.js?v=5ui52s";import"./ja-luz-demo.js?v=3ra91f";import"./ja-paso.js?v=0482od";const q=new WeakSet,U=I(import.meta.url,"ja-post",{slug:""},(g,R,p)=>{const t=T.blog.find(a=>a.slug===R.slug),y=i("ja-boton-icono",{icono:"mdi:arrow-left",etiqueta:"Todas las publicaciones",href:G({vista:"blog"})},{class:"volver"});if(!t){g.append(j`<div class="perdido">${y}<iswc-callout tone="warning"><strong slot="title">Publicación no encontrada</strong>Revisa el enlace o vuelve a la lista del blog.</iswc-callout></div>`);return}const{perfil:L}=T,u=t.pasos.length;g.append(j`
    ${i("ja-forma",{tipo:"semicirculo",tono:"acento",tam:7,animacion:"flotar"},{class:"forma f1"})}
    ${i("ja-forma",{tipo:"zigzag",tono:"lila",tam:4,animacion:"derivar",retraso:2},{class:"forma f2"})}
    ${i("ja-forma",{tipo:"puntos",tono:"marca",tam:4.5,animacion:"derivar",retraso:4},{class:"forma f3"})}
    <div class="guia" part="guia">
      <aside class="indice" part="indice" aria-label="Pasos de la guía">
        <div class="arriba">
          ${y}
          <span class="insignia"><iswc-icon icon="mdi:headphones"></iswc-icon>Guía narrada</span>
        </div>
        <h1>${t.titulo}</h1>
        <p class="subtitulo">${t.subtitulo}</p>
        <div class="autor">
          <img src=${z(L.logo)} alt="" width="36" height="36">
          <div><strong>${L.nombreCorto}</strong><span>${N(t.fecha)}</span></div>
        </div>
        <div class="avance">
          <span class="cuenta"></span>
          <iswc-progress-bar class="barra" max=${u} value="1"></iswc-progress-bar>
        </div>
        <ol class="pasos">
          ${t.pasos.map((a,o)=>j`
            <li><button type="button" class="paso" data-i=${o}>
              <span class="num">${o+1}</span>
              <iswc-icon icon=${a.icono} aria-hidden="true"></iswc-icon>
              <span class="nombre">${a.titulo}</span>
            </button></li>`)}
        </ol>
      </aside>
      <section class="escenario" part="escenario" aria-live="polite">
        <div class="zona-paso"></div>
      </section>
      <aside class="lado" part="lado">
        <figure class="demo">
          <span class="cinta c1" aria-hidden="true"></span>
          <span class="cinta c2" aria-hidden="true"></span>
          <div class="zona-demo"></div>
          <figcaption></figcaption>
        </figure>
        <nav class="controles" aria-label="Controles de la guía">
          ${i("ja-boton-icono",{icono:"mdi:chevron-left",etiqueta:"Paso anterior"},{class:"anterior"})}
          ${i("ja-boton-icono",{icono:"mdi:play",etiqueta:"Escuchar este paso",tono:"marca",tam:"lg"},{class:"escuchar"})}
          ${i("ja-boton-icono",{icono:"mdi:chevron-right",etiqueta:"Paso siguiente"},{class:"siguiente"})}
          <span class="onda" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          ${i("ja-boton-icono",{icono:"mdi:auto-mode",etiqueta:"Modo guiado: narra y avanza solo"},{class:"guiado"})}
          <p class="atajo"><kbd>←</kbd><kbd>→</kbd> cambian de paso</p>
        </nav>
      </aside>
    </div>
  `);const r=a=>g.querySelector(a),b=r(".zona-paso"),B=r(".zona-demo"),M=r("figcaption"),S=r(".demo"),H=r(".cuenta"),x=r(".barra"),$=[...g.querySelectorAll(".paso")],[k,P,A,C]=[".anterior",".escuchar",".siguiente",".guiado"].map(a=>r(a)),c=new Audio;c.preload="none";let s=-1,e=!1,m=!1;const v=(a,o)=>a.props={...a.props,...o},l=()=>{p.toggleAttribute("data-sonando",e),v(P,{icono:e?"mdi:pause":"mdi:play",etiqueta:e?"Pausar la narraci\xF3n":"Escuchar este paso"}),v(C,{activo:m})},E=()=>{c.play().then(()=>{e=!0,l()},()=>{e=!1,l()})},n=(a,o=!0)=>{if(a<0||a>=u||a===s)return;const d=s;s=a;const D=t.pasos[a];b.replaceChildren(i("ja-paso",{slug:t.slug,indice:a}));const f=D.demo;S.hidden=!f,f&&(d<0||t.pasos[d]?.demo?.paso!==f.paso)&&B.replaceChildren(i("ja-luz-demo",{paso:f.paso})),M.textContent=f?.leyenda??"",H.textContent=`Paso ${a+1} de ${u}`,x.setAttribute("value",String(a+1)),$.forEach((h,w)=>{h.toggleAttribute("data-hecho",w<a),h.toggleAttribute("data-actual",w===a),w===a?h.setAttribute("aria-current","step"):h.removeAttribute("aria-current")}),$[a]?.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"}),v(k,{deshabilitado:a===0}),v(A,{deshabilitado:a===u-1}),c.src=z(K(t,a)),e&&E(),o&&d>=0&&b.getBoundingClientRect().top<0&&b.scrollIntoView({block:"start",behavior:"smooth"})};c.addEventListener("ended",()=>{m&&s<u-1?n(s+1,!1):(e=!1,l())}),c.addEventListener("error",()=>{e=!1,l()});for(const a of $)a.addEventListener("click",()=>n(Number(a.dataset.i)));if(O(b,a=>n(s+a)),k.addEventListener("click",()=>n(s-1)),A.addEventListener("click",()=>n(s+1)),P.addEventListener("click",()=>{e?(c.pause(),e=!1,l()):E()}),C.addEventListener("click",()=>{m=!m,m&&!e&&E(),l()}),!q.has(p)){q.add(p);const a=V(()=>{p.isConnected||(c.pause(),a())});addEventListener("keydown",o=>{if(!p.isConnected||o.altKey||o.ctrlKey||o.metaKey)return;const d=o.composedPath()[0];d&&/^(INPUT|TEXTAREA|SELECT)$/.test(d.tagName)||(o.key==="ArrowRight"&&n(s+1),o.key==="ArrowLeft"&&n(s-1))})}n(0,!1),l()});J("ja-post",U);
