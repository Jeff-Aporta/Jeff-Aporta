/**
 * trayectoria.ts — dominio del gráfico de ramas de la experiencia (sin DOM).
 */
import { contenido } from '../../../src/js/contenido/index.js';
import { grafoTrayectoria } from '../../../src/js/contenido/derivados.js';
import type { EventoGrafo } from '../../../src/js/consts/schemas/contenido.schemas.js';

/** Filas del gráfico, de la actualidad hacia atrás. */
export const eventos = (): EventoGrafo[] => grafoTrayectoria(contenido.experiencia);

/** Carriles que necesita el gráfico (tronco incluido). */
export const totalCarriles = (lista: EventoGrafo[] = eventos()): number => Math.max(0, ...lista.map((e) => e.carril), ...lista.flatMap((e) => e.pasantes)) + 1;
