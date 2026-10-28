/**
 * contenido/index.ts — ÚNICA puerta al contenido del portafolio.
 *
 * Reúne los archivos de datos y los valida con `ContenidoSchema`: la UI nunca lee los datos crudos.
 * Para cambiar la página se edita el archivo de datos (perfil, experiencia, proyectos…), no un componente.
 */
import { ContenidoSchema } from '../consts/schemas/contenido.schemas.js';
import { educacion } from './educacion.js';
import { experiencia } from './experiencia.js';
import { habilidades } from './habilidades.js';
import { perfil } from './perfil.js';
import { proyectos } from './proyectos.js';
import { sitio } from './sitio.js';
import { blog } from './blog/index.js';
import { ilustraciones } from './ilustraciones.js';

export const contenido = ContenidoSchema.parse({ sitio, perfil, experiencia, educacion, habilidades, proyectos, blog, ilustraciones });

/** Ruta del sitio (`assets/…`) → URL absoluta, sin importar desde qué página o módulo se pinte. */
export function rutaSitio(ruta: string): string {
  if (/^https?:\/\//.test(ruta)) return ruta;
  const aqui = import.meta.url;
  const raiz = aqui.includes('/js/contenido/') ? new URL('../../../../', aqui) : new URL('../../', aqui);
  return new URL(ruta, raiz).href;
}
