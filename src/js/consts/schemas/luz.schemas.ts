/**
 * luz.schemas.ts — tipos de la geometría 2D de luz y sombra (post «Luz y sombra en 2D»).
 */
import { z } from '../../base/zod.js';

export const PuntoSchema = z.object({ x: z.number(), y: z.number() });
export type Punto = z.infer<typeof PuntoSchema>;

/** Segmento de pared: de `a` a `b`. Un rayo usa la misma forma: origen `a`, hacia `b`. */
export const SegmentoSchema = z.object({ a: PuntoSchema, b: PuntoSchema });
export type Segmento = z.infer<typeof SegmentoSchema>;

/** Punto de choque de un rayo: posición, distancia paramétrica `t` y ángulo del rayo. */
export const ChoqueSchema = z.object({ x: z.number(), y: z.number(), t: z.number(), angulo: z.number() });
export type Choque = z.infer<typeof ChoqueSchema>;
