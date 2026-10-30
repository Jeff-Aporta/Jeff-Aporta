/**
 * contenido.schemas.ts — forma del contenido del portafolio (perfil, experiencia, proyectos…).
 *
 * El contenido vive en `src/js/contenido/*.ts` (datos puros, separados de la UI). Todo pasa por
 * estos schemas: si un dato no cumple, falla el build y las pruebas, no la página publicada.
 */
import { z } from '../../base/zod.js';

/** Fecha `AAAA-MM` (mes completo) o `AAAA-MM-DD` (día exacto). */
export const FechaSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, 'fecha AAAA-MM o AAAA-MM-DD');
export type Fecha = z.infer<typeof FechaSchema>;

/** Ruta del sitio (relativa a la raíz publicada) o URL absoluta. */
export const RutaSchema = z.string().min(1);

/** Ícono del kit: `set:nombre` literal (lo barre `deno task icons`). */
export const IconoSchema = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, 'ícono set:nombre');

export const EnlaceSchema = z.object({ etiqueta: z.string().min(1), url: z.url(), icono: IconoSchema });
export type Enlace = z.infer<typeof EnlaceSchema>;

export const ImagenSchema = z.object({ src: RutaSchema, alt: z.string().min(1) });
export type Imagen = z.infer<typeof ImagenSchema>;

export const ModalidadSchema = z.enum(['Presencial', 'Remoto', 'Híbrido']);

export const PeriodoSchema = z.object({ desde: FechaSchema, hasta: FechaSchema.nullable(), contrato: z.string().min(1) });
export type Periodo = z.infer<typeof PeriodoSchema>;

/** Proyecto con término propio dentro de un empleo (p. ej. Fyxtoken dentro de COREMSA). `proyecto` enlaza a `proyectos[].id`. */
export const SubproyectoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nombre: z.string().min(1),
  logo: RutaSchema.optional(),
  proyecto: z.string().optional(),
  desde: FechaSchema,
  hasta: FechaSchema.nullable(),
  resumen: z.string().min(1),
  logros: z.array(z.string().min(1)).default([]),
  tecnologias: z.array(z.string().min(1)).default([]),
});
export type Subproyecto = z.infer<typeof SubproyectoSchema>;

/** `logo` (imagen) o `icono` (genérico del kit, cuando la empresa no tiene identidad propia); sin ninguno, iniciales. */
export const EmpleoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  empresa: z.string().min(1),
  sector: z.string().min(1),
  logo: RutaSchema.optional(),
  logoClaro: z.boolean().default(false),
  icono: IconoSchema.optional(),
  sitio: z.url().optional(),
  cargo: z.string().min(1),
  ubicacion: z.string().min(1),
  modalidad: ModalidadSchema,
  periodos: z.array(PeriodoSchema).min(1),
  resumen: z.string().min(1),
  logros: z.array(z.string().min(1)).min(1),
  tecnologias: z.array(z.string().min(1)).min(1),
  certificado: z.url().optional(),
  galeria: z.array(ImagenSchema).default([]),
  subproyectos: z.array(SubproyectoSchema).default([]),
});
export type Empleo = z.infer<typeof EmpleoSchema>;

export const EstudioSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  institucion: z.string().min(1),
  sigla: z.string().min(1),
  titulo: z.string().min(1),
  nivel: z.enum(['Técnico', 'Tecnólogo', 'Profesional']),
  lugar: z.string().min(1),
  /** Año de grado; si el estudio sigue en curso va `cursando` (semestre y periodo del certificado) en su lugar. */
  anio: z.number().int().min(2000).max(2100).optional(),
  cursando: z.string().min(1).optional(),
  nota: z.string().optional(),
  sitio: z.url().optional(),
  certificado: z.url().optional(),
  icono: IconoSchema,
}).refine((s) => (s.anio === undefined) !== (s.cursando === undefined), { message: 'Cada estudio lleva `anio` o `cursando`, uno de los dos.' });
export type Estudio = z.infer<typeof EstudioSchema>;

export const GrupoHabilidadesSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  icono: IconoSchema,
  descripcion: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});
export type GrupoHabilidades = z.infer<typeof GrupoHabilidadesSchema>;

export const ProyectoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  tipo: z.enum(['Producto', 'Open source', 'Educativo', 'Laboratorio']),
  categoria: z.string().min(1),
  descripcion: z.string().min(1),
  imagen: RutaSchema.optional(),
  logo: RutaSchema.optional(),
  demo: z.url().optional(),
  codigo: z.url().optional(),
  video: z.url().optional(),
  tecnologias: z.array(z.string().min(1)).min(1),
});
export type Proyecto = z.infer<typeof ProyectoSchema>;

export const ContactoSchema = z.object({
  email: z.email(),
  telefono: z.string().min(7),
  whatsapp: z.url(),
  github: z.url(),
  youtube: z.url(),
});

export const PerfilSchema = z.object({
  nombre: z.string().min(1),
  nombreCorto: z.string().min(1),
  iniciales: z.string().min(1).max(3),
  titular: z.string().min(1),
  roles: z.array(z.string().min(1)).min(1),
  ubicacion: z.string().min(1),
  bandera: IconoSchema,
  logo: RutaSchema,
  foto: ImagenSchema,
  propuesta: z.string().min(1),
  resumen: z.array(z.string().min(1)).min(1),
  pilares: z.array(z.object({ icono: IconoSchema, titulo: z.string().min(1), texto: z.string().min(1) })).min(1),
  video: z.object({ youtubeId: z.string().regex(/^[\w-]{11}$/), titulo: z.string().min(1), canal: z.url() }),
  cv: RutaSchema,
  cvTarjeta: z.object({ icono: RutaSchema, actualizado: z.string().min(1), paginas: z.number().int().positive() }),
  contacto: ContactoSchema,
});
export type Perfil = z.infer<typeof PerfilSchema>;

