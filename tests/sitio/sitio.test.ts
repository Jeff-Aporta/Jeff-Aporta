// sitio.test.ts — sitio estático listo para GitHub Pages (sin navegador), sobre lo que deja el build.
//
//   W-SIT-01  index.html trae título, descripción, canonical, Open Graph, Twitter y JSON-LD del contenido
//   W-SIT-02  sitemap.xml, robots.txt, site.webmanifest y .nojekyll existen y apuntan al sitio publicado
//   W-SIT-03  los íconos del manifest y la imagen social existen
//   W-SIT-04  rutas relativas: nada de la app se pide desde la raíz absoluta «/» (rompería en /Jeff-Aporta/)
//   W-SIT-05  caché: todo lo que los HTML piden de dist/cdn/ lleva el ?v= del hash vigente (asset-hashes.json)
//   W-SIT-06  index.html lleva un resumen estático del contenido (nombre, empresas, proyectos, publicaciones) legible sin JS
//   W-SIT-07  cada publicación tiene su HTML estático con URL limpia (blog/<slug>/index.html + post.json válido), blog/index.html
//             e index.json; cada página con título, canonical, Open Graph, JSON-LD y el texto del post; sitemap con URL limpias
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { PublicacionSchema } from '../../src/js/consts/schemas/contenido.schemas.ts';
import { contenido } from '../../src/js/contenido/index.ts';

const RAIZ = Deno.cwd();
const leer = (rel: string) => readFileSync(join(RAIZ, rel), 'utf8');
const paginasBlog = () => ['blog/index.html', ...contenido.blog.map((p) => `blog/${p.slug}/index.html`)];

