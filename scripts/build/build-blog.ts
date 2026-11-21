/**
 * build-blog.ts — cada publicación con su propio HTML estático y URL limpia (lo llama `build-meta.ts`).
 *
 *   blog/index.json          ← lista mínima (slug, título, subtítulo, resumen, fecha, etiquetas, portada, pasos)
 *   blog/<slug>/post.json    ← la publicación completa con la forma de `PublicacionSchema` (`<ja-post>` la carga)
 *   blog/index.html          ← página especializada de la lista: `<ja-pagina>` + `<ja-blog>`
 *   blog/<slug>/index.html   ← página especializada del post: `<ja-pagina>` + `<ja-post slug="…">`
 *
 * Cada página arranca como `index.html` (boot, app.css, loader del kit pineado, registrador y arranque con
 * los `?v=` vigentes de `dist/cdn/asset-hashes.json`), pero monta solo su vista, con cabecera y pie mínimos
 * (`<ja-pagina>`), su `<head>` SEO (título, descripción, canonical a la URL limpia, Open Graph/Twitter con la
 * portada, JSON-LD `BlogPosting` o `Blog`) y, dentro del tag del componente, el resumen estático del post en
 * HTML plano para rastreadores sin JS. Las publicaciones que ya no existen se retiran de `blog/`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withAssetHash } from '@iswc/build/asset-url.ts';
import { contenido } from '../../src/js/contenido/index.ts';
import { ISWC_LOADER_HREF } from '../../src/js/iswc.ts';
import { baseDelPin } from './build-lote.ts';
import { bloquePrecarga, conSello } from './precarga.ts';
import type { Publicacion } from '../../src/js/consts/schemas/contenido.schemas.ts';
import { abs, blogLd, blogPosting, cabeceraSeo, esc, itemListBlog, persona, resumenBlog, resumenPost, urlBlog, urlPost } from './seo.ts';

const { sitio, perfil, blog } = contenido;

/** Los hashes vigentes de `dist/cdn/` (el build de módulos ya corrió). */
function hashesDe(root: string): Record<string, string> {
  const ruta = join(root, 'dist', 'cdn', 'asset-hashes.json');
  return existsSync(ruta) ? (JSON.parse(readFileSync(ruta, 'utf8')) as { files: Record<string, string> }).files : {};
}

/** `dist/cdn/<rel>` con su `?v=` vigente (el build de módulos ya corrió). */
function sellador(root: string): (rel: string) => string {
  const ruta = join(root, 'dist', 'cdn', 'asset-hashes.json');
  const hashes: Record<string, string> = existsSync(ruta) ? (JSON.parse(readFileSync(ruta, 'utf8')) as { files: Record<string, string> }).files : {};
  return (rel) => (hashes[rel] ? withAssetHash(rel, hashes[rel]!) : rel);
}

/** Documento completo de una página especializada. `base` = prefijo relativo hasta la raíz (`../` o `../../`). */
function pagina(o: { base: string; head: string; activa: 'blog'; vista: string; v: (rel: string) => string; bloque: string }): string {
  const cdn = (rel: string) => `${o.base}dist/cdn/${o.v(rel)}`;
  // data-spa-base: los <ja-link> de la página apuntan al SPA de la raíz (resuelto contra esta URL).
  return `<!doctype html>
<html lang="es" data-theme="light" data-palette="jeff" data-spa-base="${o.base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Página especializada: la escribe \`deno task build\` (scripts/build/build-blog.ts) desde src/js/contenido/blog/ (no editar a mano). -->
${o.head}
${sitio.verificacionGoogle ? `<meta name="google-site-verification" content="${esc(sitio.verificacionGoogle)}">\n` : ''}<link rel="icon" href="${o.base}favicon.ico?v=2" sizes="any">
<link rel="icon" href="${o.base}assets/img/favicon-32.png?v=2" type="image/png" sizes="32x32">
<link rel="icon" href="${o.base}assets/img/favicon-64.png?v=2" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="${o.base}assets/img/icono-180.png?v=2" sizes="180x180">
<link rel="manifest" href="${o.base}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<!-- Las fuentes NO bloquean el arranque: una hoja de un CDN externo retarda todos los scripts que van detrás. -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"></noscript>
<!-- Tema antes del primer pintado: ?s= (theme/palette) > localStorage del kit > light / jeff. Script plano. -->
<script src="${cdn('boot.js')}"></script>
<link rel="stylesheet" href="${cdn('styles/app.css')}">
<!-- 1) Import map, precarga del cierre, hojas base del kit sin bloquear, loader pineado y registrador. -->
${o.bloque}
<!-- 2) Arranque: todo en paralelo (lote del kit, núcleo, shell y vista del blog). El watchdog de 6 s. -->
<script type="module" src="${cdn('jaArranque.min.js')}"></script>
</head>
<body>
  <noscript>Esta página necesita JavaScript para la guía interactiva; el texto completo está abajo. Portafolio: <a href="${o.base}">inicio</a>.</noscript>
  <iswc-toast placement="bottom-end"></iswc-toast>
  <ja-pagina activa="${o.activa}">
${o.vista}
  </ja-pagina>
</body>
</html>
`;
}

