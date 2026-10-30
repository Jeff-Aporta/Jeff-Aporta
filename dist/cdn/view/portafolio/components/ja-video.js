import{crearComponente as l,define as u,emitir as d,html as c}from"../../../js/base/componente.js?v=esixd4";const m=l(import.meta.url,"ja-video",{youtubeId:"",titulo:"Video",activo:!1},(a,e,i)=>{if(!e.youtubeId)return;if(e.activo){const t=`https://www.youtube-nocookie.com/embed/${e.youtubeId}?autoplay=1&rel=0&modestbranding=1`;a.append(c`<div class="marco" part="marco"><iframe src=${t} title=${e.titulo} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`);return}const n=()=>{i.props={activo:!0},d(i,"ja-video-play",{youtubeId:e.youtubeId})},s=`https://i.ytimg.com/vi/${e.youtubeId}/maxresdefault.jpg`,r=t=>{const o=t.currentTarget;o.src.includes("hqdefault")||(o.src=`https://i.ytimg.com/vi/${e.youtubeId}/hqdefault.jpg`)};a.append(c`
    <button class="marco fachada" part="marco" type="button" aria-label=${`Reproducir: ${e.titulo}`} onclick=${n}>
      <img src=${s} alt="" loading="lazy" decoding="async" onerror=${r}>
      <span class="velo" aria-hidden="true"></span>
      <span class="play" aria-hidden="true"><iswc-icon icon="mdi:play"></iswc-icon></span>
      <span class="leyenda"><iswc-icon icon="mdi:youtube"></iswc-icon>${e.titulo}</span>
    </button>
  `)});u("ja-video",m);
