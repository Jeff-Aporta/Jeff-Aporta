/**
 * build.ts — `src/js/**` y `view/**` → `dist/cdn/` (estándar iswc-foundation). Lo corre `deno task build`
 * DESPUÉS de `build:scss`.
 *
 *   src/js/bundles/jaNucleo.ts   → dist/cdn/jaNucleo.min.js     (núcleo: base, schemas, contenido, transversales)
 *   src/js/bundles/jaApp.ts      → dist/cdn/jaApp.min.js        (shell de la SPA: `<ja-app>`)
 *   view/portafolio/components/   → dist/cdn/jaPortafolio.min.js  (vista)
 *   view/blog/components/         → dist/cdn/jaBlog.min.js        (vista)
 *   view/demo/components/         → dist/cdn/jaGaleria.min.js     (galería)
 *   src/js/components/ja/all.ts   → dist/cdn/all.min.js           (barril de compatibilidad: todo)
 *   src/js/boot.ts                → dist/cdn/boot.js              (IIFE, síncrono en `<head>`)
 *   (kit, bajado del pin)         → dist/cdn/jaLote.min.mjs       (LOTE ESM: los tags del kit, con su cierre)
 *                                   dist/cdn/jaLoteExtra.min.mjs  (LOTE del blog y la galería)
 *
 * Un bundle por CONSUMIDOR (el núcleo, el shell y cada vista), no uno por componente: la primera carga
 * pide 4 ficheros de JS en vez de ~70. El núcleo va aparte y lo comparten el shell y las vistas: el
 * navegador lo descarga una vez (sin duplicar zod, el contenido ni los componentes transversales).
 *
 * Después: cache busting `?v=<hash>` (las tools del kit), el registrador `jaLoader.min.js` (tag → URL
 * hasheada: los tags del kit → su lote, los propios → su bundle), el arranque `jaArranque.min.js` (todo
 * en paralelo, sin fases en serie) y el bloque de precarga de los HTML (import map, `iswc-precargado`,
 * modulepreload del cierre y las hojas base del kit sin bloquear).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import esbuild, { type Plugin } from 'esbuild';
import { hashPorRuta } from '@iswc/build/hash.ts';
import { withAssetHash } from '@iswc/build/asset-url.ts';
import { hashesJson, stampDirectory } from '@iswc/build/stamp-hashes.ts';
import { APP_TAGS, KIT_TAGS, LOTE_TAGS, LOTE_TAGS_EXTRA, LOTE_TAGS_GALERIA, PREFIJO, VIEW_TAGS, bundleDe, rutaComponente } from '../js/kit-tags.ts';
import { ISWC_LOADER_HREF } from '../js/iswc.ts';
import { construirLote, infoDelPin, pluginPin, type InfoPin } from '../../scripts/build/build-lote.ts';
import { MARCA_FIN, MARCA_INICIO, bloquePrecarga, conSello } from '../../scripts/build/precarga.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
const SRC_JS = join(ROOT, 'src', 'js');
const VIEW = join(ROOT, 'view');
const STAGING = join(ROOT, '.tmp-scss');
const OUT = join(ROOT, 'dist', 'cdn');
const CACHE = join(ROOT, '.tmp', 'kit-cache');
const SELLO = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const DEFINE = { __APP_BUILD__: JSON.stringify(SELLO) };

/** Un bundle de la app: su entrada y el fichero que publica. */
type Bundle = { nombre: string; fuente: string; salida: string };

