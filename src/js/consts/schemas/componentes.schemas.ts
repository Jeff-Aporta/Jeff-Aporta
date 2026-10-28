/**
 * componentes.schemas.ts — forma de las `props` de cada componente y tipos auxiliares de la base.
 *
 * Regla: los tipos salen de `z.infer<>`; no hay `type`/`interface` sueltos fuera de `*.schemas.ts`.
 * Datos que vienen de fuera (API, URL, almacenamiento) se PARSEAN con su schema (`safeParse`),
 * nunca se castean con `as`.
 */
import { z } from '../../base/zod.js';
import { BloqueSchema } from './contenido.schemas.js';
import { EventoGrafoSchema } from './contenido.schemas.js';

/** `<ja-app>`: el shell. `seccion` es la sección visible (la marca la navegación). */
export const JaAppPropsSchema = z.object({ seccion: z.string().default('inicio') });
export type JaAppProps = z.infer<typeof JaAppPropsSchema>;

/** Nombre de una ilustración: SVG de `assets/ilustraciones/` o composición de `contenido.ilustraciones`. */
export const IlustracionSchema = z.string().regex(/^[a-z0-9-]+$/);
export type Ilustracion = z.infer<typeof IlustracionSchema>;

/** `<ja-ilustracion>`: una ilustración por nombre. */
export const JaIlustracionPropsSchema = z.object({ nombre: IlustracionSchema.default('hero'), alt: z.string().default('') });
export type JaIlustracionProps = z.infer<typeof JaIlustracionPropsSchema>;

/** Fondo de una sección: alterna para separar bloques sin líneas. */
export const FondoSeccionSchema = z.enum(['base', 'suave', 'marca']);

/** `<ja-seccion>`: encabezado común (cejilla, título, entrada) y el contenido en el slot. */
export const JaSeccionPropsSchema = z.object({
  cejilla: z.string().default(''),
  titulo: z.string().default(''),
  entrada: z.string().default(''),
  fondo: FondoSeccionSchema.default('base'),
  ilustracion: IlustracionSchema.nullable().default(null),
});
export type JaSeccionProps = z.infer<typeof JaSeccionPropsSchema>;

/** `<ja-video>`: video de YouTube con fachada ligera (solo carga el reproductor al pulsar). */
export const JaVideoPropsSchema = z.object({ youtubeId: z.string().default(''), titulo: z.string().default('Video'), activo: z.boolean().default(false) });
export type JaVideoProps = z.infer<typeof JaVideoPropsSchema>;

/** `<ja-hito>`: una fila del gráfico de ramas (evento + número de carriles del gráfico). */
export const JaHitoPropsSchema = z.object({ evento: EventoGrafoSchema.nullable().default(null), carriles: z.number().int().positive().default(1), acciones: z.boolean().default(false) });
export type JaHitoProps = z.infer<typeof JaHitoPropsSchema>;

/** `<ja-empleo>`: tarjeta de un empleo, por id. `abierto` muestra logros y periodos. */
export const JaEmpleoPropsSchema = z.object({ id: z.string().default(''), abierto: z.boolean().default(false) });
export type JaEmpleoProps = z.infer<typeof JaEmpleoPropsSchema>;

/** `<ja-proyectos>`: catálogo con pestañas por tipo. */
export const FiltroProyectosSchema = z.enum(['Producto', 'Open source', 'Educativo', 'Laboratorio']);
export const JaProyectosPropsSchema = z.object({ tipo: FiltroProyectosSchema.default('Producto') });
export type JaProyectosProps = z.infer<typeof JaProyectosPropsSchema>;

/** `<ja-proyecto>`: tarjeta de un proyecto, por id. */
export const JaProyectoPropsSchema = z.object({ id: z.string().default('') });
export type JaProyectoProps = z.infer<typeof JaProyectoPropsSchema>;

/** Tono de color de las piezas decorativas e íconos (siempre tokens del kit). */
export const TonoSchema = z.enum(['marca', 'acento', 'exito', 'peligro', 'lila']);
export type Tono = z.infer<typeof TonoSchema>;

/** `<ja-marca>`: logo con avatar + nombre. `compacta` oculta el subtítulo. */
export const JaMarcaPropsSchema = z.object({ subtitulo: z.string().default('Full Stack Developer'), compacta: z.boolean().default(false) });
export type JaMarcaProps = z.infer<typeof JaMarcaPropsSchema>;

/** `<ja-forma>`: figura memphis decorativa con animación en loop. */
export const JaFormaPropsSchema = z.object({
  tipo: z.enum(['circulo', 'anillo', 'semicirculo', 'triangulo', 'cruz', 'onda', 'zigzag', 'puntos']).default('circulo'),
  tono: TonoSchema.default('marca'),
  tam: z.number().positive().default(3),
  animacion: z.enum(['girar', 'flotar', 'latir', 'derivar', 'ninguna']).default('flotar'),
  retraso: z.number().default(0),
});
export type JaFormaProps = z.infer<typeof JaFormaPropsSchema>;

