/**
 * <ja-luz-demo> — demo interactiva del post «Luz y sombra en 2D», por paso (0 a 8).
 *
 * Mueve el cursor o el dedo sobre el lienzo; sin interacción, la luz recorre la escena sola. Solo
 * anima mientras está visible. Los colores salen de los tokens del kit (cambian con el tema).
 *
 *   0 escena · 1 un rayo · 2 cincuenta rayos · 3 polígono con cincuenta rayos · 4 rayos a cada vértice
 *   5 polígono de visión · 6 sombras suaves · 7 con imágenes · 8 dos luces
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { rutaSitio } from '../../../src/js/contenido/index.js';
import type { JaLuzDemoProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { Choque, Punto } from '../../../src/js/consts/schemas/luz.schemas.js';
import { ALTO, ANCHO, ESCENA, masCercano, origenesDifusos, poligonoVision, rayosUniformes } from '../utils/luz.js';

type Colores = { pared: string; rayo: string; luz: string; texto: string };

const frente = new Image();
frente.src = rutaSitio('assets/blog/luz-y-sombra/frente.png');

function colores(host: HTMLElement): Colores {
  const c = getComputedStyle(host);
  const v = (n: string, d: string) => c.getPropertyValue(n).trim() || d;
  return { pared: v('--iswc-text-dim', '#64748b'), rayo: v('--iswc-color-danger', '#e5484d'), luz: v('--iswc-color-brand', '#2563eb'), texto: v('--iswc-text', '#0f172a') };
}

function rellenar(ctx: CanvasRenderingContext2D, puntos: Choque[], color: string, alfa = 1): void {
  if (puntos.length < 3) return;
  ctx.globalAlpha = alfa;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(puntos[0]!.x, puntos[0]!.y);
  for (const p of puntos.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function paredes(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  for (const s of ESCENA) {
    ctx.beginPath();
    ctx.moveTo(s.a.x, s.a.y);
    ctx.lineTo(s.b.x, s.b.y);
    ctx.stroke();
  }
}

function punto(ctx: CanvasRenderingContext2D, p: Punto, color: string, r = 4): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rayos(ctx: CanvasRenderingContext2D, desde: Punto, choques: Choque[], color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (const c of choques) {
    ctx.beginPath();
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
    punto(ctx, c, color, 3);
  }
}

/** Luces suaves: el polígono central opaco y los de alrededor translúcidos (pasos 6 a 8). */
function luzSuave(ctx: CanvasRenderingContext2D, centro: Punto): void {
  const [principal, ...difusos] = origenesDifusos(centro);
  for (const o of difusos) rellenar(ctx, poligonoVision(o), '#fff', 0.2);
  rellenar(ctx, poligonoVision(principal!), '#fff');
}

function dibujar(ctx: CanvasRenderingContext2D, paso: number, m: Punto, col: Colores): void {
  ctx.clearRect(0, 0, ANCHO, ALTO);
  if (paso >= 6) {
    const luces = paso === 8 ? [{ x: 20, y: m.y }, { x: 820, y: ALTO - m.y }] : [m];
    for (const l of luces) luzSuave(ctx, l);
    if (paso >= 7 && frente.complete) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(frente, 0, 0, ANCHO, ALTO);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (paso === 6) paredes(ctx, 'rgba(255,255,255,0.35)');
    for (const l of luces) punto(ctx, l, '#fff', 3);
    return;
  }
  paredes(ctx, col.pared);
  if (paso === 1) {
    const centro = { x: 320, y: 180 };
    const c = masCercano({ a: centro, b: m });
    if (c) rayos(ctx, centro, [c], col.rayo);
    punto(ctx, centro, col.texto, 3);
  }
  if (paso === 2) rayos(ctx, m, rayosUniformes(m), col.rayo);
  if (paso === 3) {
    const lista = rayosUniformes(m);
    rellenar(ctx, lista, col.rayo, 0.3);
    rayos(ctx, m, lista, col.rayo);
  }
  if (paso === 4) rayos(ctx, m, poligonoVision(m), col.rayo);
  if (paso === 5) {
    const lista = poligonoVision(m);
    rellenar(ctx, lista, col.luz, 0.3);
    rayos(ctx, m, lista, col.rayo);
  }
  punto(ctx, m, col.rayo, 5);
}

const JaLuzDemo = crearComponente<JaLuzDemoProps>(import.meta.url, 'ja-luz-demo', { paso: 0 }, (root, props, host) => {
  host.dataset.paso = String(props.paso);
  root.append(html`
    <div class="marco" part="marco" style=${props.paso >= 7 ? `background-image:url("${rutaSitio('assets/blog/luz-y-sombra/fondo.png')}")` : ''}>
      <canvas width=${String(ANCHO)} height=${String(ALTO)} aria-label=${`Demo interactiva, paso ${props.paso}: mueve el cursor sobre la escena`} role="img"></canvas>
    </div>
    <p class="ayuda" part="ayuda"><iswc-icon icon="mdi:cursor-default-click-outline"></iswc-icon>Mueve el cursor o el dedo sobre la escena</p>
  `);
  const canvas = root.querySelector('canvas')!;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let manual: Punto | null = null;
  let visible = false;
  let t0 = performance.now();
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const automatico = (t: number): Punto => ({ x: ANCHO / 2 + Math.cos(t / 2600) * 300, y: ALTO / 2 + Math.sin(t / 1900) * 120 });
  const mover = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    manual = { x: ((ev.clientX - r.left) / r.width) * ANCHO, y: ((ev.clientY - r.top) / r.height) * ALTO };
  };
  canvas.addEventListener('pointermove', mover);
  canvas.addEventListener('pointerdown', mover);
  canvas.addEventListener('pointerleave', () => {
    manual = null;
    t0 = performance.now();
  });
  const cuadro = (t: number) => {
    if (!host.isConnected || !visible) return;
    dibujar(ctx, props.paso, manual ?? (reducido ? { x: 420, y: 180 } : automatico(t - t0)), colores(host));
    requestAnimationFrame(cuadro);
  };
  new IntersectionObserver((entradas) => {
    const antes = visible;
    visible = entradas.some((e) => e.isIntersecting);
    if (visible && !antes) requestAnimationFrame(cuadro);
  }).observe(canvas);
  frente.addEventListener('load', () => dibujar(ctx, props.paso, manual ?? automatico(0), colores(host)), { once: true });
});

define('ja-luz-demo', JaLuzDemo);