/** Los bundles, en orden de dependencia (el núcleo primero). */
const BUNDLES: Bundle[] = [
  { nombre: 'jaNucleo', fuente: join(SRC_JS, 'bundles', 'jaNucleo.ts'), salida: 'jaNucleo.min.js' },
  { nombre: 'jaApp', fuente: join(SRC_JS, 'bundles', 'jaApp.ts'), salida: 'jaApp.min.js' },
  { nombre: 'jaPortafolio', fuente: join(VIEW, 'portafolio', 'components', 'all.ts'), salida: 'jaPortafolio.min.js' },
  { nombre: 'jaBlog', fuente: join(VIEW, 'blog', 'components', 'all.ts'), salida: 'jaBlog.min.js' },
  { nombre: 'jaGaleria', fuente: join(VIEW, 'demo', 'components', 'all.ts'), salida: 'jaGaleria.min.js' },
  { nombre: 'all', fuente: join(SRC_JS, 'components', 'ja', 'all.ts'), salida: 'all.min.js' },
];

/** Los componentes de cada bundle (para embebider su CSS). */
const CSS_DE: Record<string, string[]> = {
  jaNucleo: APP_TAGS.filter((t) => t !== 'ja-app'),
  jaApp: ['ja-app'],
  jaPortafolio: [...VIEW_TAGS.portafolio],
  jaBlog: [...VIEW_TAGS.blog],
  jaGaleria: [],
  all: [...APP_TAGS, ...VIEW_TAGS.portafolio, ...VIEW_TAGS.blog],
};

/** Lo que vive en el núcleo (todo lo que el shell y las vistas comparten). */
const EN_NUCLEO: string[] = [
  join(SRC_JS, 'base'),
  join(SRC_JS, 'consts'),
  join(SRC_JS, 'contenido'),
  join(SRC_JS, 'kit-tags.ts'),
  ...APP_TAGS.filter((t) => t !== 'ja-app').map((t) => join(SRC_JS, 'components', PREFIJO, `${t}.ts`)),
];

const esDelNucleo = (abs: string): boolean => EN_NUCLEO.some((p) => abs === p || abs.startsWith(p + sep));

/**
 * El núcleo es EXTERNO en el resto de bundles: el navegador lo descarga una vez y lo comparte (sin
 * duplicar zod, el contenido ni los componentes transversales en cada bundle).
 */
function pluginNucleo(): Plugin {
  return {
    name: 'nucleo-externo',
    setup(b) {
      b.onResolve({ filter: /.*/ }, (a) => {
        const base = a.namespace === 'file' && a.importer ? dirname(a.importer) : ROOT;
        const abs = isAbsolute(a.path) ? a.path : resolve(base, a.path);
        if (!esDelNucleo(abs)) return undefined;
        return { path: './jaNucleo.min.js', external: true };
      });
    },
  };
}

/**
 * El CSS de un componente va DENTRO de su bundle (el build lo registra por tag): así el componente lo
 * adopta al instante, sin pedir la hoja por red y sin el frame sin estilos que da el `<link>` de
 * respaldo. La hoja suelta se sigue publicando (respaldo para quien no use el bundle).
 */
function cssDe(tag: string): string {
  const carpeta = rutaComponente(tag);
  if (!carpeta) return '';
  const publicada = `${carpeta}${tag}.css`;
  const enStaging = join(STAGING, publicada.startsWith('js/') ? `src/${publicada}` : publicada);
  if (!existsSync(enStaging)) return '';
  const r = esbuild.transformSync(readFileSync(enStaging, 'utf8'), { loader: 'css', minify: true });
  return r.code.replace(/^@charset\s+"[^"]*";\s*/, '');
}

/** Módulo virtual que registra el CSS embebido de los componentes de un bundle. */
function pluginCssEmbebido(tags: string[]): Plugin {
  return {
    name: 'css-embebido',
    setup(b) {
      b.onResolve({ filter: /^ja-css:/ }, () => ({ path: 'ja-css', namespace: 'css-embebido' }));
      b.onLoad({ filter: /.*/, namespace: 'css-embebido' }, () => {
        const lineas = [`import { registrarCss } from ${JSON.stringify(join(SRC_JS, 'base', 'componente.ts'))};`];
        for (const tag of tags) {
          const texto = cssDe(tag);
          if (!texto) continue;
          lineas.push(`registrarCss(${JSON.stringify(tag)}, ${JSON.stringify(texto)});`);
        }
        return { contents: lineas.join('\n'), loader: 'js', resolveDir: join(SRC_JS, 'base') };
      });
    },
  };
}