function paginaPost(p: Publicacion, v: (rel: string) => string, bloque: string): string {
  const head = cabeceraSeo({
    titulo: `${p.titulo} · ${perfil.nombreCorto}`,
    descripcion: p.resumen,
    url: urlPost(p),
    imagen: p.portada,
    tipo: 'article',
    extra: [
      `<meta property="article:published_time" content="${p.fecha}">`,
      ...(p.actualizado ? [`<meta property="article:modified_time" content="${p.actualizado}">`] : []),
      `<meta property="article:author" content="${esc(perfil.nombre)}">`,
      `<meta property="article:section" content="Blog">`,
      ...p.etiquetas.map((e) => `<meta property="article:tag" content="${esc(e)}">`),
    ],
    // Un solo grafo: el Person del sitio (misma fuente que la portada), el Blog al que pertenece y el BlogPosting.
    ld: [{ '@context': 'https://schema.org', '@graph': [persona(), { '@type': 'Blog', '@id': `${sitio.url}#blog`, url: urlBlog(), name: `Blog de ${perfil.nombreCorto}` }, blogPosting(p)] }],
  });
  const vista = `    <ja-post slug="${p.slug}">\n<!-- resumen estático del post para rastreadores sin JS (el componente lo reemplaza al pintar) -->\n${resumenPost(p)}\n    </ja-post>`;
  return pagina({ base: '../../', head, activa: 'blog', vista, v, bloque });
}

function paginaBlog(v: (rel: string) => string, bloque: string): string {
  const head = cabeceraSeo({
    titulo: `Blog · ${perfil.nombreCorto}`,
    descripcion: `Blog de ${perfil.nombreCorto}: guías de programación paso a paso, narradas con su voz y con demos interactivas.`,
    url: urlBlog(),
    imagen: sitio.imagenOg,
    tipo: 'website',
    ld: [{ '@context': 'https://schema.org', '@graph': [persona(), blogLd(blog), itemListBlog(blog)] }],
  });
  const vista = `    <ja-blog>\n<!-- resumen estático de la lista para rastreadores sin JS -->\n${resumenBlog(blog, '../')}\n    </ja-blog>`;
  return pagina({ base: '../', head, activa: 'blog', vista, v, bloque });
}

/** Escribe `blog/` completo; devuelve las rutas relativas escritas. */
export function generarBlog(root: string): string[] {
  const v = sellador(root);
  const hashes = hashesDe(root);
  const { cdn, sha } = baseDelPin(ISWC_LOADER_HREF);
  const loader = 'core/loader.min.js';
  const bloqueDe = (base: string) =>
    bloquePrecarga({
      cdn,
      sha,
      loader,
      hashes,
      prefijo: `${base}dist/cdn/`,
      modulos: ['jaLote.min.mjs', 'jaLoteExtra.min.mjs', 'jaNucleo.min.js', 'jaApp.min.js', 'jaBlog.min.js'].map((m) => conSello(m, hashes)),
    });
  const carpeta = join(root, 'blog');
  mkdirSync(carpeta, { recursive: true });
  const vivos = new Set(blog.map((p) => p.slug));
  for (const e of readdirSync(carpeta, { withFileTypes: true })) if (e.isDirectory() && !vivos.has(e.name)) rmSync(join(carpeta, e.name), { recursive: true, force: true });
  const escritos: string[] = [];
  const escribir = (rel: string, texto: string) => {
    mkdirSync(join(carpeta, rel, '..'), { recursive: true });
    writeFileSync(join(carpeta, rel), texto);
    escritos.push(`blog/${rel}`);
  };
  escribir('index.html', paginaBlog(v, bloqueDe('../')));
  escribir('index.json', `${JSON.stringify(blog.map((p) => ({ slug: p.slug, titulo: p.titulo, subtitulo: p.subtitulo, resumen: p.resumen, fecha: p.fecha, etiquetas: p.etiquetas, portada: p.portada, pasos: p.pasos.length, url: urlPost(p), datos: `${abs(`blog/${p.slug}/post.json`)}` })), null, 2)}\n`);
  for (const p of blog) {
    escribir(`${p.slug}/post.json`, `${JSON.stringify(p, null, 2)}\n`);
    escribir(`${p.slug}/index.html`, paginaPost(p, v, bloqueDe('../../')));
  }
  return escritos;
}