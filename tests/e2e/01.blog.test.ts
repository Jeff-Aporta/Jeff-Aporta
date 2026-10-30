// 01.blog.test.ts — páginas especializadas del blog (Stagehand DETERMINISTA, sin LLM). Caja negra.
//
//   W-BLG-04  blog/<slug>/ abre directo: arranca sin errores de consola, monta <ja-pagina> y <ja-post> con ese slug
//             (datos desde post.json, todos los pasos en un flujo), y «Compartir» de la barra lleva la URL canónica limpia
//   W-BLG-05  <ja-post> con `datos` por prop pinta la guía sin red (todos los pasos, índice, botón de audio)
//   W-BLG-07  los <ja-link> de la página (marca, Yo, Blog, «Todas las publicaciones») resuelven al SPA de la raíz
//             y «Todas las publicaciones» carga el SPA mostrando <ja-blog>
//   W-BLG-06  un enlace ?s= viejo de un post abre la publicación y la URL queda limpia (replaceState)
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { abrir, esperar } from '../../scripts/gate/e2e/harness.ts';

let s: Awaited<ReturnType<typeof abrir>>;
const SLUG = 'luz-y-sombra-2d';
const URL_PUBLICA = `https://jeff-aporta.github.io/Jeff-Aporta/blog/${SLUG}/`;
const montado = () => !!document.querySelector('ja-pagina')?.shadowRoot?.querySelector('ja-pie') && (document.querySelector('ja-post')?.shadowRoot?.querySelectorAll('ja-paso').length ?? 0) >= 10 && !!document.querySelector('ja-post')?.shadowRoot?.querySelector('ja-paso')?.shadowRoot?.querySelector('h2');

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
        const acciones = pagina.querySelector('.acciones')!;
        return {
          titulo: document.title,
          slug: post.props.slug,
          datos: post.props.datos?.slug ?? null,
          h1: sr.querySelector('h1')?.textContent ?? '',
          pasos: sr.querySelectorAll('ja-paso').length,
          demos: [...sr.querySelectorAll('ja-paso')].filter((p) => p.shadowRoot?.querySelector('ja-luz-demo')).length,
          paginacion: !!sr.querySelector('.siguiente, .anterior, [data-actual]'),
          share: acciones.querySelector('iswc-share-button')?.getAttribute('url'),
          shareJuntoAlTema: !!acciones.querySelector('iswc-theme-toggle') && acciones.children.length === 2,
          activa: pagina.querySelector('.vista[data-activa]')?.textContent?.trim(),
          sinApp: !document.querySelector('ja-app'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          spaBase: document.documentElement.dataset.spaBase,
        };
      }, SLUG);
      expect('título propio', r.titulo.startsWith('Luz y sombra en 2D'));
      eq('slug por atributo', r.slug, SLUG);
      eq('datos cargados de post.json', r.datos, SLUG);
      eq('título de la guía', r.h1, 'Luz y sombra en 2D');
      expect('todos los pasos en un flujo', r.pasos >= 10, String(r.pasos));
      expect('demos dentro de sus pasos', r.demos >= 9, String(r.demos));
      expect('sin paginación', !r.paginacion);
      eq('Compartir (kit) en la barra con la URL limpia', r.share, URL_PUBLICA);
      expect('Compartir junto al tema', r.shareJuntoAlTema);
      eq('Blog marcado en la barra', r.activa, 'Blog');
      expect('sin el shell de la SPA', r.sinApp);
      eq('canonical', r.canonical, URL_PUBLICA);
      eq('data-spa-base hacia la raíz', r.spaBase, '../../');
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
        document.body.append(el);
        const sr = el.shadowRoot!;
        const pasos = [...sr.querySelectorAll('ja-paso')];
        const r = {
          h1: sr.querySelector('h1')?.textContent,
          pasos: pasos.length,
          indice: sr.querySelectorAll('.indice a').length,
          titulos: pasos.map((p) => p.shadowRoot?.querySelector('h2')?.textContent?.trim()),
          audios: pasos.filter((p) => p.shadowRoot?.querySelector('.audio')).length,
          creditos: !!pasos[1]?.shadowRoot?.querySelector('.creditos'),
          esqueleto: !!sr.querySelector('iswc-skeleton'),
        };
        el.remove();
        return r;
      }, undefined);
      eq('título', r.h1, 'Guía de prueba');
      eq('dos pasos', r.pasos, 2);
      eq('índice con dos anclas', r.indice, 2);
      eq('títulos de los pasos', r.titulos, ['Uno', 'Dos']);
      eq('botón de audio en cada paso', r.audios, 2);
      expect('créditos en el último paso', r.creditos);
      expect('sin esqueletos: no esperó ninguna descarga', !r.esqueleto);
    },
  },
  {
    nombre: 'blog W-BLG-07 los <ja-link> de la página llevan al SPA y «Todas las publicaciones» abre la lista',
    categoria: 'what',
    async correr({ eq, expect }) {
      const enlaces = await s.page.evaluate(() => {
        const pagina = document.querySelector('ja-pagina')!.shadowRoot!;
        const href = (el: Element | null) => (el as (HTMLElement & { href?: string }) | null)?.href ?? null;
        const vistas = [...pagina.querySelectorAll('.vista')];
        return {
          marca: href(pagina.querySelector('.marca')),
          vistas: vistas.map((v) => ({ texto: v.textContent?.trim(), href: href(v), current: v.hasAttribute('data-activa') })),
          volver: href(document.querySelector('ja-post')!.shadowRoot!.querySelector('.volver')),
        };
      }, undefined);
      const raiz = new URL('../../', await s.page.evaluate(() => location.href, undefined)).pathname;
      eq('la marca va a la raíz del SPA', enlaces.marca, raiz);
      eq('Yo va a la raíz del SPA', enlaces.vistas[0]?.href, raiz);
      expect('Blog va al SPA con ?s={v:blog}', enlaces.vistas[1]?.href === `${raiz}?s=${btoa(JSON.stringify({ v: 'blog' })).replace(/=+$/, '')}`, String(enlaces.vistas[1]?.href));
      eq('Blog marcado', enlaces.vistas[1]?.current, true);
      eq('«Todas las publicaciones» igual que Blog', enlaces.volver, enlaces.vistas[1]?.href);
      // Clic real en el <a> interno del botón: navegación normal (no hay SPA aquí) que carga index.html.
      await s.page.evaluate(() => {
        const volver = document.querySelector('ja-post')!.shadowRoot!.querySelector('.volver')!.shadowRoot!.querySelector('iswc-button')!.shadowRoot!.querySelector('a') as HTMLAnchorElement;
        volver.click();
      }, undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-blog')?.shadowRoot?.querySelector('ja-post-tarjeta'), 30_000);
      const r = await s.page.evaluate(() => ({ url: location.pathname + location.search, vista: document.querySelector('ja-app')!.shadowRoot!.querySelector('main')!.firstElementChild?.localName, titulo: document.title }), undefined);
      eq('aterriza en el SPA con la lista', r.vista, 'ja-blog');
      eq('y la URL queda limpia', r.url, `${raiz}blog/`);
      expect('título de la lista', r.titulo.startsWith('Blog'));
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
  {
    nombre: 'blog W-BLG-06 un enlace ?s= viejo abre el post y queda con URL limpia',
    categoria: 'what',
    async correr({ eq, expect }) {
      const viejo = btoa(JSON.stringify({ v: 'post', p: SLUG })).replace(/=+$/, '');
      await s.page.evaluate((q: string) => { location.href = `${new URL('../', location.href).pathname}?s=${q}`; }, viejo);
      await esperar(s.page, () => (document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-post')?.shadowRoot?.querySelectorAll('ja-paso').length ?? 0) >= 10, 30_000);
      const r = await s.page.evaluate(() => ({ url: location.pathname + location.search, titulo: document.title }), undefined);
      eq('URL limpia', r.url, `/blog/${SLUG}/`);
      expect('título del post', r.titulo.startsWith('Luz y sombra en 2D'));
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
], {
  antes: async () => { s = await abrir(`blog/${SLUG}/`); },
  despues: async () => { await s?.cerrar(); },
});