export const SeccionSchema = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), titulo: z.string().min(1), icono: IconoSchema });
export type Seccion = z.infer<typeof SeccionSchema>;

export const SitioSchema = z.object({
  url: z.url(),
  idioma: z.string().min(2),
  titulo: z.string().min(1),
  descripcion: z.string().min(50).max(170),
  palabrasClave: z.array(z.string().min(1)).min(3),
  imagenOg: ImagenSchema,
  colorTema: z.string().regex(/^#[0-9a-f]{6}$/i),
  verificacionGoogle: z.string().regex(/^[\w-]{20,}$/).optional(),
  secciones: z.array(SeccionSchema).min(1),
});
export type Sitio = z.infer<typeof SitioSchema>;

/** Bloque dentro de un paso de una publicación: markdown, código o nota. */
export const BloqueSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('md'), md: z.string().min(1) }),
  z.object({ tipo: z.literal('codigo'), lenguaje: z.enum(['javascript', 'typescript', 'html', 'css', 'json']), titulo: z.string().optional(), codigo: z.string().min(1) }),
  z.object({ tipo: z.literal('nota'), tono: z.enum(['info', 'success', 'warning']), titulo: z.string().min(1), md: z.string().min(1) }),
]);
export type Bloque = z.infer<typeof BloqueSchema>;

/** Demo interactiva que acompaña un paso de la guía (hoy solo la de luz, por paso 0–8). */
export const DemoGuiaSchema = z.object({ demo: z.literal('luz'), paso: z.number().int().min(0).max(8), leyenda: z.string().min(1) });
export type DemoGuia = z.infer<typeof DemoGuiaSchema>;

/** Paso de una publicación guiada: una tarjeta con su narración (voz clonada), bloques y demo opcional. */
export const PasoGuiaSchema = z.object({
  titulo: z.string().min(1),
  icono: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
  narracion: z.string().min(1),
  bloques: z.array(BloqueSchema).default([]),
  demo: DemoGuiaSchema.nullable().default(null),
});
export type PasoGuia = z.infer<typeof PasoGuiaSchema>;

/** Publicación del blog: una guía por pasos, narrada (todo quemado en `src/js/contenido/blog/`). */
export const PublicacionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  resumen: z.string().min(1),
  fecha: FechaSchema,
  etiquetas: z.array(z.string().min(1)).min(1),
  portada: ImagenSchema,
  creditos: z.string().optional(),
  pasos: z.array(PasoGuiaSchema).min(1),
});
export type Publicacion = z.infer<typeof PublicacionSchema>;

/** Pieza de una composición «complex»: imagen recortada o sombra elíptica, en coordenadas del lienzo. */
export const PiezaIlustracionSchema = z.union([
  z.object({
    src: z.string().regex(/^[\w.-]+\.(webp|png|svg)$/),
    w: z.number().positive(),
    h: z.number().positive(),
    x: z.number(),
    y: z.number(),
    escala: z.number().positive(),
    prof: z.number().min(0),
    giro: z.number().optional(),
    opacidad: z.number().min(0).max(1).optional(),
  }),
  z.object({ elipse: z.tuple([z.number(), z.number(), z.number(), z.number()]), prof: z.number().min(0) }),
]);
export type PiezaIlustracion = z.infer<typeof PiezaIlustracionSchema>;

/** Ilustración por piezas: lienzo (`ancho`×`alto`) y piezas en orden de pintado. */
export const ComposicionSchema = z.object({ titulo: z.string().min(1), ancho: z.number().positive(), alto: z.number().positive(), piezas: z.array(PiezaIlustracionSchema).min(1) });
export type Composicion = z.infer<typeof ComposicionSchema>;

export const ContenidoSchema = z.object({
  sitio: SitioSchema,
  perfil: PerfilSchema,
  experiencia: z.array(EmpleoSchema).min(1),
  educacion: z.array(EstudioSchema).min(1),
  habilidades: z.array(GrupoHabilidadesSchema).min(1),
  proyectos: z.array(ProyectoSchema).min(1),
  blog: z.array(PublicacionSchema),
  ilustraciones: z.record(z.string(), ComposicionSchema),
});
export type Contenido = z.infer<typeof ContenidoSchema>;

/**
 * Evento del gráfico de ramas de la trayectoria (derivado). `carril` 0 es el tronco; cada vinculación
 * es una rama que sale del tronco en su `inicio` y vuelve en su `fin` (contiguos: una fila `periodo`). `pasantes` son los carriles que
 * cruzan la fila de arriba abajo (ramas activas que no empiezan ni terminan ahí).
 */
export const EventoGrafoSchema = z.object({
  clave: z.string(),
  tipo: z.enum(['actual', 'inicio', 'fin', 'periodo', 'cambio', 'sub']),
  fecha: FechaSchema,
  desde: FechaSchema.nullable(),
  carril: z.number().int().nonnegative(),
  pasantes: z.array(z.number().int().positive()),
  empleoId: z.string().nullable(),
  /** En `sub`: id del subproyecto que empieza en esa fila (sobre la rama de su empresa). */
  sub: z.string().nullable(),
  periodo: z.number().int().nonnegative(),
  ultimo: z.boolean(),
});
export type EventoGrafo = z.infer<typeof EventoGrafoSchema>;

/** Uso acumulado de una tecnología (derivado: meses en empleos que la usaron). */
export const UsoTecnologiaSchema = z.object({ nombre: z.string(), meses: z.number().int().nonnegative() });
export type UsoTecnologia = z.infer<typeof UsoTecnologiaSchema>;
