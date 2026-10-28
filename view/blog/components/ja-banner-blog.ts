/**
 * <ja-banner-blog> — portada animada del blog en SVG: Jeffrey (el mismo avatar de sus videos) en su
 * escritorio, sonriendo, con una taza de café humeante en la mano; vuelan aviones de papel. Al fondo, un
 * muro de frases que sube despacio; a los lados, el título en papel recortado.
 *
 * El avatar se carga de `assets/img/avatar/jeffrey.svg` y queda en línea para animarlo con sus propias
 * piezas: la boca en `sonrisa`, el brazo derecho articulado (como la pose «pulgar» de los videos) con el
 * puño cerrado sosteniendo la taza, parpadeo con sus ojos cerrados y la cabeza que gira a los lados hacia
 * el cursor (sin cursor, va y viene despacio). Lo demás es CSS; todo se calma con `prefers-reduced-motion`.
 */
import { crearComponente, define, html, raw } from '../../../src/js/base/componente.js';
import { rutaSitio } from '../../../src/js/contenido/index.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const FRASES = [
  'Aprender en público es la mejor forma de enseñar.',
  'Cada guía nace de un problema real.',
  'El código se entiende mejor cuando alguien lo cuenta.',
  'Pequeños pasos y demos que puedes tocar.',
  'Construyo, explico y comparto lo que aprendo.',
  'Escribir código también es escribir para personas.',
];
const MURO = Array.from({ length: 14 }, () => FRASES.join(' ')).join(' ');

/** Recorte del avatar (coordenadas del SVG de los videos): de la coronilla al pecho, que tapa el escritorio. */
const RECORTE = { ancho: 880, alto: 906 };
const ESCALA = 0.3;
const PIVOTE = { x: 430, y: 640 };
/** Brazo derecho articulado: [giro del hombro, giro del codo, orientación de la mano] (motor de los videos). */
const BRAZO = { hombro: 12, codo: 100, mano: -10 };
const NS = 'http://www.w3.org/2000/svg';

/** Taza de café en coordenadas de la mano (origen en la muñeca, el puño ocupa ~±50 x, 0..-130 y). */
const TAZA = `
  <g class="taza" transform="scale(0.8)">
    <g class="vapor" fill="none" stroke="#9aa3b2" stroke-width="9" stroke-linecap="round">
      <path d="M-190 -250 q-22 -34 0 -68 t0 -68"/><path d="M-130 -258 q-22 -34 0 -68 t0 -68"/>
    </g>
    <path d="M-62 -175 h34 a46 46 0 0 1 0 92 h-34" fill="none" stroke="#c94a68" stroke-width="22"/>
    <rect x="-250" y="-215" width="196" height="190" rx="34" fill="#ff6b8b" stroke="#0B0B0B" stroke-width="6"/>
    <ellipse cx="-152" cy="-212" rx="96" ry="16" fill="#5b3a26" stroke="#0B0B0B" stroke-width="5"/>
    <ellipse cx="-205" cy="-160" rx="16" ry="30" fill="#fff" opacity=".4"/>
  </g>`;