const listar = (dir: string, ext: string): string[] =>
  !existsSync(dir) ? [] : readdirSync(dir, { withFileTypes: true }).flatMap((e): string[] => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name.startsWith('.') || e.name === 'tests' || e.name === 'stagehand' ? [] : listar(p, ext);
    return e.name.endsWith(ext) && !e.name.endsWith('.d.ts') && !e.name.endsWith('.test.ts') ? [p] : [];
  });

/** Páginas que arrancan la app: la raíz, cada vista aislada, las demos y las páginas especializadas del blog. */
const paginas = (): string[] => [join(ROOT, 'index.html'), ...listar(VIEW, '.html'), ...listar(join(ROOT, 'blog'), '.html')];

/** Compila los bundles de la app (el núcleo, el shell, las vistas y el barril de compatibilidad). */
async function compilarBundles(pin: InfoPin): Promise<number> {
  for (const b of BUNDLES) {
    const r = await esbuild.build({
      entryPoints: [b.fuente],
      bundle: true,
      write: false,
      format: 'esm',
      target: 'es2022',
      minify: true,
      define: DEFINE,
      inject: ['ja-css:registro'],
      plugins: [
        ...(b.nombre === 'jaNucleo' ? [] : [pluginNucleo()]),
        pluginCssEmbebido(CSS_DE[b.nombre] ?? []),
        pluginPin({ cdn: pin.cdn, cache: CACHE, externos: [pin.loader, pin.zod].filter(Boolean) }),
      ],
    });
    writeFileSync(join(OUT, b.salida), r.outputFiles[0]!.text);
  }
  return BUNDLES.length;
}

/** Los lotes del kit: uno para el arranque y otro para el blog y la galería. */
async function compilarLotes(pin: InfoPin): Promise<{ nombre: string; tags: number; modulos: number; bytes: number }[]> {
  const salida: { nombre: string; tags: number; modulos: number; bytes: number }[] = [];
  for (const lote of [
    { nombre: 'jaLote.min.mjs', tags: [...LOTE_TAGS] },
    { nombre: 'jaLoteExtra.min.mjs', tags: [...LOTE_TAGS_EXTRA] },
    { nombre: 'jaLoteGaleria.min.mjs', tags: [...LOTE_TAGS_GALERIA] },
  ]) {
    const r = await construirLote({
      cdn: pin.cdn,
      tags: lote.tags,
      salida: join(OUT, lote.nombre),
      cache: CACHE,
      externos: [pin.loader, pin.zod].filter(Boolean),
      cierre: pin.cierre,
      archivos: pin.archivos,
    });
    salida.push({ nombre: lote.nombre, tags: r.tags.length, modulos: r.modulos, bytes: r.bytes });
  }
  return salida;
}

/** Compila las hojas del staging (`.tmp-scss/`) a su sitio en `dist/cdn/`. */
function compilarHojas(): number {
  const hojas = listar(STAGING, '.css');
  for (const css of hojas) {
    const r = esbuild.buildSync({
      entryPoints: [css],
      bundle: true,
      write: false,
      minify: true,
      loader: { '.css': 'css' },
    });
    // `.tmp-scss/src/js/x.css` → `js/x.css` (published path, like the modules).
    const rel = relative(STAGING, css).split(sep).join('/').replace(/^src\//, '');
    const destino = join(OUT, rel.replace(/\.[^.]+$/, '.css'));
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, r.outputFiles[0]!.text);
  }
  return hojas.length;
}

/**
 * Base de íconos de la app (una sola declaración: `deno.json` → `iswc.host`): el registrador la deja en
 * `<html data-icons>` si la página no trae otra. Siempre URL absoluta: la del sitio publicado o, si la página
 * se sirve desde otro origen (dev, e2e), la de su propio servidor.
 */
