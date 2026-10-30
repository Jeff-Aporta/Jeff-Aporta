/**
 * build-meta.ts — metadatos del sitio desde el contenido central (`src/js/contenido/`).
 *
 * Escribe, para que el sitio estático quede completo en GitHub Pages:
 *   - index.html entre `<!-- meta:inicio -->` y `<!-- meta:fin -->`: título, descripción, canonical,
 *     Open Graph, Twitter y JSON-LD (Person + WebSite + ProfilePage).
 *   - index.html entre `<!-- resumen:inicio -->` y `<!-- resumen:fin -->`, dentro de `<ja-app>`: un resumen
 *     estático del contenido (HTML plano con encabezados, listas y enlaces). El shadow root del shell lo
 *     deja fuera de pantalla, pero los rastreadores que no ejecutan JS lo leen tal cual. Sus enlaces
 *     externos abren en otra pestaña; los del blog son relativos; los proyectos enlazan su repositorio
 *     (la demo queda en la app: la del kit vive en GitHub Pages y `deno task pin` la tomaría por un pin mutable).
 *   - blog/ (vía `build-blog.ts`): `index.json`, `index.html` y, por publicación, `<slug>/post.json` y
 *     `<slug>/index.html` con su propio `<head>` SEO y URL limpia.
 *   - sitemap.xml (portada, `blog/` y cada `blog/<slug>/`: URL limpias), robots.txt, site.webmanifest y .nojekyll.
 * Los helpers comunes (URL públicas, escape, JSON-LD del blog, resúmenes) están en `seo.ts`.
 * Cambias el contenido → `deno task build` → los metadatos se actualizan solos.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contenido } from '../../src/js/contenido/index.ts';
import { mesesCalendario, rangoEmpleo } from '../../src/js/contenido/derivados.ts';
import { generarBlog } from './build-blog.ts';
import { abs, blogLd, enlace, esc, lista, urlBlog, urlPost } from './seo.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
const { sitio, perfil, experiencia, educacion, habilidades, proyectos, blog } = contenido;

const actual = experiencia.find((e) => e.periodos.some((p) => p.hasta === null));
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${sitio.url}#persona`,
      name: perfil.nombre,
      alternateName: perfil.nombreCorto,
      jobTitle: perfil.titular,
      description: perfil.propuesta,
      image: abs(perfil.foto.src),
      url: sitio.url,
      email: `mailto:${perfil.contacto.email}`,
      telephone: perfil.contacto.telefono,
      address: { '@type': 'PostalAddress', addressCountry: 'CO' },
      sameAs: [perfil.contacto.github, perfil.contacto.youtube],
      logo: abs(perfil.logo),
      nationality: { '@type': 'Country', name: 'Colombia' },
      knowsAbout: [...new Set(habilidades.flatMap((g) => g.items))],
      alumniOf: educacion.map((s) => ({ '@type': 'EducationalOrganization', name: s.institucion })),
      ...(actual ? { worksFor: { '@type': 'Organization', name: actual.empresa } } : {}),
    },
    { '@type': 'WebSite', '@id': `${sitio.url}#sitio`, url: sitio.url, name: sitio.titulo, inLanguage: sitio.idioma, author: { '@id': `${sitio.url}#persona` } },
    { '@type': 'ProfilePage', url: sitio.url, name: sitio.titulo, mainEntity: { '@id': `${sitio.url}#persona` }, dateModified: new Date().toISOString().slice(0, 10) },
    blogLd(blog),
  ],
};

const anios = Math.floor(mesesCalendario(experiencia) / 12);
const meta = [
  `<title>${esc(sitio.titulo)}</title>`,
  `<meta name="description" content="${esc(sitio.descripcion)}">`,
  `<meta name="keywords" content="${esc(sitio.palabrasClave.join(', '))}">`,
  `<meta name="author" content="${esc(perfil.nombre)}">`,
  `<meta name="robots" content="index, follow, max-image-preview:large">`,
  ...(sitio.verificacionGoogle ? [`<meta name="google-site-verification" content="${esc(sitio.verificacionGoogle)}">`] : []),
  `<meta name="theme-color" content="${sitio.colorTema}">`,
  `<meta name="color-scheme" content="light dark">`,
  `<link rel="canonical" href="${sitio.url}">`,
  `<meta property="og:type" content="profile">`,
  `<meta property="og:locale" content="${sitio.idioma.replace('-', '_')}">`,
  `<meta property="og:site_name" content="${esc(perfil.nombreCorto)}">`,
  `<meta property="og:title" content="${esc(sitio.titulo)}">`,
  `<meta property="og:description" content="${esc(sitio.descripcion)}">`,
  `<meta property="og:url" content="${sitio.url}">`,
  `<meta property="og:image" content="${abs(sitio.imagenOg.src)}">`,
  `<meta property="og:image:type" content="image/png">`,
  `<meta property="og:image:width" content="1200">`,
  `<meta property="og:image:height" content="630">`,
  `<meta property="og:image:alt" content="${esc(sitio.imagenOg.alt)}">`,
  `<meta property="profile:first_name" content="Jeffrey">`,
  `<meta property="profile:last_name" content="Agudelo">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `<meta name="twitter:title" content="${esc(sitio.titulo)}">`,
  `<meta name="twitter:description" content="${esc(sitio.descripcion)}">`,
  `<meta name="twitter:image" content="${abs(sitio.imagenOg.src)}">`,
  `<meta name="twitter:image:alt" content="${esc(sitio.imagenOg.alt)}">`,
  `<meta name="application-name" content="${esc(perfil.nombreCorto)}">`,
  `<meta name="apple-mobile-web-app-title" content="${esc(perfil.nombreCorto)}">`,
  `<meta name="ja:experiencia" content="${anios}+ años">`,
  `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
].join('\n');

const rutaIndex = join(ROOT, 'index.html');
const index = readFileSync(rutaIndex, 'utf8');
const marca = /(<!-- meta:inicio[^>]*-->)[\s\S]*?(<!-- meta:fin -->)/;
if (!marca.test(index)) throw new Error('build-meta: index.html no tiene los marcadores meta:inicio / meta:fin');
const resumen = [
  `<h1>${esc(perfil.nombre)}</h1>`,
  `<p>${esc(perfil.titular)} · ${esc(perfil.ubicacion)}</p>`,
  `<p>${esc(perfil.propuesta)}</p>`,
  ...perfil.resumen.map((t) => `<p>${esc(t)}</p>`),
  '<h2>Trayectoria</h2>',
  lista(experiencia.map((e) => `<strong>${esc(e.cargo)}</strong> · ${e.sitio ? enlace(e.sitio, e.empresa) : esc(e.empresa)} (${esc(rangoEmpleo(e))}): ${esc(e.resumen)}`)),
  '<h2>Proyectos</h2>',
  lista(proyectos.map((p) => `<strong>${esc(p.titulo)}</strong> (${esc(p.tipo)}): ${esc(p.descripcion)}${p.codigo ? ` ${enlace(p.codigo, 'Código')}` : ''}`)),
  '<h2>Habilidades</h2>',
  lista(habilidades.map((h) => `<strong>${esc(h.titulo)}</strong>: ${esc(h.items.join(', '))}`)),
  '<h2>Educación</h2>',
  lista(educacion.map((s) => `<strong>${esc(s.titulo)}</strong> · ${esc(s.institucion)} (${s.cursando ? esc(s.cursando) : s.anio})`)),
  `<h2>${enlace('./blog/', 'Blog')}</h2>`,
  lista(blog.map((p) => `${enlace(`./blog/${p.slug}/`, p.titulo)} (${p.fecha}): ${esc(p.resumen)}`)),
  '<h2>Contacto</h2>',
  lista([enlace(`mailto:${perfil.contacto.email}`, perfil.contacto.email), enlace(perfil.contacto.github, 'GitHub'), enlace(perfil.contacto.youtube, 'YouTube'), enlace(abs(perfil.cv), 'Hoja de vida (PDF)')]),
].join('\n');
const marcaResumen = /(<!-- resumen:inicio[^>]*-->)[\s\S]*?(<!-- resumen:fin -->)/;
if (!marcaResumen.test(index)) throw new Error('build-meta: index.html no tiene los marcadores resumen:inicio / resumen:fin');
writeFileSync(rutaIndex, index.replace(marca, `$1\n${meta}\n$2`).replace(marcaResumen, `$1\n${resumen}\n$2`));

const hoy = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: sitio.url, lastmod: hoy, freq: 'monthly', prioridad: '1.0' },
  { loc: urlBlog(), lastmod: hoy, freq: 'weekly', prioridad: '0.8' },
  ...blog.map((p) => ({ loc: urlPost(p), lastmod: p.fecha, freq: 'monthly', prioridad: '0.7' })),
];
const fila = (u: (typeof urls)[number]) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.prioridad}</priority></url>`;
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(fila).join('\n')}\n</urlset>\n`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /view/\n\nSitemap: ${abs('sitemap.xml')}\n`);
writeFileSync(join(ROOT, 'site.webmanifest'), `${JSON.stringify({
  name: sitio.titulo,
  short_name: perfil.nombreCorto,
  description: sitio.descripcion,
  lang: sitio.idioma,
  id: './',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: sitio.colorTema,
  categories: ['portfolio', 'education', 'productivity'],
  icons: [
    { src: 'assets/img/favicon-64.png', sizes: '64x64', type: 'image/png' },
    { src: 'assets/img/icono-180.png', sizes: '180x180', type: 'image/png' },
    { src: 'assets/img/icono-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/img/icono-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2)}\n`);
writeFileSync(join(ROOT, '.nojekyll'), '');
const paginasBlog = generarBlog(ROOT);
console.log(`[build:meta] index.html · sitemap.xml · robots.txt · site.webmanifest · blog/ (${paginasBlog.length} archivos) (${sitio.url})`);
