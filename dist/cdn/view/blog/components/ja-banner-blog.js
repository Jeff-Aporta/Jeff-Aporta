import{crearComponente as j,define as q,html as B,raw as G}from"../../../js/base/componente.js?v=evs5g9";import{rutaSitio as C}from"../../../js/contenido/index.js?v=yi9vmp";const z=["Aprender en p\xFAblico es la mejor forma de ense\xF1ar.","Cada gu\xEDa nace de un problema real.","El c\xF3digo se entiende mejor cuando alguien lo cuenta.","Peque\xF1os pasos y demos que puedes tocar.","Construyo, explico y comparto lo que aprendo.","Escribir c\xF3digo tambi\xE9n es escribir para personas."],k=Array.from({length:14},()=>z.join(" ")).join(" "),c={ancho:880,alto:906},y=.3,u={x:430,y:640},l={hombro:12,codo:100,mano:-10},L="http://www.w3.org/2000/svg",V=`
  <g class="taza" transform="scale(0.8)">
    <g class="vapor" fill="none" stroke="#9aa3b2" stroke-width="9" stroke-linecap="round">
      <path d="M-190 -250 q-22 -34 0 -68 t0 -68"/><path d="M-130 -258 q-22 -34 0 -68 t0 -68"/>
    </g>
    <path d="M-62 -175 h34 a46 46 0 0 1 0 92 h-34" fill="none" stroke="#c94a68" stroke-width="22"/>
    <rect x="-250" y="-215" width="196" height="190" rx="34" fill="#ff6b8b" stroke="#0B0B0B" stroke-width="6"/>
    <ellipse cx="-152" cy="-212" rx="96" ry="16" fill="#5b3a26" stroke="#0B0B0B" stroke-width="5"/>
    <ellipse cx="-205" cy="-160" rx="16" ry="30" fill="#fff" opacity=".4"/>
  </g>`;async function R(t,o){const s=await fetch(C("assets/img/avatar/jeffrey.svg")).then(e=>e.text()),d=t.querySelector(".avatar");if(!d)return;const n=new DOMParser().parseFromString(s,"image/svg+xml").documentElement,r=document.importNode(n,!0),A={x:600-u.x*y,y:32,width:c.ancho*y,height:c.alto*y,viewBox:`0 0 ${c.ancho} ${c.alto}`};for(const[e,a]of Object.entries(A))r.setAttribute(e,String(a));d.append(r);const m=e=>r.querySelector(`#${e}`),v=m("cabeza");if(!v)return;for(const e of r.querySelectorAll("[data-boca]"))e.style.display=e.dataset.boca==="sonrisa"?"":"none";for(const e of["atras","delante"]){const a=m(`brazo-der-${e}`);a?.setAttribute("transform",`rotate(${l.hombro} 786 738)`),a&&(a.style.display="")}m("antebrazo-der")?.setAttribute("transform",`rotate(${l.codo} 790 960)`);const h=m("mano-der");h?.setAttribute("transform",`rotate(${l.mano-l.hombro-l.codo} 796 1160)`);for(const e of h?.querySelectorAll("[data-mano]")??[])e.style.display=e.dataset.mano==="puno"?"":"none";for(const e of r.querySelectorAll(".recorte-der"))e.setAttribute("clip-path","url(#torso-der)");const x=h?.firstElementChild;if(x){const e=document.createElementNS(L,"g");e.innerHTML=V,x.prepend(...e.childNodes)}const E=[...r.querySelectorAll('[data-ojo$="-cerrado"]')],$=matchMedia("(prefers-reduced-motion: reduce)");let f=null;const w=e=>f={x:e.clientX,t:performance.now()};addEventListener("pointermove",w,{passive:!0});let p=0,b=performance.now()+2500;const S=e=>{if(!o.isConnected){removeEventListener("pointermove",w);return}let a=0;if(f&&e-f.t<4e3){const i=r.getBoundingClientRect(),g=i.left+i.width*(u.x/c.ancho);a=Math.max(-1,Math.min(1,(f.x-g)/420))}else $.matches||(a=Math.sin(e/1e3*.5)*.6);if(p+=(a-p)*.05,v.setAttribute("transform",`rotate(${(p*4).toFixed(2)} ${u.x} ${u.y}) translate(${(p*8).toFixed(2)} 0)`),!$.matches&&e>b){const i=e-b<140;E.forEach(g=>g.style.display=i?"":"none"),i||(b=e+2600+Math.random()*3200)}requestAnimationFrame(S)};requestAnimationFrame(S)}const M=(t,o,s,d,n)=>`
  <g class="titulo" transform="rotate(${d} ${t} ${o})" font-size="${s}">
    <text x="${t+7}" y="${o+7}" class="capa amarilla">${n}</text>
    <text x="${t+3.5}" y="${o+3.5}" class="capa marca">${n}</text>
    <text x="${t}" y="${o}" class="capa tinta">${n}</text>
  </g>`,F=`
<svg viewBox="0 0 1200 360" role="img" aria-label="Jeffrey sonriendo en su escritorio con una taza de caf\xE9, entre aviones de papel">
  <defs>
    <radialGradient id="piel" cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color="#dba57e"/><stop offset="1" stop-color="#b47852"/>
    </radialGradient>
    <radialGradient id="blazer" cx="0.4" cy="0.2" r="0.9">
      <stop offset="0" stop-color="#3a3d46"/><stop offset="1" stop-color="#1d1f25"/>
    </radialGradient>
    <path id="vuelo" d="M650 236 C 740 200, 760 120, 860 110 S 1040 120, 1180 30"/>
  </defs>

  <!-- formas memphis -->
  <circle class="m flotar" cx="118" cy="78" r="18" fill="#ffcf4a"/>
  <circle class="m girar" cx="1086" cy="292" r="22" fill="none" style="stroke:var(--iswc-color-brand)" stroke-width="8"/>
  <path class="m derivar" d="M318 312 l16 -20 16 20 16 -20 16 20" fill="none" stroke="#ff6b8b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="m girar" d="M430 58v30M415 73h30" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round"/>
  <g class="m derivar" style="fill:var(--iswc-color-brand)">${[0,1,2].flatMap(t=>[0,1,2].map(o=>`<circle cx="${790+o*14}" cy="${56+t*14}" r="3.5"/>`)).join("")}</g>
  <path class="m flotar" d="M1010 70 l18 32 h-36z" fill="#2ec4b6"/>

  ${M(268,205,118,-6,"Blog")}
  ${M(842,206,86,4,"de Jeff")}
  <text class="lema" x="866" y="262" transform="rotate(4 866 262)">tutoriales \xB7 gu\xEDas narradas \xB7 demos</text>

  <!-- escritorio -->
  <ellipse cx="600" cy="340" rx="250" ry="12" class="sombra"/>
  <rect x="380" y="300" width="440" height="24" rx="12" fill="#e9dcc6"/>
  <rect x="380" y="316" width="440" height="8" rx="4" fill="#d3c2a5"/>

  <!-- Jeffrey: el avatar de los videos (assets/img/avatar/jeffrey.svg), recortado a la altura del escritorio -->
  <g class="avatar"></g>

  <!-- aviones de papel -->
  ${[0,1].map(t=>`
  <g class="avion" style="--k:${t}">
    <g>
      <path d="M-16 -2 L16 0 L-16 9 L-8 1 Z" fill="#ffffff" style="stroke:var(--iswc-color-brand)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-16 -2 L16 0 L-8 1 Z" style="fill:color-mix(in srgb, var(--iswc-color-brand) 22%, #fff)"/>
    </g>
    <animateMotion dur="7s" begin="-${t*3.5}s" repeatCount="indefinite" rotate="auto"><mpath href="#vuelo"/></animateMotion>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.8;1" dur="7s" begin="-${t*3.5}s" repeatCount="indefinite"/>
  </g>`).join("")}
</svg>`,O=j(import.meta.url,"ja-banner-blog",{},(t,o,s)=>{t.append(B`
    <div class="muro" aria-hidden="true"><div class="rio"><p>${k}</p><p>${k}</p></div></div>
    <div class="escena">${G(F)}</div>
  `),R(t,s).catch(()=>{})});q("ja-banner-blog",O);
