// 00.portafolio.test.ts — caso base e2e (Stagehand DETERMINISTA, sin LLM): el portafolio arranca y se
// navega como lo haría un visitante. Caja negra: solo lo que se ve.
//
//   W-PLAT-12  la app arranca sin errores de consola y queda marcada como lista
//   W-PLAT-13  carga perezosa: en el portafolio el blog (sus componentes y el Markdown/código del kit) aún no se ha descargado
//   W-POR-01   la portada muestra el nombre y las cuatro cifras
//   W-POR-02   están todas las secciones de la navegación, en orden
//   W-POR-03   la trayectoria es un grafo de ramas: «Hoy» arriba, sin filtros, hitos de inicio y fin
//   W-POR-04   cada fila de empresa (inicio, fin, periodo, cambio) tiene «Ver detalle», que abre su ficha completa en un modal
//   W-POR-05   cada cifra de la portada abre su lista completa; los enlaces externos abren en otra pestaña
//   W-SPA-02   la pestaña Blog lleva a la lista (blog/), una tarjeta (<ja-link>) abre la guía (blog/<slug>/) sin recargar con TODOS los pasos
//              en un solo flujo, el botón de audio de un paso alterna play/pausa, atrás vuelve y Yo regresa
//   W-SPA-05   «Compartir» está en la barra junto al tema y, sin Web Share, copia la URL limpia de la vista actual
//   W-SPA-03   un enlace directo a una sección (?s= con { sec: 'habilidades' }) aterriza en ella y la conserva
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { abrir, esperar } from '../../scripts/gate/e2e/harness.ts';

let s: Awaited<ReturnType<typeof abrir>>;
const montado = () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-portafolio')?.shadowRoot?.querySelector('ja-hero')?.shadowRoot?.querySelector('h1');

