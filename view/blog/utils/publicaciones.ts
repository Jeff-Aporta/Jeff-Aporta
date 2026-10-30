/**
 * publicaciones.ts — datos mínimos de una publicación desde `blog/<slug>/post.json` (lo escribe el build
 * desde `src/js/contenido/blog/`), validados con `PublicacionSchema`; una sola descarga por slug. También
 * la URL limpia y pública de una publicación, la que se comparte.
 */
import { PublicacionSchema } from '../../../src/js/consts/schemas/contenido.schemas.js';
import type { Publicacion } from '../../../src/js/consts/schemas/contenido.schemas.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';

declare const __APP_BUILD__: string | undefined;

const CARGAS = new Map<string, Promise<Publicacion | null>>();

/** Sello del build (`?v=`): cada build publica JSON nuevos y la caché del navegador no sirve uno viejo. */
const version = (): string => (typeof __APP_BUILD__ === 'string' ? __APP_BUILD__.replace(/\D/g, '') : '');

/** URL del JSON de una publicación, relativa a la raíz del sitio. */
export function urlDatos(slug: string): string {
  const v = version();
  return rutaSitio(`blog/${slug}/post.json${v ? `?v=${v}` : ''}`);
}

/** URL limpia y pública de una publicación (la que se comparte e indexa). */
export const urlPublica = (slug: string): string => `${contenido.sitio.url}blog/${slug}/`;

/** Descarga y valida `post.json`; `null` si no existe o no cumple el schema (se avisa por consola). */
export function cargarPublicacion(slug: string): Promise<Publicacion | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.resolve(null);
  if (!CARGAS.has(slug)) {
    CARGAS.set(slug, fetch(urlDatos(slug))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.url}`))))
      .then((json: unknown) => {
        const parsed = PublicacionSchema.safeParse(json);
        if (!parsed.success) throw new Error(`post.json inválido: ${parsed.error.message}`);
        return parsed.data;
      })
      .catch((e) => {
        console.warn(`[ja-post] ${slug}`, e instanceof Error ? e.message : e);
        CARGAS.delete(slug);
        return null;
      }));
  }
  return CARGAS.get(slug)!;
}
