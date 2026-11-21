/**
 * build-lote.ts — el LOTE ESM del kit para esta app: UN módulo con varios tags `iswc-*` y todo lo que
 * importan (el core incluido), armado desde el kit PUBLICADO al pin (jsDelivr por SHA, inmutable),
 * nunca desde un checkout local.
 *
 *   infoDelPin(sha, cache)            → qué publica el pin (ficheros, tags, loader, zod)
 *   construirLote({cdn, tags, …})     → { bytes, modulos, tags }
 *
 * Es el mismo algoritmo del kit (`src/cdn/build/lote-kit.ts` del pin), portado a la app: el sitio no
 * vendoriza el kit, así que su build baja del pin los módulos del cierre de los tags que necesita y
 * los empaqueta con esbuild en un único fichero. El lote se publica en el `dist/cdn/` de la app y el
 * registrador lo apunta con `registerApp`: `load()` y `ensure()` lo usan en vez de pedir módulo a
 * módulo.
 *
 * De dónde sale el cierre de cada tag:
 *   - pin nuevo (`deps.json` con `categorias` + `deps/<cat>.json`): el índice y las partes de
 *     categoría; se fusionan sus `tags` y se usa el módulo de cada tag (los `_chunks/` los sigue
 *     esbuild por los imports).
 *   - pin viejo (sin `deps.json`): el mapa tag → {categoría, fichero} va embebido en el loader del
 *     pin y la lista de ficheros publicados, en `asset-hashes.json`.
 *
 * Reglas del kit que este archivo respeta:
 *   - el cierre del loader y el de zod quedan EXTERNOS (una sola instancia con la que usa la página);
 *   - `import.meta.url` de cada módulo del pin vale su URL en el pin (el CSS y las hojas del kit se
 *     resuelven contra ella);
 *   - los `import()` dinámicos quedan externos (no se evalúan al cargar el lote).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { build, type Plugin } from 'esbuild';

/** Un tag del pin y su módulo (ruta relativa a `dist/cdn/`). */
export type ModuloTag = { tag: string; modulo: string };

/** Lo que publica el pin: la lista de ficheros y, si el pin los trae, el cierre de cada tag. */
/** El índice del pin: `categorias` (pin nuevo) o `tags` con el cierre (pin viejo). */
type IndicePin = { categorias?: Record<string, string>; tags?: Record<string, string[]> };

export type InfoPin = {
  /** Base del CDN del pin: `…/dist/cdn/`. */
  cdn: string;
  /** SHA de 40 hex del pin. */
  sha: string;
  /** Ruta del loader dentro de `dist/cdn/`. */
  loader: string;
  /** Ruta de zod dentro de `dist/cdn/` (vacío si el pin no lo publica). */
  zod: string;
  /** Ficheros publicados en el pin (relativos a `dist/cdn/`). */
  archivos: string[];
  /** Cierre de cada tag (relativo a `dist/cdn/`); vacío si el pin no lo publica. */
  cierre: Record<string, string[]>;
};

const sinSello = (url: string): string => url.replace(/[?#].*$/, '');

/** Baja un fichero del pin (con caché en disco: el build no lo pide dos veces). */
export async function bajar(url: string, cache: string): Promise<string> {
  const archivo = join(cache, url.replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/:/g, '_'));
  if (existsSync(archivo)) return readFileSync(archivo, 'utf8');
  const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`build-lote: ${url} → ${r.status}`);
  const texto = await r.text();
  mkdirSync(dirname(archivo), { recursive: true });
  writeFileSync(archivo, texto);
  return texto;
}

/** `…/is-webcomponents@<sha>/dist/cdn/` desde la URL del loader que declara la app. */
export function baseDelPin(loaderHref: string): { cdn: string; sha: string } {
  const m = loaderHref.match(/^(https?:\/\/[^/]+\/gh\/[^/]+\/[^@]+)@([0-9a-f]{40})\/(.+)$/);
  if (!m) throw new Error(`build-lote: la URL del loader no lleva un SHA de 40 hex: ${loaderHref}`);
  return { cdn: `${m[1]}@${m[2]!}/${m[3]!.replace(/core\/loader\.min\.(?:m?js)$/, '')}`, sha: m[2]! };
}