export default definirPruebas([
  {
    nombre: 'portafolio W-PLAT-12 la app arranca lista y sin errores de consola',
    categoria: 'what',
    async correr({ expect }) {
      await esperar(s.page, montado, 30_000).catch(() => undefined);
      expect('marcada como lista', await s.page.evaluate(() => document.documentElement.hasAttribute('data-app-ready'), undefined));
      expect('portada montada', await s.page.evaluate(montado, undefined));
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
  {
    nombre: 'portafolio W-PLAT-13 el blog se carga solo al abrirlo',
    categoria: 'what',
    async correr({ eq }) {
      const definidos = await s.page.evaluate(() => ['ja-portafolio', 'ja-blog', 'ja-post', 'iswc-md-render', 'iswc-code'].filter((t) => !!customElements.get(t)), undefined);
      eq('solo el portafolio está definido', definidos, ['ja-portafolio']);
    },
  },
  {
    nombre: 'portafolio W-POR-01 nombre y cifras en la portada',
    categoria: 'what',
    async correr({ eq }) {
      const datos = await s.page.evaluate(() => {
        const hero = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.querySelector('ja-hero')!.shadowRoot!;
        return { nombre: hero.querySelector('h1')?.textContent?.trim(), cifras: hero.querySelectorAll('.cifras iswc-stat').length };
      }, undefined);
      eq('nombre', datos.nombre, 'Jeffrey Agudelo');
      eq('cifras', datos.cifras, 4);
    },
  },
  {
    nombre: 'portafolio W-POR-02 secciones en orden',
    categoria: 'what',
    async correr({ eq }) {
      const ids = await s.page.evaluate(() => [...document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.querySelectorAll('[id]')].map((e) => e.id), undefined);
      eq('ids', ids, ['inicio', 'perfil', 'trayectoria', 'proyectos', 'habilidades', 'educacion', 'contacto']);
    },
  },
  {
    nombre: 'portafolio W-POR-03 trayectoria como grafo de ramas',
    categoria: 'what',
    async correr({ eq, expect }) {
      const r = await s.page.evaluate(() => {
        const t = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.querySelector('ja-trayectoria')!.shadowRoot!;
        const hitos = [...t.querySelectorAll<HTMLElement>('ja-hito')];
        return {
          tipos: hitos.map((h) => h.dataset.tipo),
          filtros: t.querySelectorAll('iswc-button').length,
          curvas: hitos.reduce((n, h) => n + (h.shadowRoot?.querySelectorAll('.curva').length ?? 0), 0),
        };
      }, undefined);
      eq('primera fila', r.tipos[0], 'actual');
      eq('sin filtros', r.filtros, 0);
      expect('hay inicios y fines', r.tipos.includes('inicio') && r.tipos.includes('fin'));
      expect('cada inicio y fin dibuja su curva (dos en un periodo)', r.curvas === r.tipos.length - 1 + r.tipos.filter((t) => t === 'periodo').length - r.tipos.filter((t) => t === 'cambio' || t === 'sub').length, String(r.curvas));
    },
  },
  {
    nombre: 'portafolio W-POR-04 la trayectoria abre la ficha de cada empresa',
    categoria: 'what',
    async correr({ eq, expect }) {
      const r = await s.page.evaluate(() => {
        const t = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.querySelector('ja-trayectoria')!.shadowRoot!;
        const filas = [...t.querySelectorAll('ja-hito')].map((h) => h.shadowRoot!).filter((r) => r.querySelector('.tarjeta:not(.actual):not(.sub)'));
        const botones = filas.map((r) => r.querySelector('.acciones .ver')).filter(Boolean) as HTMLElement[];
        const inicios = filas.filter((r) => r.querySelector('.tarjeta.inicio .acciones .ver')).length;
        botones[0]!.click();
        const dialogo = t.querySelector('iswc-dialog') as HTMLElement & { open: boolean };
        const empleo = dialogo.querySelector('ja-empleo');
        return { filas: filas.length, botones: botones.length, inicios, abierto: dialogo.open, ficha: !!empleo && !empleo.shadowRoot!.querySelector('.cuerpo')!.hasAttribute('hidden') };
      }, undefined);
      eq('«Ver detalle» en todas las filas de empresa', r.botones, r.filas);
      expect('también en las filas de inicio', r.inicios > 0);
      expect('el modal se abre', r.abierto);
      expect('con la ficha abierta', r.ficha);
      await s.page.evaluate(() => {
        const t = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.querySelector('ja-trayectoria')!.shadowRoot!;
        (t.querySelector('iswc-dialog') as HTMLElement & { open: boolean }).open = false;
      }, undefined);
    },
  },
  {
    nombre: 'portafolio W-POR-05 las cifras abren su lista y los enlaces externos van a otra pestaña',
    categoria: 'what',
    async correr({ eq }) {
      const r = await s.page.evaluate(() => {
        const portafolio = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!;
        const hero = portafolio.querySelector('ja-hero')!.shadowRoot!;
        const filas: number[] = [];
        for (const b of hero.querySelectorAll('.cifra')) {
          (b as HTMLElement).click();
          filas.push(hero.querySelectorAll('.detalle li, .detalle iswc-tag').length);
          (hero.querySelector('iswc-dialog') as HTMLElement & { open: boolean }).open = false;
        }
        const sueltos: string[] = [];
        const recorrer = (raiz: ParentNode) => raiz.querySelectorAll('*').forEach((e) => {
          const href = e.getAttribute('href') ?? '';
          if ((e.localName === 'a' || e.localName === 'iswc-button') && /^https?:|\.pdf$/.test(href) && e.getAttribute('target') !== '_blank') sueltos.push(href);
          if (e.shadowRoot) recorrer(e.shadowRoot);
        });
        recorrer(document);
        return { conLista: filas.filter((n) => n > 0).length, sueltos };
      }, undefined);
      eq('las cuatro cifras tienen lista', r.conLista, 4);
      eq('enlaces externos sin target _blank', r.sueltos, []);
    },
  },
  {
    nombre: 'portafolio W-SPA-02 navegación SPA entre portafolio, blog y publicación',
    categoria: 'what',
    async correr({ eq, expect }) {
      const vista = () => s.page.evaluate(() => document.querySelector('ja-app')!.shadowRoot!.querySelector('main')!.firstElementChild?.localName ?? '', undefined);
      const ruta = () => s.page.evaluate(() => location.pathname + location.search, undefined);
      // Una marca en la ventana: si la página se recargara, se perdería.
      await s.page.evaluate(() => { (globalThis as { __sinRecarga?: number }).__sinRecarga = 1; }, undefined);
      // Las pestañas de la barra son enlaces a URL limpias: el router propio los navega sin recargar.
      await s.page.evaluate(() => {
        const nav = document.querySelector('ja-app')!.shadowRoot!.querySelector('.pestanas')!.shadowRoot!;
        ([...nav.querySelectorAll('a')].find((a) => a.textContent?.includes('Blog')) as HTMLAnchorElement).click();
      }, undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-blog')?.shadowRoot?.querySelector('ja-seccion'));
      eq('lista', await vista(), 'ja-blog');
      eq('URL limpia de la lista', await ruta(), '/blog/');
      // La tarjeta es un <ja-link>: su <a> interno lleva ?s= y el router lo navega sin recargar.
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-blog')?.shadowRoot?.querySelector('ja-post-tarjeta')?.shadowRoot?.querySelector('ja-link')?.shadowRoot?.querySelector('a'));
      await s.page.evaluate(() => {
        const blog = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-blog')!.shadowRoot!;
        (blog.querySelector('ja-post-tarjeta')!.shadowRoot!.querySelector('ja-link')!.shadowRoot!.querySelector('a') as HTMLAnchorElement).click();
      }, undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-post')?.shadowRoot?.querySelector('h1'));
      eq('publicación', await vista(), 'ja-post');
      eq('URL limpia de la publicación', await ruta(), '/blog/luz-y-sombra-2d/');
      eq('sin recarga', await s.page.evaluate(() => (globalThis as { __sinRecarga?: number }).__sinRecarga, undefined), 1);
      expect('título de la pestaña', (await s.page.evaluate(() => document.title, undefined)).startsWith('Luz y sombra en 2D'));
      await esperar(s.page, () => (document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-post')?.shadowRoot?.querySelectorAll('ja-paso').length ?? 0) >= 10);
      const guia = await s.page.evaluate(() => {
        const post = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-post')!.shadowRoot!;
        const pasos = [...post.querySelectorAll('ja-paso')];
        return {
          pasos: pasos.length,
          indice: post.querySelectorAll('.indice a').length,
          titulos: pasos.map((p) => p.shadowRoot?.querySelector('h2')?.textContent ?? '').filter(Boolean).length,
          demos: pasos.filter((p) => p.shadowRoot?.querySelector('ja-luz-demo')).length,
          paginacion: !!post.querySelector('.siguiente, .anterior, [data-actual]'),
          audios: pasos.filter((p) => p.shadowRoot?.querySelector('.audio')).length,
        };
      }, undefined);
      expect('todos los pasos en el DOM, en un solo flujo', guia.pasos >= 10 && guia.titulos === guia.pasos, JSON.stringify(guia));
      eq('índice compacto con un ancla por paso', guia.indice, guia.pasos);
      expect('las demos van dentro de su paso', guia.demos >= 9, String(guia.demos));
      expect('sin paginación', !guia.paginacion);
      eq('un botón de audio por paso', guia.audios, guia.pasos);
      // Audio: play() se simula (sin gesto real el navegador lo rechazaría); el estado se refleja en el botón.
      const audio = await s.page.evaluate(() => {
        HTMLMediaElement.prototype.play = () => Promise.resolve();
        const pasos = [...document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-post')!.shadowRoot!.querySelectorAll('ja-paso')];
        const boton = (i: number) => pasos[i]!.shadowRoot!.querySelector('.audio') as HTMLElement;
        const antes = boton(0).getAttribute('aria-label');
        boton(0).click();
        const sonando = boton(0).getAttribute('aria-label');
        boton(1).click();
        const exclusivo = [pasos[0]!.hasAttribute('data-sonando'), pasos[1]!.hasAttribute('data-sonando')];
        boton(1).click();
        return { antes, sonando, exclusivo, pausado: boton(1).getAttribute('aria-label') };
      }, undefined);
      eq('reposo', audio.antes, 'Reproducir la narración del paso 1');
      eq('al pulsar pasa a pausar', audio.sonando, 'Pausar la narración del paso 1');
      eq('reproducir otro paso detiene el anterior', audio.exclusivo, [false, true]);
      eq('volver a pulsar pausa', audio.pausado, 'Reproducir la narración del paso 2');
      await s.page.evaluate(() => history.back(), undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-blog'));
      eq('atrás vuelve a la lista', await vista(), 'ja-blog');
      eq('atrás deja la URL de la lista', await ruta(), '/blog/');
      await s.page.evaluate(() => {
        const nav = document.querySelector('ja-app')!.shadowRoot!.querySelector('.pestanas')!.shadowRoot!;
        ([...nav.querySelectorAll('a')].find((a) => a.textContent?.includes('Yo')) as HTMLAnchorElement).click();
      }, undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-portafolio'));
      eq('regresa al portafolio', await vista(), 'ja-portafolio');
      eq('la portada vuelve a la raíz', await ruta(), '/');
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
  {
    nombre: 'portafolio W-SPA-05 Compartir en la barra copia la URL limpia de la vista',
    categoria: 'what',
    async correr({ eq, expect }) {
      const r = await s.page.evaluate(async () => {
        const app = document.querySelector('ja-app')!.shadowRoot!;
        const acciones = app.querySelector('.acciones')!;
        const compartir = acciones.querySelector('iswc-share-button') as HTMLElement;
        // Sin Web Share (escritorio): el kit copia al portapapeles; se captura lo copiado.
        delete (navigator as { share?: unknown }).share;
        let copiado = '';
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t: string) => { copiado = t; return Promise.resolve(); } }, configurable: true });
        let how = '';
        compartir.addEventListener('iswc-share', (ev) => { how = (ev as CustomEvent<{ how: string }>).detail.how; });
        (compartir.shadowRoot!.querySelector('iswc-button')!.shadowRoot!.querySelector('button, a') as HTMLElement).click();
        await new Promise((r) => setTimeout(r, 500));
        return { juntoAlTema: !!acciones.querySelector('iswc-theme-toggle') && acciones.children.length === 2, etiqueta: compartir.getAttribute('aria-label'), url: compartir.getAttribute('url'), copiado, how, dentroDelPost: !!app.querySelector('ja-post')?.shadowRoot?.querySelector('iswc-share-button') };
      }, undefined);
      expect('el botón está en la barra junto al tema', r.juntoAlTema);
      eq('aria-label', r.etiqueta, 'Compartir esta página');
      eq('URL limpia del portafolio', r.url, 'https://jeff-aporta.github.io/Jeff-Aporta/');
      eq('copiado al portapapeles', r.copiado, 'https://jeff-aporta.github.io/Jeff-Aporta/');
      eq('el kit informa que copió', r.how, 'copied');
      expect('ya no hay Compartir dentro del post', !r.dentroDelPost);
    },
  },
  {
    nombre: 'portafolio W-SPA-03 enlace directo a una sección',
    categoria: 'what',
    async correr({ eq, expect }) {
      // Carga nueva del documento (query distinta), como quien abre el enlace compartido.
      await s.page.evaluate(() => { location.href = `${location.pathname}?directo=1&s=${btoa(JSON.stringify({ sec: 'habilidades' })).replace(/=+$/, '')}`; }, undefined);
      await esperar(s.page, () => !!document.querySelector('ja-app')?.shadowRoot?.querySelector('ja-portafolio')?.shadowRoot?.getElementById('habilidades'), 20_000);
      await new Promise((r) => setTimeout(r, 3000));
      const r = await s.page.evaluate(() => {
        const sec = document.querySelector('ja-app')!.shadowRoot!.querySelector('ja-portafolio')!.shadowRoot!.getElementById('habilidades')!;
        const crudo = new URLSearchParams(location.search).get('s') ?? '';
        return { top: Math.round(sec.getBoundingClientRect().top), estado: JSON.parse(atob(crudo.replace(/-/g, '+').replace(/_/g, '/'))) };
      }, undefined);
      eq('conserva la sección', r.estado, { sec: 'habilidades' });
      expect('la sección queda arriba de la ventana', r.top >= 0 && r.top <= 200, String(r.top));
    },
  },
], {
  antes: async () => { s = await abrir('index.html'); },
  despues: async () => { await s?.cerrar(); },
});
