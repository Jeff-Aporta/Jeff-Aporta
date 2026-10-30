/**
 * seo.ts — helpers comunes de los metadatos del sitio (los usan `build-meta.ts` y `build-blog.ts`):
 * URL públicas (portada, blog, cada publicación: limpias, sin `?s=`), escape de HTML, el `<head>` SEO
 * de una página, los nodos JSON-LD del blog y el resumen estático de una publicación para rastreadores.
 */
import { contenido } from '../../src/js/contenido/index.ts';
import type { Publicacion } from '../../src/js/consts/schemas/contenido.schemas.ts';

const { sitio, perfil, experiencia, educacion, habilidades } = contenido;

export const abs = (ruta: string): string => new URL(ruta, sitio.url).href;
export const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/** JSON-LD dentro de `<script>`: `<` escapado para que ningún texto cierre la etiqueta. */
export const ldJson = (nodo: unknown): string => `<script type="application/ld+json">${JSON.stringify(nodo).replace(/</g, '\\u003c')}</script>`;

/** URL públicas y limpias (las mismas de `src/js/base/rutas.ts`). */
export const urlBlog = (): string => `${sitio.url}blog/`;
export const urlPost = (p: { slug: string }): string => `${sitio.url}blog/${p.slug}/`;
export const idPersona = (): string => `${sitio.url}#persona`;

/** Nodo JSON-LD `Person` del autor: ÚNICA fuente (lo usan la portada y cada página del blog). */
export function persona(): Record<string, unknown> {
  const actual = experiencia.find((e) => e.periodos.some((p) => p.hasta === null));
  return {
    '@type': 'Person',
    '@id': idPersona(),
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
  };
}

export const enlace = (href: string, texto: string): string => `<a href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${esc(texto)}</a>`;
export const lista = (items: string[]): string => `<ul>\n${items.map((i) => `  <li>${i}</li>`).join('\n')}\n</ul>`;

/** Cabecera SEO de una página: título, descripción, canonical, Open Graph, Twitter y los JSON-LD que se pasen. */
export function cabeceraSeo(o: { titulo: string; descripcion: string; url: string; imagen: { src: string; alt: string }; tipo: 'profile' | 'article' | 'website'; extra?: string[]; ld: unknown[] }): string {
  return [
    `<title>${esc(o.titulo)}</title>`,
    `<meta name="description" content="${esc(o.descripcion)}">`,
    `<meta name="author" content="${esc(perfil.nombre)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta name="theme-color" content="${sitio.colorTema}">`,
    `<meta name="color-scheme" content="light dark">`,
    `<link rel="canonical" href="${o.url}">`,
    `<meta property="og:type" content="${o.tipo}">`,
    `<meta property="og:locale" content="${sitio.idioma.replace('-', '_')}">`,
    `<meta property="og:site_name" content="${esc(perfil.nombreCorto)}">`,
    `<meta property="og:title" content="${esc(o.titulo)}">`,
    `<meta property="og:description" content="${esc(o.descripcion)}">`,
    `<meta property="og:url" content="${o.url}">`,
    `<meta property="og:image" content="${abs(o.imagen.src)}">`,
    `<meta property="og:image:alt" content="${esc(o.imagen.alt)}">`,
    ...(o.extra ?? []),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(o.titulo)}">`,
    `<meta name="twitter:description" content="${esc(o.descripcion)}">`,
    `<meta name="twitter:image" content="${abs(o.imagen.src)}">`,
    `<meta name="twitter:image:alt" content="${esc(o.imagen.alt)}">`,
    ...o.ld.map(ldJson),
  ].join('\n');
}

/** Nodo JSON-LD `BlogPosting` de una publicación (URL limpia). */
export function blogPosting(p: Publicacion): Record<string, unknown> {
  return {
    '@type': 'BlogPosting',
    '@id': `${urlPost(p)}#post`,
    mainEntityOfPage: urlPost(p),
    headline: p.titulo,
    alternativeHeadline: p.subtitulo,
    description: p.resumen,
    url: urlPost(p),
    datePublished: p.fecha,
    dateModified: p.actualizado ?? p.fecha,
    image: abs(p.portada.src),
    keywords: p.etiquetas.join(', '),
    inLanguage: sitio.idioma,
    isPartOf: { '@id': `${sitio.url}#blog` },
    author: { '@id': idPersona() },
    publisher: { '@id': idPersona() },
  };
}

/** Nodo JSON-LD `Blog` con todas las publicaciones. */
export function blogLd(blog: Publicacion[]): Record<string, unknown> {
  return {
    '@type': 'Blog',
    '@id': `${sitio.url}#blog`,
    url: urlBlog(),
    name: `Blog de ${perfil.nombreCorto}`,
    description: 'Guías paso a paso, narradas y con demos interactivas.',
    inLanguage: sitio.idioma,
    author: { '@id': idPersona() },
    blogPost: blog.map(blogPosting),
  };
}

/** Nodo JSON-LD `ItemList` con las publicaciones, de la más reciente a la más antigua. */
export function itemListBlog(blog: Publicacion[]): Record<string, unknown> {
  const orden = [...blog].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return {
    '@type': 'ItemList',
    '@id': `${urlBlog()}#lista`,
    name: `Publicaciones del blog de ${perfil.nombreCorto}`,
    numberOfItems: orden.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: orden.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: urlPost(p), name: p.titulo, item: { '@id': `${urlPost(p)}#post` } })),
  };
}

/** Texto de un bloque de un paso, en HTML plano (sin renderizar el Markdown). */
function bloqueHtml(b: Publicacion['pasos'][number]['bloques'][number]): string {
  if (b.tipo === 'codigo') return `<pre><code${b.titulo ? ` title="${esc(b.titulo)}"` : ''}>${esc(b.codigo).replace(/>/g, '&gt;')}</code></pre>`;
  if (b.tipo === 'nota') return `<p><strong>${esc(b.titulo)}.</strong> ${esc(b.md)}</p>`;
  return `<p>${esc(b.md)}</p>`;
}

/** Resumen estático de una publicación (lo que un rastreador sin JS lee dentro de `<ja-post>`). */
export function resumenPost(p: Publicacion): string {
  return [
    `<article>`,
    `<h1>${esc(p.titulo)}</h1>`,
    `<p>${esc(p.subtitulo)}</p>`,
    `<p>${esc(perfil.nombreCorto)} · <time datetime="${p.fecha}">${p.fecha}</time> · ${esc(p.etiquetas.join(', '))}</p>`,
    `<img src="${esc(abs(p.portada.src))}" alt="${esc(p.portada.alt)}" width="1200" height="630">`,
    `<p>${esc(p.resumen)}</p>`,
    ...p.pasos.flatMap((paso, i) => [`<h2>${i + 1}. ${esc(paso.titulo)}</h2>`, `<p>${esc(paso.narracion)}</p>`, ...paso.bloques.map(bloqueHtml)]),
    ...(p.creditos ? [`<p><strong>Créditos.</strong> ${esc(p.creditos)}</p>`] : []),
    `</article>`,
  ].join('\n');
}

/** Resumen estático de la lista del blog (dentro de `<ja-blog>`). `base` es el prefijo relativo hasta la raíz. */
export function resumenBlog(blog: Publicacion[], base: string): string {
  const orden = [...blog].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return [`<h1>Blog de ${esc(perfil.nombreCorto)}</h1>`, '<p>Guías paso a paso, narradas y con demos interactivas.</p>', lista(orden.map((p) => `${enlace(`${base}blog/${p.slug}/`, p.titulo)} (${p.fecha}): ${esc(p.resumen)}`))].join('\n');
}
