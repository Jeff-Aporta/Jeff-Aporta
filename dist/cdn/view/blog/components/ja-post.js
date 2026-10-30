import{crearComponente as I,define as J,html as $,pieza as c}from"../../../js/base/componente.js?v=26a3va";import{contenido as N,rutaSitio as R}from"../../../js/contenido/index.js?v=mecx72";import{audioPaso as K,fechaLarga as O}from"../../../js/contenido/derivados.js?v=inbaus";import{alCambiarRuta as V,hrefDe as G}from"../../../js/base/rutas.js?v=a7fbwz";import{deslizar as U}from"../../../js/base/gestos.js?v=6stx69";import{cargarPublicacion as W,urlPublica as X}from"../utils/publicaciones.js?v=vpss7i";import"../../../js/components/ja/ja-boton-icono.js?v=gygypq";import"../../../js/components/ja/ja-forma.js?v=0mkgi9";import"./ja-luz-demo.js?v=4ph62b";import"./ja-paso.js?v=scoli4";const S=new WeakSet,H=new Set,j=()=>c("ja-boton-icono",{icono:"mdi:arrow-left",etiqueta:"Todas las publicaciones",href:G({vista:"blog"})},{class:"volver"});function F(s){s.append($`
    <div class="guia cargando" part="guia" aria-busy="true" aria-label="Cargando la publicación">
      <aside class="indice">
        <div class="arriba">${j()}</div>
        <iswc-skeleton effect="sheen" style="height:2rem;width:85%"></iswc-skeleton>
        <iswc-skeleton effect="sheen" style="height:1rem"></iswc-skeleton>
        <iswc-skeleton effect="sheen" style="height:1rem;width:70%"></iswc-skeleton>
      </aside>
      <section class="escenario"><iswc-skeleton effect="sheen" style="height:22rem;border-radius:1rem"></iswc-skeleton></section>
      <aside class="lado"><iswc-skeleton effect="sheen" style="height:18rem;border-radius:1rem"></iswc-skeleton></aside>
    </div>
  `)}function Q(s){s.append($`<div class="perdido">${j()}<iswc-callout tone="warning"><strong slot="title">Publicación no encontrada</strong>Revisa el enlace o vuelve a la lista del blog.</iswc-callout></div>`)}function Y(s,e,i){const{perfil:f}=N,n=e.pasos.length,g=X(e.slug);s.append($`
    ${c("ja-forma",{tipo:"semicirculo",tono:"acento",tam:7,animacion:"flotar"},{class:"forma f1"})}
    ${c("ja-forma",{tipo:"zigzag",tono:"lila",tam:4,animacion:"derivar",retraso:2},{class:"forma f2"})}
    ${c("ja-forma",{tipo:"puntos",tono:"marca",tam:4.5,animacion:"derivar",retraso:4},{class:"forma f3"})}
    <div class="guia" part="guia">
      <aside class="indice" part="indice" aria-label="Pasos de la guía">
        <div class="arriba">
          ${j()}
          <span class="insignia"><iswc-icon icon="mdi:headphones"></iswc-icon>Guía narrada</span>
        </div>
        <h1>${e.titulo}</h1>
        <p class="subtitulo">${e.subtitulo}</p>
        <div class="autor">
          <img src=${R(f.logo)} alt="" width="36" height="36">
          <div><strong>${f.nombreCorto}</strong><span>${O(e.fecha)}</span></div>
        </div>
        <div class="compartir" part="compartir">
          <iswc-share-button class="share" share-title=${e.titulo} text=${e.resumen} url=${g}></iswc-share-button>
          <iswc-copy-button class="copiar" value=${g} tooltip="full" copy-label="Copiar enlace" success-label="Enlace copiado" error-label="No se pudo copiar"></iswc-copy-button>
        </div>
        <div class="avance">
          <span class="cuenta"></span>
          <iswc-progress-bar class="barra" max=${n} value="1"></iswc-progress-bar>
        </div>
        <ol class="pasos">
          ${e.pasos.map((a,o)=>$`
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
          ${c("ja-boton-icono",{icono:"mdi:chevron-left",etiqueta:"Paso anterior"},{class:"anterior"})}
          ${c("ja-boton-icono",{icono:"mdi:play",etiqueta:"Escuchar este paso",tono:"marca",tam:"lg"},{class:"escuchar"})}
          ${c("ja-boton-icono",{icono:"mdi:chevron-right",etiqueta:"Paso siguiente"},{class:"siguiente"})}
          <span class="onda" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          ${c("ja-boton-icono",{icono:"mdi:auto-mode",etiqueta:"Modo guiado: narra y avanza solo"},{class:"guiado"})}
          <p class="atajo"><kbd>←</kbd><kbd>→</kbd> cambian de paso</p>
        </nav>
      </aside>
    </div>
  `);const d=a=>s.querySelector(a),v=d(".zona-paso"),q=d(".zona-demo"),M=d("figcaption"),B=d(".demo"),x=d(".cuenta"),D=d(".barra"),E=[...s.querySelectorAll(".paso")],[L,C,A,T]=[".anterior",".escuchar",".siguiente",".guiado"].map(a=>d(a)),u=new Audio;u.preload="none";let r=-1,t=!1,h=!1;const w=(a,o)=>a.props={...a.props,...o},p=()=>{i.toggleAttribute("data-sonando",t),w(C,{icono:t?"mdi:pause":"mdi:play",etiqueta:t?"Pausar la narraci\xF3n":"Escuchar este paso"}),w(T,{activo:h})},k=()=>{u.play().then(()=>{t=!0,p()},()=>{t=!1,p()})},l=(a,o=!0)=>{if(a<0||a>=n||a===r)return;const m=r;r=a;const z=e.pasos[a];v.replaceChildren(c("ja-paso",{paso:z,indice:a,total:n,creditos:e.creditos??""}));const b=z.demo;B.hidden=!b,b&&(m<0||e.pasos[m]?.demo?.paso!==b.paso)&&q.replaceChildren(c("ja-luz-demo",{paso:b.paso})),M.textContent=b?.leyenda??"",x.textContent=`Paso ${a+1} de ${n}`,D.setAttribute("value",String(a+1)),E.forEach((y,P)=>{y.toggleAttribute("data-hecho",P<a),y.toggleAttribute("data-actual",P===a),P===a?y.setAttribute("aria-current","step"):y.removeAttribute("aria-current")}),E[a]?.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"}),w(L,{deshabilitado:a===0}),w(A,{deshabilitado:a===n-1}),u.src=R(K(e,a)),t&&k(),o&&m>=0&&v.getBoundingClientRect().top<0&&v.scrollIntoView({block:"start",behavior:"smooth"})};u.addEventListener("ended",()=>{h&&r<n-1?l(r+1,!1):(t=!1,p())}),u.addEventListener("error",()=>{t=!1,p()});for(const a of E)a.addEventListener("click",()=>l(Number(a.dataset.i)));if(U(v,a=>l(r+a)),L.addEventListener("click",()=>l(r-1)),A.addEventListener("click",()=>l(r+1)),C.addEventListener("click",()=>{t?(u.pause(),t=!1,p()):k()}),T.addEventListener("click",()=>{h=!h,h&&!t&&k(),p()}),!S.has(i)){S.add(i);const a=V(()=>{i.isConnected||(u.pause(),a())});addEventListener("keydown",o=>{if(!i.isConnected||o.altKey||o.ctrlKey||o.metaKey)return;const m=o.composedPath()[0];m&&/^(INPUT|TEXTAREA|SELECT)$/.test(m.tagName)||(o.key==="ArrowRight"&&l(r+1),o.key==="ArrowLeft"&&l(r-1))})}l(0,!1),p()}const Z=I(import.meta.url,"ja-post",{slug:"",datos:null},(s,e,i)=>{const f=e.datos&&(!e.slug||e.datos.slug===e.slug)?e.datos:null;if(f)return Y(s,f,i);if(!e.slug||H.has(e.slug))return Q(s);F(s);const n=e.slug;W(n).then(g=>{!i.isConnected||i.props.slug!==n||(g||H.add(n),i.props={datos:g})})},void 0,["slug"]);J("ja-post",Z);