function iconos(): string[] {
  const deno: { iswc?: { host?: unknown } } = JSON.parse(readFileSync(join(ROOT, 'deno.json'), 'utf8'));
  const host = deno.iswc?.host;
  if (typeof host !== 'string' || !/^https?:\/\//.test(host)) return [];
  const base = new URL('assets/iconify/', host.endsWith('/') ? host : `${host}/`).href;
  return [`{const h=document.documentElement,p=${JSON.stringify(base)};if(!h.dataset.icons)h.dataset.icons=location.origin===new URL(p).origin?p:new URL("../../assets/iconify/",raiz).href;}`];
}

/** Fichero publicado donde vive cada tag propio (el núcleo, el shell o su vista). */
function archivoDe(tag: string): string {
  const b = bundleDe(tag);
  if (b === 'shell') return tag === 'ja-app' ? 'jaApp.min.js' : 'jaNucleo.min.js';
  if (b === 'portafolio') return 'jaPortafolio.min.js';
  return 'jaBlog.min.js';
}
/**
 * Entrada del registrador: la URL del bundle y su tipo de carga.
 *
 * Los bundles de la app son MÓDULOS ES (importan el núcleo: `import ... from "./jaNucleo.min.js"`)
 * pero se publican con extensión `.js`. El loader del kit infiere el tipo por la extensión
 * (D2: `.js` → `<script src>` clásico, `.mjs` → `import()`), así que sin este `type` los cargaba
 * como script clásico y el bundle reventaba con «SyntaxError: Cannot use import statement outside a
 * module». `type` es el override documentado del kit (`AppComponentEntry.type`), así que el núcleo
 * se sigue compartiendo: un solo fichero, descargado una vez.
 */
function entradaRegistrador(url: string): string {
  return `{href:new URL(${JSON.stringify(url)},raiz).href,type:"module"}`;
}

/**
 * El registrador (`jaLoader.min.js`): tag → URL hasheada. Los tags del kit apuntan a su LOTE (un solo
 * fichero con su cierre) y los propios a su bundle. El loader lo usa en `load()`/`ensure()`, así pide
 * un fichero por vista en vez de uno por componente.
 */
function fuenteRegistrador(hashes: Record<string, string>): string {
  const pares: string[] = [];
  for (const [tags, lote] of [[LOTE_TAGS, 'jaLote.min.mjs'], [LOTE_TAGS_EXTRA, 'jaLoteExtra.min.mjs'], [LOTE_TAGS_GALERIA, 'jaLoteGaleria.min.mjs']] as const) {
    const url = conSello(lote, hashes);
    for (const tag of tags) pares.push(`${JSON.stringify(tag)}:${entradaRegistrador(url)}`);
  }
  for (const tag of [...APP_TAGS, ...VIEW_TAGS.portafolio, ...VIEW_TAGS.blog]) {
    const url = conSello(archivoDe(tag), hashes);
    pares.push(`${JSON.stringify(tag)}:${entradaRegistrador(url)}`);
  }
  return [
    'const L=globalThis.iswcLoader;',
    `if(!L)throw new Error("${PREFIJO}Loader: falta iswcLoader (carga antes el loader del kit)");`,
    'const raiz=new URL("./",import.meta.url);',
    `L.registerApp({${pares.join(',')}},{installSheets:false});`,
    ...iconos(),
  ].join('');
}

/**
 * El arranque (`jaArranque.min.js`): TODO en paralelo, sin fases en serie. El lote del kit, el núcleo, el
 * shell y la vista se piden a la vez; la vista depende de la URL (el blog vive bajo `/blog/`).
 */
function fuenteArranque(hashes: Record<string, string>): string {
  const lote = conSello('jaLote.min.mjs', hashes);
  const loteExtra = conSello('jaLoteExtra.min.mjs', hashes);
  const nucleo = conSello('jaNucleo.min.js', hashes);
  const shell = conSello('jaApp.min.js', hashes);
  const portafolio = conSello('jaPortafolio.min.js', hashes);
  const blog = conSello('jaBlog.min.js', hashes);
  const tags = KIT_TAGS.map((t) => JSON.stringify(t)).join(',');
  return [
    'const L=globalThis.iswcLoader;',
    "const listo=()=>document.documentElement.setAttribute('data-app-ready','');",
    "const watchdog=setTimeout(()=>{console.warn('[ja] el arranque excedió 6 s; se revela la página');listo();},6000);",
    'try{',
    "if(!L)throw new Error('falta iswcLoader');",
    "const enBlog=/\\/blog(\\/|$)/.test(location.pathname);",
    'const imp=(r)=>import(new URL(r,import.meta.url).href);',
    'await Promise.all([',
    `L.load(${tags}),`,
    `imp(${JSON.stringify(lote)}),`,
    `imp(${JSON.stringify(nucleo)}),`,
    `imp(${JSON.stringify(shell)}),`,
    `enBlog?imp(${JSON.stringify(blog)}):imp(${JSON.stringify(portafolio)}),`,
    `enBlog?imp(${JSON.stringify(loteExtra)}):Promise.resolve(),`,
    ']);',
    "const esperas=[...document.querySelectorAll('*')].map((e)=>e.tagName.toLowerCase()).filter((t)=>t.startsWith('ja-'));",
    'await Promise.all(esperas.map((t)=>customElements.whenDefined(t)));',
    "const app=document.querySelector('ja-app');",
    'if(app&&app.vistaLista)await app.vistaLista;',
    "}catch(e){console.warn('[ja] arranque',e);}",
    'finally{clearTimeout(watchdog);listo();}',
  ].join('');
}

/** Los ficheros de `dist/cdn/` que cada página precarga (los que va a pedir de verdad). */
function modulosDe(pagina: string): string[] {
  const rel = relative(ROOT, pagina).split(sep).join('/');
  const nucleo = ['jaNucleo.min.js', 'jaApp.min.js'];
  if (rel.startsWith('blog/')) return ['jaLote.min.mjs', 'jaLoteExtra.min.mjs', ...nucleo, 'jaBlog.min.js'];
  if (rel.startsWith('view/demo/')) {
    return ['jaLote.min.mjs', 'jaLoteExtra.min.mjs', 'jaLoteGaleria.min.mjs', ...nucleo, 'jaPortafolio.min.js', 'jaBlog.min.js', 'jaGaleria.min.js'];
  }
  return ['jaLote.min.mjs', ...nucleo, 'jaPortafolio.min.js'];
}

/** Escribe el bloque de precarga en cada HTML (entre las marcas). */
function aplicarPrecarga(pin: InfoPin, hashes: Record<string, string>): number {
  let tocados = 0;
  for (const pagina of paginas()) {
    const texto = readFileSync(pagina, 'utf8');
    const ini = texto.indexOf(MARCA_INICIO);
    const fin = texto.indexOf(MARCA_FIN);
    if (ini < 0 || fin < ini) continue;
    let prefijo = relative(dirname(pagina), OUT).split(sep).join('/') + '/';
    if (!prefijo.startsWith('.')) prefijo = './' + prefijo;
    const bloque = bloquePrecarga({
      cdn: pin.cdn,
      sha: pin.sha,
      loader: pin.loader,
      hashes,
      prefijo,
      modulos: modulosDe(pagina).map((m) => conSello(m, hashes)),
    });
    const nuevo = texto.slice(0, ini) + bloque + texto.slice(fin + MARCA_FIN.length);
    if (nuevo === texto) continue;
    writeFileSync(pagina, nuevo);
    tocados++;
  }
  return tocados;
}

/** `dist/cdn/<archivo>` con o sin `?v=` previo → `?v=<hash actual>` en cada página (solo si el texto cambia). */
function sellarHtml(hashes: Record<string, string>): void {
  for (const pagina of paginas()) {
    const antes = readFileSync(pagina, 'utf8');
    const despues = antes.replace(/((?:\.{1,2}\/)+dist\/cdn\/)([\w./-]+\.(?:m?js|css))(?:\?v=\w+)?(?=['"])/g, (todo, base: string, rel: string) =>
      hashes[rel] ? `${base}${withAssetHash(rel, hashes[rel]!)}` : todo);
    if (despues !== antes) writeFileSync(pagina, despues);
  }
}

/** Compila, sella y escribe los metadatos. */
async function construir(): Promise<void> {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const pin = await infoDelPin(ISWC_LOADER_HREF, CACHE);
  const bundles = await compilarBundles(pin);
  const lotes = await compilarLotes(pin);
  const hojas = compilarHojas();
  const boot = await esbuild.transform(readFileSync(join(SRC_JS, 'boot.ts'), 'utf8'), {
    loader: 'ts',
    format: 'iife',
    target: 'es2019',
    minify: true,
  });
  writeFileSync(join(OUT, 'boot.js'), boot.code);

  const hashes = await stampDirectory(OUT);
  const arranque = await esbuild.transform(fuenteArranque(hashes), { minify: true, format: 'esm', target: 'es2022' });
  writeFileSync(join(OUT, 'jaArranque.min.js'), arranque.code);
  hashes['jaArranque.min.js'] = hashPorRuta('jaArranque.min.js', arranque.code);
  const registrador = await esbuild.transform(fuenteRegistrador(hashes), { minify: true, format: 'esm', target: 'es2022' });
  writeFileSync(join(OUT, 'jaLoader.min.js'), registrador.code);
  hashes['jaLoader.min.js'] = hashPorRuta('jaLoader.min.js', registrador.code);
  writeFileSync(join(OUT, 'asset-hashes.json'), hashesJson(hashes));
  const tocados = aplicarPrecarga(pin, hashes);
  sellarHtml(hashes);

  const git = (args: string[]) => {
    try {
      return new TextDecoder().decode(new Deno.Command('git', { args, cwd: ROOT }).outputSync().stdout).trim() || 'unknown';
    } catch {
      return 'unknown';
    }
  };
  writeFileSync(join(OUT, 'build-stamp.json'), `${JSON.stringify({
    build: SELLO, lastbuild: Date.now(), gitCommit: git(['rev-parse', 'HEAD']), gitBranch: git(['rev-parse', '--abbrev-ref', 'HEAD']),
  }, null, 2)}\n`);
  console.log(
    `[build] dist/cdn: ${bundles} bundles · ${lotes.map((l) => `${l.nombre} (${l.tags} tags, ${Math.round(l.bytes / 1024)} KB)`).join(' · ')} · ${hojas} hojas · build ${SELLO} · ${tocados} HTML`,
  );
}

await construir();

if (!Deno.args.includes('--watch')) await esbuild.stop();
else {
  const { watch } = await import('node:fs');
  let t: ReturnType<typeof setTimeout> | undefined;
  let corriendo = false;
  const rehacer = async () => {
    if (corriendo) return;
    corriendo = true;
    try {
      await new Deno.Command(Deno.execPath(), { args: ['run', '-A', 'scripts/build/build-scss.mjs'], cwd: ROOT }).output();
      await construir();
    } catch (e) {
      console.error('[watch]', e instanceof Error ? e.message : e);
    } finally {
      corriendo = false;
    }
  };
  for (const dir of [join(ROOT, 'src'), VIEW]) {
    watch(dir, { recursive: true }, (_e, f) => {
      if (!f || !/\.(ts|scss|json|md)$/.test(f) || String(f).includes('vendor')) return;
      clearTimeout(t);
      t = setTimeout(rehacer, 80);
    });
  }
  console.log('[watch] esperando cambios en src/ y view/…');
}