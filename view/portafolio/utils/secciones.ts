/**
 * secciones.ts — orden y encabezado de cada sección del portafolio (sin DOM).
 * El texto del encabezado vive aquí; el contenido de cada sección sale de `src/js/contenido/`.
 */
import type { JaSeccionProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

export const SECCIONES: Array<{ id: string; tag: string; props: JaSeccionProps }> = [
  {
    id: 'perfil',
    tag: 'ja-perfil',
    props: { cejilla: 'Perfil', titulo: 'Sobre mí', entrada: 'Hago software para empresas, desde la idea hasta que la gente lo usa todos los días.', fondo: 'base', ilustracion: null },
  },
  {
    id: 'trayectoria',
    tag: 'ja-trayectoria',
    props: { cejilla: 'Trayectoria', titulo: 'Mi trayectoria', entrada: 'Dónde he trabajado, de lo más reciente a lo más antiguo. Las líneas paralelas son trabajos al mismo tiempo. En cada empresa están su sitio web, el certificado laboral y el detalle de lo que hice.', fondo: 'marca', ilustracion: 'trayectoria' },
  },
  {
    id: 'proyectos',
    tag: 'ja-proyectos',
    props: { cejilla: 'Proyectos', titulo: 'Lo que he construido', entrada: 'Aplicaciones publicadas y experimentos, con demo y código.', fondo: 'suave', ilustracion: 'proyectos' },
  },
  {
    id: 'habilidades',
    tag: 'ja-habilidades',
    props: { cejilla: 'Habilidades', titulo: 'Lo que manejo', entrada: 'Las tecnologías que manejo y cuánto tiempo las he usado en mis trabajos.', fondo: 'base', ilustracion: 'habilidades' },
  },
  {
    id: 'educacion',
    tag: 'ja-educacion',
    props: { cejilla: 'Formación', titulo: 'Estudios', entrada: 'Mi formación en sistemas, desarrollo móvil e ingeniería.', fondo: 'suave', ilustracion: null },
  },
  {
    id: 'contacto',
    tag: 'ja-contacto',
    props: { cejilla: 'Contacto', titulo: 'Hablemos', entrada: 'Escríbeme por una vacante, un proyecto o una asesoría.', fondo: 'marca', ilustracion: null },
  },
];