/** Módulo propio de un tag en el pin: `<cat>/<nombre>.min.mjs` (o `.min.js` en los pines viejos). */
function moduloDe(cierre: Record<string, string[]>, archivos: string[], tag: string): string {
  const nombre = tag.replace(/^iswc-/, '');
  const delCierre = (cierre[tag] ?? []).find((r) => r.endsWith(`/${nombre}.min.mjs`) || r.endsWith(`/${nombre}.min.js`));
  if (delCierre) return delCierre;
  const enElPin = archivos.find((r) => r.endsWith(`/${nombre}.min.mjs`) || r.endsWith(`/${nombre}.min.js`));
  if (!enElPin) throw new Error(`build-lote: ${tag} no está publicado en el pin`);
  return enElPin;
}

/**
 * Qué publica el pin. `cierre` sale de `deps.json` + `deps/<cat>.json` si el pin los trae; si no,
 * se deduce del mapa embebido en el loader del pin y de `asset-hashes.json`.
 */
export async function infoDelPin(loaderHref: string, cache: string): Promise<InfoPin> {
  const { cdn, sha } = baseDelPin(loaderHref);
  const archivos = (() => {
    try {
      const j = JSON.parse(readFileSync(join(cache, `${cdn.replace(/^https?:\/\//, '').replace(/:/g, '_')}/asset-hashes.json`), 'utf8')) as { files?: Record<string, string> };
      return Object.keys(j.files ?? {});
    } catch {
      return [] as string[];
    }
  })();
  const lista = archivos.length ? archivos : await listarDelPin(cdn, cache);
  const loader = lista.find((r) => /^core\/loader\.min\.(?:m?js)$/.test(r)) ?? 'core/loader.min.js';
  const zod = lista.find((r) => /^lib\/zod\.min\.(?:m?js)$/.test(r)) ?? '';
  const cierre = await cierreDelPin(cdn, cache, lista);
  return { cdn, sha, loader, zod, archivos: lista, cierre };
}

/** Lista de ficheros publicados en el pin (de `asset-hashes.json`; vacío si no se puede). */
async function listarDelPin(cdn: string, cache: string): Promise<string[]> {
  try {
    const texto = await bajar(`${cdn}asset-hashes.json`, cache);
    const j = JSON.parse(texto) as { files?: Record<string, string> };
    return Object.keys(j.files ?? {});
  } catch {
    return [];
  }
}

/**
 * Cierre de cada tag en el pin: `deps.json` + `deps/<cat>.json` (pin nuevo) o el mapa embebido en el
 * loader del pin (pin viejo: no hay índice de cierres, pero sí el módulo de cada tag).
 */
async function cierreDelPin(cdn: string, cache: string, archivos: string[]): Promise<Record<string, string[]>> {
  let indice: IndicePin | null = null;
  try {
    indice = JSON.parse(await bajar(`${cdn}deps.json`, cache)) as IndicePin;
  } catch {
    indice = null;
  }
  if (indice?.categorias) {
    const partes: Record<string, string[]> = {};
    for (const cat of [...new Set([...Object.values(indice.categorias), 'core'])].sort()) {
      try {
        const parte = JSON.parse(await bajar(`${cdn}deps/${cat}.json`, cache)) as { tags?: Record<string, string[]> };
        for (const [tag, mods] of Object.entries(parte.tags ?? {})) partes[tag] = mods;
      } catch {
        /* categoría sin parte: sus tags se resolverán por el módulo propio */
      }
    }
    return partes;
  }
  if (indice?.tags) return indice.tags;
  // Pin viejo: el loader trae el mapa tag → {categoría, fichero}.
  const loader = archivos.find((r) => /^core\/loader\.min\.(?:m?js)$/.test(r)) ?? 'core/loader.min.js';
  const texto = await bajar(`${cdn}${loader}`, cache);
  const mapa: Record<string, string[]> = {};
  for (const m of texto.matchAll(/"([a-z0-9-]+)":\{category:"([a-z0-9-]+)",file:"([a-z0-9-]+)"\}/g)) {
    const tag = m[1]!.startsWith('iswc-') ? m[1]! : `iswc-${m[1]!}`;
    const mod = `${m[2]}/${m[3]}.min.js`;
    if (archivos.includes(mod)) mapa[tag] = [mod];
  }
  return mapa;
}


