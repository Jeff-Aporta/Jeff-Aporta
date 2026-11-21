/**
 * precarga.ts — el bloque de precarga que el build escribe en los HTML (estándar iswc-foundation).
 *
 * Entre las marcas `<!-- iswc:precarga:inicio -->` y `<!-- iswc:precarga:fin -->`:
 *   - el import map (el alias del kit al pin y `zod`, que el lote puede importar);
 *   - `<meta name="iswc-precargado" content="<sha>">` (de qué pin salió esta precarga);
 *   - los `modulepreload` del cierre que la página va a pedir (el lote, el núcleo, el shell y la vista);
 *   - las hojas base del kit SIN BLOQUEAR (`preload` + `onload` + `<noscript>` de respaldo);
 *   - el loader del kit (CDN pineado) y el registrador de la app.
 *
 * Las hojas del kit no bloquean: el arranque es un módulo y un `<link rel=stylesheet>` de/CDN
 * retarda TODOS los scripts que van detrás (el primero tarda segundos con la red fría).
 */
export const MARCA_INICIO = '<!-- iswc:precarga:inicio -->';
export const MARCA_FIN = '<!-- iswc:precarga:fin -->';

/** Hojas base del kit que la página usa (del pin; el build no las vendoriza). */
export const HOJAS_BASE = ['is-base.min.css', 'palettes.min.css'];

export type DatosPrecarga = {
  /** Base del CDN del pin (`…/dist/cdn/`). */
  cdn: string;
  /** SHA de 40 hex del pin. */
  sha: string;
  /** Ruta del loader dentro de `dist/cdn/`. */
  loader: string;
  /** `dist/cdn/asset-hashes.json` (hashes por ruta). */
  hashes: Record<string, string>;
  /** Prefijo relativo desde el HTML hasta `dist/cdn/` (con `/` final). */
  prefijo: string;
  /** Ficheros de `dist/cdn/` que la página va a pedir (con su `?v=`). */
  modulos: string[];
};

/** `dist/cdn/<rel>` con el `?v=` vigente (o sin él si no está en el mapa). */
export function conSello(rel: string, hashes: Record<string, string>): string {
  const hash = hashes[rel];
  return hash ? `${rel}?v=${hash}` : rel;
}

/** El bloque completo (marcas incluidas), listo para meter entre las marcas del HTML. */
export function bloquePrecarga(d: DatosPrecarga): string {
  const mapa = { imports: { '@jeff-aporta/iswc-base/': d.cdn } };
  const lineas = [
    `<script type="importmap">${JSON.stringify(mapa)}</script>`,
    `<meta name="iswc-precargado" content="${d.sha}">`,
    ...d.modulos.map((m) => `<link rel="modulepreload" href="${d.prefijo}${m}">`),
    ...HOJAS_BASE.map((h) => `<link rel="preload" as="style" href="${d.cdn}${h}" onload="this.onload=null;this.rel='stylesheet'">`),
    ...HOJAS_BASE.map((h) => `<noscript><link rel="stylesheet" href="${d.cdn}${h}"></noscript>`),
    `<script type="module" src="${d.cdn}${d.loader}"></script>`,
    `<script type="module" src="${d.prefijo}jaLoader.min.js${d.hashes['jaLoader.min.js'] ? `?v=${d.hashes['jaLoader.min.js']}` : ''}"></script>`,
  ];
  return [MARCA_INICIO, ...lineas, MARCA_FIN].join('\n');
}