/** Carga el avatar, lo pone en el hueco `.avatar`, lo posa y arranca su bucle (se detiene al salir del DOM). */
async function montarAvatar(root: ShadowRoot, host: HTMLElement) {
  const texto = await fetch(rutaSitio('assets/img/avatar/jeffrey.svg')).then((r) => r.text());
  const hueco = root.querySelector('.avatar');
  if (!hueco) return;
  const svg = new DOMParser().parseFromString(texto, 'image/svg+xml').documentElement;
  const avatar = document.importNode(svg, true) as unknown as SVGSVGElement;
  const medidas = { x: 600 - PIVOTE.x * ESCALA, y: 32, width: RECORTE.ancho * ESCALA, height: RECORTE.alto * ESCALA, viewBox: `0 0 ${RECORTE.ancho} ${RECORTE.alto}` };
  for (const [k, v] of Object.entries(medidas)) avatar.setAttribute(k, String(v));
  hueco.append(avatar);
  const $ = (id: string) => avatar.querySelector(`#${id}`) as SVGGElement | null;
  const cabeza = $('cabeza');
  if (!cabeza) return;

  // Sonrisa: la boca propia del dibujo.
  for (const b of avatar.querySelectorAll<SVGElement>('[data-boca]')) b.style.display = b.dataset.boca === 'sonrisa' ? '' : 'none';
  // Brazo derecho al pecho con el puño cerrado (mismo cálculo que el motor de los videos) y la taza en él.
  for (const parte of ['atras', 'delante']) {
    const g = $(`brazo-der-${parte}`);
    g?.setAttribute('transform', `rotate(${BRAZO.hombro} 786 738)`);
    if (g) g.style.display = '';
  }
  $('antebrazo-der')?.setAttribute('transform', `rotate(${BRAZO.codo} 790 960)`);
  const mano = $('mano-der');
  mano?.setAttribute('transform', `rotate(${BRAZO.mano - BRAZO.hombro - BRAZO.codo} 796 1160)`);
  for (const m of mano?.querySelectorAll<SVGElement>('[data-mano]') ?? []) m.style.display = m.dataset.mano === 'puno' ? '' : 'none';
  for (const r of avatar.querySelectorAll('.recorte-der')) r.setAttribute('clip-path', 'url(#torso-der)');
  const muneca = mano?.firstElementChild;
  if (muneca) {
    const taza = document.createElementNS(NS, 'g');
    taza.innerHTML = TAZA;
    muneca.prepend(...taza.childNodes);
  }

  const cerrados = [...avatar.querySelectorAll<SVGElement>('[data-ojo$="-cerrado"]')];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)');
  let cursor: { x: number; t: number } | null = null;
  const apuntar = (ev: PointerEvent) => (cursor = { x: ev.clientX, t: performance.now() });
  addEventListener('pointermove', apuntar, { passive: true });

  // Giro lateral suavizado (-1..1) y próximo parpadeo.
  let gx = 0;
  let parpadeo = performance.now() + 2500;
  const cuadro = (t: number) => {
    if (!host.isConnected) {
      removeEventListener('pointermove', apuntar);
      return;
    }
    let ox = 0;
    if (cursor && t - cursor.t < 4000) {
      const caja = avatar.getBoundingClientRect();
      const centro = caja.left + caja.width * (PIVOTE.x / RECORTE.ancho);
      ox = Math.max(-1, Math.min(1, (cursor.x - centro) / 420));
    } else if (!quieto.matches) {
      ox = Math.sin(t / 1000 * 0.5) * 0.6;
    }
    gx += (ox - gx) * 0.05;
    cabeza.setAttribute('transform', `rotate(${(gx * 4).toFixed(2)} ${PIVOTE.x} ${PIVOTE.y}) translate(${(gx * 8).toFixed(2)} 0)`);
    if (!quieto.matches && t > parpadeo) {
      const cerrado = t - parpadeo < 140;
      cerrados.forEach((c) => (c.style.display = cerrado ? '' : 'none'));
      if (!cerrado) parpadeo = t + 2600 + Math.random() * 3200;
    }
    requestAnimationFrame(cuadro);
  };
  requestAnimationFrame(cuadro);
}


/** Título en papel recortado: tres capas desplazadas (amarillo, marca y tinta). */
const papel = (x: number, y: number, tam: number, giro: number, texto: string) => `
  <g class="titulo" transform="rotate(${giro} ${x} ${y})" font-size="${tam}">
    <text x="${x + 7}" y="${y + 7}" class="capa amarilla">${texto}</text>
    <text x="${x + 3.5}" y="${y + 3.5}" class="capa marca">${texto}</text>
    <text x="${x}" y="${y}" class="capa tinta">${texto}</text>
  </g>`;

const SVG = `
<svg viewBox="0 0 1200 360" role="img" aria-label="Jeffrey sonriendo en su escritorio con una taza de café, entre aviones de papel">
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
  <g class="m derivar" style="fill:var(--iswc-color-brand)">${[0, 1, 2].flatMap((f) => [0, 1, 2].map((c) => `<circle cx="${790 + c * 14}" cy="${56 + f * 14}" r="3.5"/>`)).join('')}</g>
  <path class="m flotar" d="M1010 70 l18 32 h-36z" fill="#2ec4b6"/>

  ${papel(268, 205, 118, -6, 'Blog')}
  ${papel(842, 206, 86, 4, 'de Jeff')}
  <text class="lema" x="866" y="262" transform="rotate(4 866 262)">tutoriales · guías narradas · demos</text>

  <!-- escritorio -->
  <ellipse cx="600" cy="340" rx="250" ry="12" class="sombra"/>
  <rect x="380" y="300" width="440" height="24" rx="12" fill="#e9dcc6"/>
  <rect x="380" y="316" width="440" height="8" rx="4" fill="#d3c2a5"/>

  <!-- Jeffrey: el avatar de los videos (assets/img/avatar/jeffrey.svg), recortado a la altura del escritorio -->
  <g class="avatar"></g>

  <!-- aviones de papel -->
  ${[0, 1].map((k) => `
  <g class="avion" style="--k:${k}">
    <g>
      <path d="M-16 -2 L16 0 L-16 9 L-8 1 Z" fill="#ffffff" style="stroke:var(--iswc-color-brand)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-16 -2 L16 0 L-8 1 Z" style="fill:color-mix(in srgb, var(--iswc-color-brand) 22%, #fff)"/>
    </g>
    <animateMotion dur="7s" begin="-${k * 3.5}s" repeatCount="indefinite" rotate="auto"><mpath href="#vuelo"/></animateMotion>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.8;1" dur="7s" begin="-${k * 3.5}s" repeatCount="indefinite"/>
  </g>`).join('')}
</svg>`;

const JaBannerBlog = crearComponente<SinProps>(import.meta.url, 'ja-banner-blog', {}, (root, _props, host) => {
  root.append(html`
    <div class="muro" aria-hidden="true"><div class="rio"><p>${MURO}</p><p>${MURO}</p></div></div>
    <div class="escena">${raw(SVG)}</div>
  `);
  montarAvatar(root, host).catch(() => {});
});

define('ja-banner-blog', JaBannerBlog);
