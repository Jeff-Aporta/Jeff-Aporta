/**
 * rutas.ts — navegación de la SPA con el estado en `?s=` (base64url de un JSON), vía `createSpaState`
 * del kit. Funciona estática en GitHub Pages, sin servidor:
 *
 *   (sin ?s=) · { sec }   → portafolio (y la sección a mostrar)
 *   { v: 'blog' }         → lista de publicaciones
 *   { v: 'post', p }      → una publicación completa
 *
 * Las claves que no son de la ruta (`theme`, `palette`, las escribe el kit) se conservan al navegar;
 * `tabs` (pestañas recordadas por `iswc-tab-group state`) solo dentro de la misma vista. Los enlaces
 * se arman con `hrefDe` y son `<a>` normales: el kit los intercepta y navega sin recargar (también
 * dentro de shadow DOM).
 */
import { b64urlDecode, b64urlEncode, createSpaState } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@a1df39adb9e421de874dd624901b72daa9e25e5c/dist/cdn/core/spa-state.min.js';
import type { RutaSpa } from '../consts/schemas/componentes.schemas.js';

type Estado = Record<string, unknown>;
type Spa = { get(): Estado; navigate(e: Estado, modo?: 'push' | 'replace'): Estado; subscribe(fn: (e: Estado) => void): () => void };

const CLAVES_RUTA = ['v', 'sec', 'p'];

/** Estado de la URL → ruta. Sin estado (o desconocido) es la portada. */
export function rutaDe(estado: Estado): RutaSpa {
  if (estado.v === 'post' && typeof estado.p === 'string' && estado.p) return { vista: 'post', slug: estado.p };
  if (estado.v === 'blog') return { vista: 'blog' };
  return { vista: 'portafolio', seccion: typeof estado.sec === 'string' && estado.sec ? estado.sec : 'inicio' };
}

/** Ruta → claves de la ruta en el estado (la portada no lleva ninguna). */
export function estadoDe(ruta: RutaSpa): Estado {
  if (ruta.vista === 'blog') return { v: 'blog' };
  if (ruta.vista === 'post') return { v: 'post', p: ruta.slug };
  return ruta.seccion === 'inicio' ? {} : { sec: ruta.seccion };
}

/** Lo que ya viaja en `?s=` y no es de la ruta (tema, paleta, pestañas del kit). */
function conservado(): Estado {
  try {
    const crudo = new URLSearchParams(location.search).get('s');
    const estado = crudo ? (JSON.parse(b64urlDecode(crudo)) as Estado) : {};
    return Object.fromEntries(Object.entries(estado).filter(([k]) => !CLAVES_RUTA.includes(k)));
  } catch {
    return {};
  }
}

let spa: Spa | null = null;
const nav = (): Spa =>
  (spa ??= createSpaState({
    initial: {},
    // Cada vista (portafolio, blog, cada publicación) es una entrada del historial; cambiar de sección no.
    viewOf: (e: Estado) => {
      const r = rutaDe(e);
      return r.vista === 'post' ? `post:${r.slug}` : r.vista;
    },
  }) as Spa);

/** Ruta actual (lee `?s=`). */
export const leerRuta = (): RutaSpa => rutaDe(nav().get());

/** Estado completo de una ruta: lo conservado + la ruta. Las pestañas recordadas (`tabs`) son de la
 * vista: otra vista arranca sin ellas. */
function completo(ruta: RutaSpa): Estado {
  const { tabs, ...resto } = conservado();
  const mismaVista = leerRuta().vista === ruta.vista;
  return { ...resto, ...(mismaVista && tabs ? { tabs } : {}), ...estadoDe(ruta) };
}

/** `href` de una ruta: la misma página con su `?s=` (la portada, sin query). */
export function hrefDe(ruta: RutaSpa): string {
  const estado = completo(ruta);
  const url = new URL(location.href);
  url.hash = '';
  if (Object.keys(estado).length) url.searchParams.set('s', b64urlEncode(JSON.stringify(estado)));
  else url.searchParams.delete('s');
  return url.pathname + url.search;
}

/** Navega dentro de la SPA. `replace` deja la URL al día sin crear historial (scroll-spy). */
export function navegar(ruta: RutaSpa, modo?: 'push' | 'replace'): void {
  nav().navigate(completo(ruta), modo);
}

/** Avisa cada cambio de ruta (navegación propia, enlaces y atrás/adelante). */
export const alCambiarRuta = (fn: (ruta: RutaSpa) => void): (() => void) => nav().subscribe((e) => fn(rutaDe(e)));
