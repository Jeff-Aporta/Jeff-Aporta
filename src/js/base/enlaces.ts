/**
 * enlaces.ts — cálculo puro del `href` de un enlace a una página SPA con estado en `?<param>=`
 * (base64url de un JSON, el contrato de `createSpaState` del kit). Lo usa `<ja-link>`; sin DOM, así se
 * prueba sin navegador. Nada aquí sabe de las rutas del portafolio: `rutas.ts` solo lo alimenta.
 */
import { b64urlDecode, b64urlEncode } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@a1df39adb9e421de874dd624901b72daa9e25e5c/dist/cdn/core/spa-state.min.js';

export type EstadoEnlace = Record<string, unknown>;

export type OpcionesHref = {
  /** `href` literal: gana sobre `state`. */
  href?: string;
  /** Estado SPA a serializar en `?<param>=`; vacío o nulo deja la base sin query. */
  state?: EstadoEnlace | null;
  /** Nombre del parámetro (`s` por defecto). */
  param?: string;
  /** Página SPA destino: relativa se resuelve contra `baseDoc`; vacía = `spaBase` o la página actual sin query ni hash. */
  base?: string;
  /** `<html data-spa-base>`: base por defecto de toda la página. */
  spaBase?: string;
  /** Combinar `state` con `estadoActual` en vez de reemplazarlo. */
  merge?: boolean;
  estadoActual?: EstadoEnlace;
  /** URL de la página actual. */
  actual: URL;
  /** `document.baseURI` (contra lo que se resuelven las bases relativas). */
  baseDoc?: string;
};

/** `?<param>=` de una URL → estado (vacío si falta o está corrupto). */
export function estadoDeQuery(url: URL, param = 's'): EstadoEnlace {
  try {
    const crudo = url.searchParams.get(param);
    const e: unknown = crudo ? JSON.parse(b64urlDecode(crudo)) : {};
    return typeof e === 'object' && e !== null && !Array.isArray(e) ? (e as EstadoEnlace) : {};
  } catch {
    return {};
  }
}

/** URL absoluta de la base SPA: `base` > `spaBase` > la página actual sin query ni hash. */
export function baseSpa(o: Pick<OpcionesHref, 'base' | 'spaBase' | 'actual' | 'baseDoc'>): URL {
  const cruda = o.base || o.spaBase || '';
  if (!cruda) {
    const u = new URL(o.actual.href);
    u.search = '';
    u.hash = '';
    return u;
  }
  return new URL(cruda, o.baseDoc ?? o.actual.href);
}

/** `href` del enlace: literal, o la base con `?<param>=<b64url(JSON)>` (sin query si el estado queda vacío). */
export function hrefEnlace(o: OpcionesHref): string {
  if (o.href) return o.href;
  const param = o.param || 's';
  const url = baseSpa(o);
  const estado = o.merge ? { ...(o.estadoActual ?? estadoDeQuery(o.actual, param)), ...(o.state ?? {}) } : (o.state ?? {});
  const limpio = Object.fromEntries(Object.entries(estado).filter(([, v]) => v != null));
  if (Object.keys(limpio).length) url.searchParams.set(param, b64urlEncode(JSON.stringify(limpio)));
  else url.searchParams.delete(param);
  return url.origin === o.actual.origin ? url.pathname + url.search + url.hash : url.href;
}

/** Estado con las claves ordenadas: dos estados iguales serializan igual aunque vengan en otro orden. */
const normalizado = (e: EstadoEnlace): string => JSON.stringify(Object.fromEntries(Object.entries(e).sort(([a], [b]) => a.localeCompare(b))));

/** El enlace apunta a la página actual: misma base (pathname) y el mismo estado `?<param>=` normalizado. */
export function esActual(href: string, actual: URL, param = 's'): boolean {
  try {
    const destino = new URL(href, actual.href);
    if (destino.origin !== actual.origin || destino.pathname.replace(/index\.html$/, '') !== actual.pathname.replace(/index\.html$/, '')) return false;
    return normalizado(estadoDeQuery(destino, param)) === normalizado(estadoDeQuery(actual, param));
  } catch {
    return false;
  }
}

/** `rel` del `<a>`: con `target="_blank"` se garantiza `noopener`. */
export function relAuto(target: string, rel: string): string {
  if (target.toLowerCase() !== '_blank' || /\bnoopener\b/.test(rel)) return rel;
  return `${rel} noopener`.trim();
}
