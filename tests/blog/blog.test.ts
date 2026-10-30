// blog.test.ts — blog quemado, rutas de la SPA y geometría del post de luz (sin navegador).
//
//   W-BLG-01  cada publicación cumple el schema, tiene slug único y su portada existe
//   W-BLG-02  el post «Luz y sombra en 2D» es una guía cuyas demos cubren los pasos de luz 0 a 8
//   W-BLG-03  cada paso de cada guía tiene su narración en audio (voz clonada) publicada
//   W-SPA-01  las rutas van y vuelven: portafolio (sección en ?s=), blog/ y blog/<slug>/ limpias; los ?s= viejos del blog se reconocen
//   W-LUZ-01  la intersección rayo-segmento acierta, descarta paralelos y lo que queda detrás del rayo
//   W-LUZ-02  el polígono de visión queda dentro de la escena y en orden de ángulo
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { PublicacionSchema } from '../../src/js/consts/schemas/contenido.schemas.ts';
import { contenido } from '../../src/js/contenido/index.ts';
import { audioPaso } from '../../src/js/contenido/derivados.ts';
import { estadoDe, rutaDe, rutaDeUrl, rutaRelativa } from '../../src/js/base/rutas.ts';
import { ALTO, ANCHO, interseccion, poligonoVision } from '../../view/blog/utils/luz.ts';

const RAIZ = Deno.cwd();

