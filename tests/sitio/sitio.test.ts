// sitio.test.ts — sitio estático listo para GitHub Pages (sin navegador), sobre lo que deja el build.
//
//   W-SIT-01  index.html trae título, descripción, canonical, Open Graph, Twitter y JSON-LD del contenido
//   W-SIT-02  sitemap.xml, robots.txt, site.webmanifest y .nojekyll existen y apuntan al sitio publicado
//   W-SIT-03  los íconos del manifest y la imagen social existen
//   W-SIT-04  rutas relativas: nada de la app se pide desde la raíz absoluta «/» (rompería en /Jeff-Aporta/)
//   W-SIT-05  caché: todo lo que los HTML piden de dist/cdn/ lleva el ?v= del hash vigente (asset-hashes.json)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { contenido } from '../../src/js/contenido/index.ts';

const RAIZ = Deno.cwd();
const leer = (rel: string) => readFileSync(join(RAIZ, rel), 'utf8');

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
      const paginas = ['index.html', 'view/portafolio/index.html', 'view/portafolio/demo/index.html', 'view/demo/index.html'];
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
]);
