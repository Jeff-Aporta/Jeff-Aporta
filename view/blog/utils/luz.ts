/**
 * luz.ts — geometría de visibilidad 2D (sin DOM): intersección rayo-segmento y polígono de visión.
 *
 * Es el mismo algoritmo que explica el post «Luz y sombra en 2D», paso a paso:
 *   1. Un rayo es `origen + dirección · t` (t ≥ 0); un segmento es `a + (b − a) · u` (0 ≤ u ≤ 1).
 *   2. Se resuelve el sistema para `t` y `u`; si ambos están en rango, hay choque.
 *   3. Se lanzan rayos hacia cada vértice (y un poquito a cada lado) y se guarda el choque más cercano.
 *   4. Los choques ordenados por ángulo forman el polígono de lo que la luz alcanza.
 */
import type { Choque, Punto, Segmento } from '../../../src/js/consts/schemas/luz.schemas.js';

/** Ancho y alto del escenario de las demos (el mismo de las imágenes de fondo y frente). */
export const ANCHO = 840;
export const ALTO = 360;

const caja = (x: number, y: number, w: number, h: number): Segmento[] => poligono([{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }]);

/** Polígono cerrado → sus segmentos. */
export function poligono(vertices: Punto[]): Segmento[] {
  return vertices.map((a, i) => ({ a, b: vertices[(i + 1) % vertices.length]! }));
}

/** Escena de las demos: el borde y seis obstáculos (coinciden con la imagen de frente). */
export const ESCENA: Segmento[] = [
  ...caja(0, 0, ANCHO, ALTO),
  ...poligono([{ x: 100, y: 150 }, { x: 120, y: 50 }, { x: 200, y: 80 }, { x: 140, y: 210 }]),
  ...poligono([{ x: 100, y: 200 }, { x: 120, y: 250 }, { x: 60, y: 300 }]),
  ...poligono([{ x: 200, y: 260 }, { x: 220, y: 150 }, { x: 300, y: 200 }, { x: 350, y: 320 }]),
  ...poligono([{ x: 540, y: 60 }, { x: 560, y: 40 }, { x: 570, y: 70 }]),
  ...poligono([{ x: 650, y: 190 }, { x: 760, y: 170 }, { x: 740, y: 270 }, { x: 630, y: 290 }]),
  ...poligono([{ x: 600, y: 95 }, { x: 780, y: 50 }, { x: 680, y: 150 }]),
];

/**
 * Choque de un rayo con un segmento, o `null`. Usa el producto cruz: `t` es la distancia a lo largo
 * del rayo y `u` la posición sobre el segmento (0 en `a`, 1 en `b`).
 */
export function interseccion(rayo: Segmento, seg: Segmento): Choque | null {
  const rdx = rayo.b.x - rayo.a.x;
  const rdy = rayo.b.y - rayo.a.y;
  const sdx = seg.b.x - seg.a.x;
  const sdy = seg.b.y - seg.a.y;
  const den = rdx * sdy - rdy * sdx;
  if (Math.abs(den) < 1e-12) return null; // paralelos: nunca se cruzan
  const qx = seg.a.x - rayo.a.x;
  const qy = seg.a.y - rayo.a.y;
  const t = (qx * sdy - qy * sdx) / den;
  const u = (qx * rdy - qy * rdx) / den;
  if (t < 0 || u < 0 || u > 1) return null;
  return { x: rayo.a.x + rdx * t, y: rayo.a.y + rdy * t, t, angulo: Math.atan2(rdy, rdx) };
}

/** Choque más cercano de un rayo contra todos los segmentos. */
export function masCercano(rayo: Segmento, segmentos: Segmento[] = ESCENA): Choque | null {
  let mejor: Choque | null = null;
  for (const s of segmentos) {
    const c = interseccion(rayo, s);
    if (c && (!mejor || c.t < mejor.t)) mejor = c;
  }
  return mejor;
}

/** Rayo desde `origen` con un ángulo dado (dirección unitaria). */
export const rayoAngulo = (origen: Punto, angulo: number): Segmento => ({ a: origen, b: { x: origen.x + Math.cos(angulo), y: origen.y + Math.sin(angulo) } });

/** Choques de `n` rayos repartidos uniformemente alrededor de `origen` (paso 2 y 3: el enfoque ingenuo). */
export function rayosUniformes(origen: Punto, n = 50, segmentos: Segmento[] = ESCENA): Choque[] {
  const lista: Choque[] = [];
  for (let k = 0; k < n; k++) {
    const c = masCercano(rayoAngulo(origen, (k / n) * Math.PI * 2), segmentos);
    if (c) lista.push(c);
  }
  return lista;
}

/** Vértices únicos de la escena. */
export function vertices(segmentos: Segmento[] = ESCENA): Punto[] {
  const vistos = new Map<string, Punto>();
  for (const s of segmentos) for (const p of [s.a, s.b]) vistos.set(`${p.x},${p.y}`, p);
  return [...vistos.values()];
}

/** Desvío angular para mirar «un poquito» a cada lado de un vértice. */
export const DESVIO = 0.00001;

/**
 * Polígono de visión desde `origen` (pasos 4 y 5): por cada vértice se lanzan tres rayos (justo al
 * vértice y desviados ±DESVIO) y los choques se ordenan por ángulo.
 */
export function poligonoVision(origen: Punto, segmentos: Segmento[] = ESCENA): Choque[] {
  const angulos = vertices(segmentos).flatMap((p) => {
    const a = Math.atan2(p.y - origen.y, p.x - origen.x);
    return [a - DESVIO, a, a + DESVIO];
  });
  const choques: Choque[] = [];
  for (const a of angulos) {
    const c = masCercano(rayoAngulo(origen, a), segmentos);
    if (c) choques.push({ ...c, angulo: a });
  }
  return choques.sort((p, q) => p.angulo - q.angulo);
}

/** Orígenes de una luz «difusa» (paso 6): el centro y `n` puntos en un círculo de radio `radio`. */
export function origenesDifusos(centro: Punto, radio = 10, n = 10): Punto[] {
  return [centro, ...Array.from({ length: n }, (_, k) => ({ x: centro.x + Math.cos((k / n) * Math.PI * 2) * radio, y: centro.y + Math.sin((k / n) * Math.PI * 2) * radio }))];
}