export default definirPruebas([
  {
    nombre: 'sitio W-SIT-01 metadatos completos en index.html',
    categoria: 'what',
    correr({ expect }) {
      const html = leer('index.html');
      expect('título', html.includes(`<title>${contenido.sitio.titulo}</title>`));
      expect('descripción', html.includes('name="description"'));
      expect('canonical', html.includes(`<link rel="canonical" href="${contenido.sitio.url}">`));
      for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) expect(p, html.includes(p));
      const ld = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)?.[1];
      expect('JSON-LD presente', !!ld);
      const persona = ld ? JSON.parse(ld)['@graph'].find((n: { '@type': string }) => n['@type'] === 'Person') : null;
      expect('Person con el nombre', persona?.name === contenido.perfil.nombre);
      expect('lang es', html.includes('<html lang="es"'));
      expect('tema claro por defecto', html.includes('data-theme="light"'));
    },
  },
  {
    nombre: 'sitio W-SIT-02 archivos de publicación',
    categoria: 'what',
    correr({ expect }) {
      for (const f of ['sitemap.xml', 'robots.txt', 'site.webmanifest', '.nojekyll']) expect(f, existsSync(join(RAIZ, f)));
      expect('sitemap con la URL', leer('sitemap.xml').includes(contenido.sitio.url));
      expect('robots con sitemap', leer('robots.txt').includes(`${contenido.sitio.url}sitemap.xml`));
    },
  },
  {
    nombre: 'sitio W-SIT-03 íconos e imagen social',
    categoria: 'what',
    correr({ expect }) {
      const manifest: { icons: Array<{ src: string }> } = JSON.parse(leer('site.webmanifest'));
      for (const i of manifest.icons) expect(i.src, existsSync(join(RAIZ, i.src)));
      expect('og:image', existsSync(join(RAIZ, contenido.sitio.imagenOg.src)));
      expect('favicon', existsSync(join(RAIZ, 'assets/img/favicon-64.png')));
      expect('logo', existsSync(join(RAIZ, contenido.perfil.logo)));
    },
  },
  {
    nombre: 'sitio W-SIT-04 sin rutas absolutas a la raíz del dominio',
    categoria: 'what',
    correr({ expect }) {
      const html = leer('index.html');
      expect('index.html', !/(?:src|href)="\/(?!\/)/.test(html));
    },
  },
  {
    nombre: 'sitio W-SIT-05 los HTML piden dist/cdn/ con el ?v= vigente',
    categoria: 'what',
    correr({ eq, expect }) {
      const { files } = JSON.parse(leer('dist/cdn/asset-hashes.json')) as { files: Record<string, string> };
      const paginas = ['index.html', 'view/portafolio/index.html', 'view/portafolio/demo/index.html', 'view/demo/index.html', ...paginasBlog()];
      const viejos: string[] = [];
      let total = 0;
      for (const pagina of paginas) {
        for (const [, rel, v] of leer(pagina).matchAll(/(?:\.{1,2}\/)+dist\/cdn\/([\w./-]+\.(?:js|css))(?:\?v=(\w+))?/g)) {
          total++;
          if (files[rel!] !== v) viejos.push(`${pagina}: ${rel}?v=${v ?? '∅'}`);
        }
      }
      expect('hay recursos que revisar', total > 0);
      eq('recursos sin el ?v= vigente', viejos, []);
    },
  },
  {
    nombre: 'sitio W-SIT-06 resumen estático del contenido en index.html',
    categoria: 'what',
    correr({ expect }) {
      const html = leer('index.html');
      const resumen = html.match(/<!-- resumen:inicio[^>]*-->([\s\S]*?)<!-- resumen:fin -->/)?.[1] ?? '';
      expect('resumen dentro de <ja-app>', html.indexOf('<ja-app>') < html.indexOf('<!-- resumen:inicio') && html.indexOf('<!-- resumen:fin') < html.indexOf('</ja-app>'));
      expect('nombre como h1', resumen.includes(`<h1>${contenido.perfil.nombre}</h1>`));
      for (const e of contenido.experiencia) expect(`empresa ${e.empresa}`, resumen.includes(e.empresa.replace(/&/g, '&amp;')));
      for (const p of contenido.proyectos) expect(`proyecto ${p.titulo}`, resumen.includes(p.titulo));
      for (const p of contenido.blog) expect(`publicación ${p.slug}`, resumen.includes(`<a href="./blog/${p.slug}/">${p.titulo}</a>`));
      expect('enlace a la hoja de vida', resumen.includes(contenido.perfil.cv));
    },
  },
  {
    nombre: 'sitio W-SIT-07 cada publicación con su HTML estático y URL limpia',
    categoria: 'what',
    correr({ eq, expect }) {
      const { sitio, blog } = contenido;
      const ld = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">(.+?)<\/script>/g)].map((m) => JSON.parse(m[1]!) as Record<string, unknown>);
      // Lista del blog
      const lista = leer('blog/index.html');
      expect('blog/index.html título', lista.includes('<title>Blog · '));
      expect('blog/index.html canonical', lista.includes(`<link rel="canonical" href="${sitio.url}blog/">`));
      expect('blog/index.html monta <ja-blog> dentro de <ja-pagina>', /<ja-pagina[^>]*>[\s\S]*<ja-blog>[\s\S]*<\/ja-blog>[\s\S]*<\/ja-pagina>/.test(lista));
      const grafoLista = ld(lista).flatMap((n) => (n['@graph'] as Record<string, unknown>[] | undefined) ?? [n]);
      expect('blog/index.html JSON-LD Blog', grafoLista.some((n) => n['@type'] === 'Blog'));
      const itemList = grafoLista.find((n) => n['@type'] === 'ItemList') as { itemListElement?: unknown[] } | undefined;
      eq('blog/index.html ItemList con todos los posts', itemList?.itemListElement?.length, blog.length);
      expect('blog/index.html Person del sitio', grafoLista.some((n) => n['@type'] === 'Person' && n['@id'] === `${sitio.url}#persona`));
      expect('blog/index.html data-spa-base', lista.includes('data-spa-base="../"'));
      for (const p of blog) expect(`lista enlaza ${p.slug}`, lista.includes(`<a href="../blog/${p.slug}/">${p.titulo}</a>`));
      const indice = JSON.parse(leer('blog/index.json')) as Array<{ slug: string; url: string }>;
      eq('index.json con todos los slugs', indice.map((i) => i.slug).sort(), blog.map((p) => p.slug).sort());
      // Cada publicación
      for (const p of blog) {
        const json = JSON.parse(leer(`blog/${p.slug}/post.json`));
        const parsed = PublicacionSchema.safeParse(json);
        expect(`${p.slug} post.json válido`, parsed.success);
        eq(`${p.slug} post.json es la publicación`, parsed.success ? parsed.data : null, p);
        const html = leer(`blog/${p.slug}/index.html`);
        expect(`${p.slug} título`, html.includes(`<title>${p.titulo} · `));
        expect(`${p.slug} descripción`, html.includes(`<meta name="description" content="${p.resumen.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`));
        expect(`${p.slug} canonical`, html.includes(`<link rel="canonical" href="${sitio.url}blog/${p.slug}/">`));
        expect(`${p.slug} og:image con la portada`, html.includes(`<meta property="og:image" content="${sitio.url}${p.portada.src}">`));
        for (const m of ['<html lang="es"', 'data-spa-base="../../"', '<meta property="og:type" content="article">', '<meta property="og:locale" content="es_CO">', `<meta property="og:title" content="${p.titulo} · `, `<meta property="article:published_time" content="${p.fecha}">`, '<meta property="article:author" content="', '<meta name="twitter:card" content="summary_large_image">', '<meta name="robots" content="index, follow', `<meta name="theme-color" content="${sitio.colorTema}">`, 'rel="manifest" href="../../site.webmanifest"', 'rel="icon" href="../../favicon.ico', 'rel="apple-touch-icon"']) expect(`${p.slug} ${m}`, html.includes(m));
        for (const e of p.etiquetas) expect(`${p.slug} article:tag ${e}`, html.includes(`<meta property="article:tag" content="${e.replace(/&/g, '&amp;')}">`));
        expect(`${p.slug} article:modified_time solo si hay dato`, html.includes('article:modified_time') === !!p.actualizado);
        const grafo = ld(html).flatMap((n) => (n['@graph'] as Record<string, unknown>[] | undefined) ?? [n]);
        const posting = grafo.find((n) => n['@type'] === 'BlogPosting') as Record<string, unknown> | undefined;
        const esperado = { headline: p.titulo, description: p.resumen, datePublished: p.fecha, dateModified: p.actualizado ?? p.fecha, image: `${sitio.url}${p.portada.src}`, keywords: p.etiquetas.join(', '), inLanguage: sitio.idioma, url: `${sitio.url}blog/${p.slug}/`, mainEntityOfPage: `${sitio.url}blog/${p.slug}/` };
        for (const [k, v] of Object.entries(esperado)) eq(`${p.slug} BlogPosting.${k}`, posting?.[k], v);
        eq(`${p.slug} BlogPosting.author → Person del sitio`, (posting?.author as { '@id'?: string } | undefined)?.['@id'], `${sitio.url}#persona`);
        eq(`${p.slug} BlogPosting.publisher → Person del sitio`, (posting?.publisher as { '@id'?: string } | undefined)?.['@id'], `${sitio.url}#persona`);
        eq(`${p.slug} BlogPosting.isPartOf → Blog`, (posting?.isPartOf as { '@id'?: string } | undefined)?.['@id'], `${sitio.url}#blog`);
        expect(`${p.slug} el Person está en el mismo grafo (misma fuente que index.html)`, grafo.some((n) => n['@type'] === 'Person' && n['@id'] === `${sitio.url}#persona` && n.name === contenido.perfil.nombre));
        expect(`${p.slug} el Blog está en el mismo grafo`, grafo.some((n) => n['@type'] === 'Blog' && n['@id'] === `${sitio.url}#blog`));
        expect(`${p.slug} monta <ja-post slug>`, html.includes(`<ja-post slug="${p.slug}">`) && html.includes('<ja-pagina activa="blog">'));
        const dentro = html.match(/<ja-post[^>]*>([\s\S]*?)<\/ja-post>/)?.[1] ?? '';
        expect(`${p.slug} h1 dentro del componente`, dentro.includes(`<h1>${p.titulo}</h1>`));
        for (const paso of p.pasos) expect(`${p.slug} texto del paso «${paso.titulo}»`, dentro.includes(paso.narracion.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')));
        expect(`${p.slug} arranque relativo desde la subcarpeta`, html.includes('../../dist/cdn/boot.js') && html.includes('../../dist/cdn/jaLoader.min.js'));
        expect(`${p.slug} sin rutas absolutas a la raíz del dominio`, !/(?:src|href)="\/(?!\/)/.test(html));
      }
      // Sitemap y robots
      const sitemap = leer('sitemap.xml');
      expect('sitemap con blog/', sitemap.includes(`<loc>${sitio.url}blog/</loc>`));
      for (const p of blog) expect(`sitemap con blog/${p.slug}/`, sitemap.includes(`<loc>${sitio.url}blog/${p.slug}/</loc>`));
      expect('sitemap sin ?s= del blog', !sitemap.includes('?s='));
      expect('robots permite blog/', !/Disallow:\s*\/blog/.test(leer('robots.txt')));
    },
  },
]);