/** `<ja-insignia>`: ícono + título + subtítulo en una pastilla flotante. */
export const JaInsigniaPropsSchema = z.object({ icono: z.string().default('mdi:star-outline'), titulo: z.string().default(''), subtitulo: z.string().default(''), flotar: z.boolean().default(true) });
export type JaInsigniaProps = z.infer<typeof JaInsigniaPropsSchema>;

/** `<ja-rasgo>`: tarjeta de rasgo (ícono, título, texto) con slot para extras (etiquetas). */
export const JaRasgoPropsSchema = z.object({ icono: z.string().default('mdi:star-outline'), titulo: z.string().default(''), texto: z.string().default(''), tono: TonoSchema.default('marca') });
export type JaRasgoProps = z.infer<typeof JaRasgoPropsSchema>;

/** `<ja-lista>`: lista con ícono por ítem, en línea o en columna. */
export const JaListaPropsSchema = z.object({ items: z.array(z.string()).default([]), icono: z.string().default('mdi:check-circle'), tono: TonoSchema.default('exito'), variante: z.enum(['linea', 'columna']).default('columna') });
export type JaListaProps = z.infer<typeof JaListaPropsSchema>;

/** `<ja-barra-uso>`: fila de uso acumulado de una tecnología. */
export const JaBarraUsoPropsSchema = z.object({ nombre: z.string().default(''), meses: z.number().int().nonnegative().default(0), maximo: z.number().int().positive().default(1) });
export type JaBarraUsoProps = z.infer<typeof JaBarraUsoPropsSchema>;

/** `<ja-estudio>`: tarjeta de un estudio, por id. */
export const JaEstudioPropsSchema = z.object({ id: z.string().default('') });
export type JaEstudioProps = z.infer<typeof JaEstudioPropsSchema>;

/** `<ja-canal>`: canal de contacto (enlace con ícono y, opcional, botón de copiar). */
export const JaCanalPropsSchema = z.object({ icono: z.string().default('mdi:link'), titulo: z.string().default(''), valor: z.string().default(''), url: z.string().default(''), copiar: z.string().default('') });
export type JaCanalProps = z.infer<typeof JaCanalPropsSchema>;

/** `<ja-luz-demo>`: demo interactiva de luz y sombra 2D, por paso (0 a 8). */
export const JaLuzDemoPropsSchema = z.object({ paso: z.number().int().min(0).max(8).default(0) });
export type JaLuzDemoProps = z.infer<typeof JaLuzDemoPropsSchema>;

/** `<ja-post>` y `<ja-post-tarjeta>`: una publicación del blog por slug. */
export const JaPostPropsSchema = z.object({ slug: z.string().default('') });
export type JaPostProps = z.infer<typeof JaPostPropsSchema>;

/** `<ja-bloque>`: un bloque (markdown, código o nota) dentro de un paso de una publicación. */
export const JaBloquePropsSchema = z.object({ bloque: BloqueSchema.nullable().default(null) });
export type JaBloqueProps = z.infer<typeof JaBloquePropsSchema>;

/** `<ja-paso>`: la tarjeta de un paso de una publicación guiada (slug + índice del paso). */
export const JaPasoPropsSchema = z.object({ slug: z.string().default(''), indice: z.number().int().min(0).default(0) });
export type JaPasoProps = z.infer<typeof JaPasoPropsSchema>;

/** `<ja-boton-icono>`: botón redondo solo con ícono (la etiqueta va al lector de pantalla y al tooltip). */
export const JaBotonIconoPropsSchema = z.object({
  icono: z.string().default('mdi:circle-outline'),
  etiqueta: z.string().default(''),
  href: z.string().default(''),
  tono: z.enum(['papel', 'marca', 'acento']).default('papel'),
  tam: z.enum(['md', 'lg']).default('md'),
  activo: z.boolean().default(false),
  deshabilitado: z.boolean().default(false),
});
export type JaBotonIconoProps = z.infer<typeof JaBotonIconoPropsSchema>;

/** Ruta de la SPA (hash): portafolio con sección opcional, lista del blog o una publicación. */
export const RutaSpaSchema = z.discriminatedUnion('vista', [
  z.object({ vista: z.literal('portafolio'), seccion: z.string() }),
  z.object({ vista: z.literal('blog') }),
  z.object({ vista: z.literal('post'), slug: z.string() }),
]);
export type RutaSpa = z.infer<typeof RutaSpaSchema>;

/** Componentes sin props (leen el contenido central). */
export const SinPropsSchema = z.object({});
export type SinProps = z.infer<typeof SinPropsSchema>;

/** Base (`componente.ts`): atributos e hijos del helper `el()`. */
export type Atributos = Record<string, unknown>;
export type Hijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