export default definirPruebas([
  {
    nombre: 'blog W-BLG-01 publicaciones válidas con portada',
    categoria: 'what',
    correr({ expect }) {
      expect('hay publicaciones', contenido.blog.length > 0);
      expect('slugs únicos', new Set(contenido.blog.map((p) => p.slug)).size === contenido.blog.length);
      for (const p of contenido.blog) {
        expect(`${p.slug} schema`, PublicacionSchema.safeParse(p).success);
        expect(`${p.slug} portada`, existsSync(join(RAIZ, p.portada.src)));
      }
    },
  },
  {
    nombre: 'blog W-BLG-02 las demos de la guía de luz cubren los pasos 0 a 8',
    categoria: 'what',
    correr({ eq, expect }) {
      const post = contenido.blog.find((p) => p.slug === 'luz-y-sombra-2d');
      expect('existe', !!post);
      const pasos = new Set(post!.pasos.flatMap((p) => (p.demo ? [p.demo.paso] : [])));
      eq('pasos', [...pasos].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      for (const f of ['fondo.png', 'frente.png']) expect(f, existsSync(join(RAIZ, 'assets/blog/luz-y-sombra', f)));
    },
  },
  {
    nombre: 'blog W-BLG-03 cada paso tiene su narración',
    categoria: 'what',
    correr({ expect }) {
      for (const p of contenido.blog) {
        p.pasos.forEach((paso, i) => {
          expect(`${p.slug} paso ${i} narración`, paso.narracion.length > 40);
          expect(`${p.slug} paso ${i} audio`, existsSync(join(RAIZ, audioPaso(p, i))));
        });
      }
    },
  },
  {
    nombre: 'blog W-SPA-01 rutas limpias del blog y ?s= del portafolio',
    categoria: 'what',
    correr({ eq }) {
      const raiz = '/Jeff-Aporta/';
      const url = (rel: string) => new URL(rel, `https://jeff-aporta.github.io${raiz}`);
      eq('vacío', rutaDe({}), { vista: 'portafolio', seccion: 'inicio' });
      eq('sección', rutaDe({ sec: 'perfil', theme: 'dark' }), { vista: 'portafolio', seccion: 'perfil' });
      eq('?s= viejo del blog', rutaDe({ v: 'blog' }), { vista: 'blog' });
      eq('?s= viejo de un post', rutaDe({ v: 'post', p: 'luz-y-sombra-2d' }), { vista: 'post', slug: 'luz-y-sombra-2d' });
      eq('post sin slug es la portada', rutaDe({ v: 'post' }), { vista: 'portafolio', seccion: 'inicio' });
      eq('la portada no ensucia la URL', estadoDe({ vista: 'portafolio', seccion: 'inicio' }), {});
      eq('la sección va en ?s=', estadoDe({ vista: 'portafolio', seccion: 'perfil' }), { sec: 'perfil' });
      eq('el blog no lleva ?s=', estadoDe({ vista: 'blog' }), {});
      eq('pathname de la portada', rutaRelativa({ vista: 'portafolio', seccion: 'inicio' }), '');
      eq('pathname del blog', rutaRelativa({ vista: 'blog' }), 'blog/');
      eq('pathname de un post', rutaRelativa({ vista: 'post', slug: 'luz-y-sombra-2d' }), 'blog/luz-y-sombra-2d/');
      for (const r of [{ vista: 'portafolio', seccion: 'inicio' }, { vista: 'portafolio', seccion: 'perfil' }, { vista: 'blog' }, { vista: 'post', slug: 'luz-y-sombra-2d' }] as const) {
        const u = url(rutaRelativa(r));
        const estado = estadoDe(r);
        if (Object.keys(estado).length) u.searchParams.set('s', btoa(JSON.stringify(estado)).replace(/=+$/, ''));
        eq(`ida y vuelta ${u.pathname}${u.search}`, rutaDeUrl(u, raiz), r);
      }
      eq('blog sin barra final', rutaDeUrl(url('blog'), raiz), { vista: 'blog' });
      eq('post con index.html', rutaDeUrl(url('blog/luz-y-sombra-2d/index.html'), raiz), { vista: 'post', slug: 'luz-y-sombra-2d' });
      eq('index.html de la raíz', rutaDeUrl(url('index.html'), raiz), { vista: 'portafolio', seccion: 'inicio' });
      eq('?s= viejo en la raíz', rutaDeUrl(url(`?s=${btoa(JSON.stringify({ v: 'post', p: 'luz-y-sombra-2d' })).replace(/=+$/, '')}`), raiz), { vista: 'post', slug: 'luz-y-sombra-2d' });
      eq('un asset no es ruta', rutaDeUrl(url('assets/img/og/portada.png'), raiz), null);
      eq('view/ no es ruta', rutaDeUrl(url('view/portafolio/index.html'), raiz), null);
      eq('otra raíz no es ruta', rutaDeUrl(new URL('https://jeff-aporta.github.io/otro/blog/'), raiz), null);
    },
  },
  {
    nombre: 'blog W-LUZ-01 intersección rayo-segmento',
    categoria: 'what',
    correr({ eq, expect }) {
      const pared = { a: { x: 10, y: -5 }, b: { x: 10, y: 5 } };
      const c = interseccion({ a: { x: 0, y: 0 }, b: { x: 1, y: 0 } }, pared);
      eq('choca en (10, 0)', c && [c.x, c.y], [10, 0]);
      expect('paralelo', interseccion({ a: { x: 0, y: 0 }, b: { x: 0, y: 1 } }, pared) === null);
      expect('detrás del rayo', interseccion({ a: { x: 0, y: 0 }, b: { x: -1, y: 0 } }, pared) === null);
      expect('fuera del segmento', interseccion({ a: { x: 0, y: 0 }, b: { x: 1, y: 2 } }, pared) === null);
    },
  },
  {
    nombre: 'blog W-LUZ-02 polígono de visión',
    categoria: 'what',
    correr({ expect }) {
      const poli = poligonoVision({ x: 420, y: 180 });
      expect('tiene puntos', poli.length > 10);
      expect('dentro de la escena', poli.every((p) => p.x >= -0.01 && p.x <= ANCHO + 0.01 && p.y >= -0.01 && p.y <= ALTO + 0.01));
      expect('ordenado por ángulo', poli.every((p, i) => i === 0 || poli[i - 1]!.angulo <= p.angulo));
    },
  },
]);
