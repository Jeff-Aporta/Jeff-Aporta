// 01.blog.test.ts — páginas especializadas del blog (Stagehand DETERMINISTA, sin LLM). Caja negra.
//
//   W-BLG-04  blog/<slug>/ abre directo: arranca sin errores de consola, monta <ja-pagina> y <ja-post> con ese slug
//             (datos desde post.json), «Compartir» entrega la URL limpia pública y el regreso lleva a blog/
//   W-BLG-05  <ja-post> con `datos` por prop pinta la guía sin red (índice de pasos, tarjeta y progreso)
//   W-BLG-06  un enlace ?s= viejo de un post abre la publicación y la URL queda limpia (replaceState)
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { abrir, esperar } from '../../scripts/gate/e2e/harness.ts';

let s: Awaited<ReturnType<typeof abrir>>;
const SLUG = 'luz-y-sombra-2d';
const URL_PUBLICA = `https://jeff-aporta.github.io/Jeff-Aporta/blog/${SLUG}/`;
const montado = () => !!document.querySelector('ja-pagina')?.shadowRoot?.querySelector('ja-pie') && !!document.querySelector('ja-post')?.shadowRoot?.querySelector('ja-paso')?.shadowRoot?.querySelector('h2');

export default definirPruebas([
  {
    nombre: 'blog W-BLG-04 la página especializada de un post arranca sola',
    categoria: 'what',
    async correr({ eq, expect }) {
      await esperar(s.page, montado, 30_000).catch(() => undefined);
      expect('marcada como lista', await s.page.evaluate(() => document.documentElement.hasAttribute('data-app-ready'), undefined));
      expect('shell mínimo y publicación montados', await s.page.evaluate(montado, undefined));
      const r = await s.page.evaluate((slug: string) => {
        const post = document.querySelector('ja-post') as HTMLElement & { props: { slug: string; datos: { slug: string } | null } };
        const sr = post.shadowRoot!;
        const pagina = document.querySelector('ja-pagina')!.shadowRoot!;
        return {
          titulo: document.title,
          slug: post.props.slug,
          datos: post.props.datos?.slug ?? null,
          h1: sr.querySelector('h1')?.textContent ?? '',
          pasos: sr.querySelectorAll('.paso').length,
          demo: !!sr.querySelector('ja-luz-demo'),
          share: sr.querySelector('iswc-share-button')?.getAttribute('url'),
          copiar: sr.querySelector('iswc-copy-button')?.getAttribute('value'),
          volver: (sr.querySelector('.volver') as HTMLElement & { props: { href: string } }).props.href,
          activa: pagina.querySelector('.vista[data-activa]')?.textContent?.trim(),
          sinApp: !document.querySelector('ja-app'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        };
      }, SLUG);
      expect('título propio', r.titulo.startsWith('Luz y sombra en 2D'));
      eq('slug por atributo', r.slug, SLUG);
      eq('datos cargados de post.json', r.datos, SLUG);
      eq('título de la guía', r.h1, 'Luz y sombra en 2D');
      expect('índice de pasos', r.pasos >= 10, String(r.pasos));
      expect('demo', r.demo);
      eq('Compartir (kit) con la URL limpia', r.share, URL_PUBLICA);
      eq('Copiar (kit) con la URL limpia', r.copiar, URL_PUBLICA);
      eq('volver a la lista', r.volver, '/blog/');
      eq('Blog marcado en la barra', r.activa, 'Blog');
      expect('sin el shell de la SPA', r.sinApp);
      eq('canonical', r.canonical, URL_PUBLICA);
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
  {
    nombre: 'blog W-BLG-05 <ja-post> con datos por prop pinta la guía sin red',
    categoria: 'what',
    async correr({ eq, expect }) {
      const r = await s.page.evaluate(() => {
        const datos = {
          slug: 'prueba-datos',
          titulo: 'Guía de prueba',
          subtitulo: 'Dos pasos por prop.',
          resumen: 'Publicación mínima.',
          fecha: '2026-01-15',
          etiquetas: ['prueba'],
          portada: { src: 'assets/img/og/portada.png', alt: 'Portada' },
          creditos: 'Créditos de prueba.',
          pasos: [
            { titulo: 'Uno', icono: 'mdi:numeric-1-circle-outline', narracion: 'Primer paso de la publicación de prueba, solo texto sin bloques.', bloques: [], demo: null },
            { titulo: 'Dos', icono: 'mdi:numeric-2-circle-outline', narracion: 'Segundo paso de la publicación de prueba con un bloque de código.', bloques: [{ tipo: 'codigo', lenguaje: 'javascript', codigo: 'console.log(1);' }], demo: null },
          ],
        };
        const el = document.createElement('ja-post') as HTMLElement & { props: unknown };
        el.props = { datos };
        el.id = 'prueba-datos';
        document.body.append(el);
        const sr = el.shadowRoot!;
        const r = {
          h1: sr.querySelector('h1')?.textContent,
          pasos: sr.querySelectorAll('.paso').length,
          cuenta: sr.querySelector('.cuenta')?.textContent,
          tarjeta: sr.querySelector('ja-paso')?.shadowRoot?.querySelector('h2')?.textContent,
          demo: !sr.querySelector('.demo')!.hasAttribute('hidden'),
          esqueleto: !!sr.querySelector('iswc-skeleton'),
          share: sr.querySelector('iswc-share-button')?.getAttribute('url'),
        };
        el.remove();
        return r;
      }, undefined);
      eq('título', r.h1, 'Guía de prueba');
      eq('dos pasos en el índice', r.pasos, 2);
      eq('progreso', r.cuenta, 'Paso 1 de 2');
      eq('tarjeta del primer paso', r.tarjeta, 'Uno');
      expect('sin demo (los pasos no traen)', !r.demo);
      expect('sin esqueletos: no esperó ninguna descarga', !r.esqueleto);
      eq('compartir con la URL limpia del slug', r.share, 'https://jeff-aporta.github.io/Jeff-Aporta/blog/prueba-datos/');
    },
  },
  {
    nombre: 'blog W-BLG-06 un enlace ?s= viejo abre el post y queda con URL limpia',
    categoria: 'what',
    async correr({ eq, expect }) {
      const viejo = btoa(JSON.stringify({ v: 'post', p: SLUG })).replace(/=+$/, '');
      await s.page.evaluate((q: string) => { location.href = `${new URL('../../', location.href).pathname}?s=${q}`; }, viejo);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-post')?.shadowRoot?.querySelector('ja-paso'), 30_000);
      const r = await s.page.evaluate(() => ({ url: location.pathname + location.search, titulo: document.title, historial: history.length }), undefined);
      eq('URL limpia', r.url, `/blog/${SLUG}/`);
      expect('título del post', r.titulo.startsWith('Luz y sombra en 2D'));
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
], {
  antes: async () => { s = await abrir(`blog/${SLUG}/`); },
  despues: async () => { await s?.cerrar(); },
});