/**
 * Plugin de esbuild que resuelve lo que viene del PIN por HTTP: baja el módulo (con caché en disco) y
 * lo mete en el bundle. El `import.meta.url` de cada módulo vale su URL en el pin (el kit resuelve sus
 * hojas y su CSS contra ella) y lo que no es del pin (o los `import()` dinámicos) queda externo.
 */
export function pluginPin(o: { cdn: string; cache: string; externos?: string[]; contar?: (url: string) => void }): Plugin {
  const externos = new Set((o.externos ?? []).map((r) => `${o.cdn}${r}`));
  return {
    name: 'kit-pin',
    setup(b) {
      b.onResolve({ filter: /.*/ }, (a) => {
        const desdeKit = a.namespace === 'kit';
        if (!desdeKit && !/^https?:\/\//.test(a.path)) return undefined;
        const url = new URL(a.path, desdeKit ? a.importer : undefined).href;
        if (!url.startsWith(o.cdn) || externos.has(sinSello(url)) || a.kind === 'dynamic-import') return { path: url, external: true };
        return { path: url, namespace: 'kit' };
      });
      b.onLoad({ filter: /.*/, namespace: 'kit' }, async (a) => {
        o.contar?.(a.path);
        const texto = await bajar(a.path, o.cache);
        return { contents: texto.replaceAll('import.meta.url', JSON.stringify(a.path)), loader: 'js' };
      });
    },
  };
}

export type LoteOpts = {
  /** Base del CDN del pin. */
  cdn: string;
  /** Tags del kit que van en el lote. */
  tags: string[];
  /** Fichero de salida. */
  salida: string;
  /** Carpeta de caché de lo bajado del pin. */
  cache: string;
  /** Rutas del pin que quedan externas (loader, zod). */
  externos: string[];
  /** Cierre por tag del pin (para saber el módulo de cada tag). */
  cierre: Record<string, string[]>;
  /** Ficheros publicados en el pin. */
  archivos: string[];
};

/**
 * Empaqueta los tags pedidos (y todo lo que importan) en un único `.mjs`. Devuelve
 * `{ bytes, modulos, tags }`.
 */
export async function construirLote(o: LoteOpts): Promise<{ bytes: number; modulos: number; tags: string[] }> {
  const tags = [...o.tags];
  const contenido = [
    ...tags.map((t) => `import ${JSON.stringify(`${o.cdn}${moduloDe(o.cierre, o.archivos, t)}`)};`),
    `export const tags = ${JSON.stringify(tags)};`,
  ].join('\n');
  let modulos = 0;
  const pin = pluginPin({ cdn: o.cdn, cache: o.cache, externos: o.externos, contar: () => modulos++ });
  const r = await build({
    stdin: { contents: contenido, sourcefile: 'ja-lote.js', loader: 'js' },
    bundle: true,
    write: false,
    format: 'esm',
    target: 'es2022',
    minify: true,
    legalComments: 'none',
    logLevel: 'error',
    plugins: [pin],
  });
  const codigo = `// Lote del kit (tags: ${tags.join(', ')}). Lo arma deno task build; no editar.\n${r.outputFiles[0]!.text}`;
  mkdirSync(dirname(o.salida), { recursive: true });
  writeFileSync(o.salida, codigo);
  return { bytes: codigo.length, modulos, tags };
}