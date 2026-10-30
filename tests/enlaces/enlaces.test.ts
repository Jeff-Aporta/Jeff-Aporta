// enlaces.test.ts — cálculo puro del href de <ja-link> (candidato a iswc-link), sin navegador.
//
//   W-ENL-01  href literal gana; `state` → `<base>?<param>=<b64url(JSON)>`; estado vacío deja la base limpia
//   W-ENL-02  `base` relativa se resuelve contra el documento; `data-spa-base` es la base por defecto; `param` propio
//   W-ENL-03  `merge` combina con el estado actual de la URL; `current` compara base y estado normalizado; `_blank` fuerza `noopener`
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { esActual, hrefEnlace, relAuto } from '../../src/js/base/enlaces.ts';

const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const spa = new URL('https://jeff-aporta.github.io/Jeff-Aporta/');
const pagina = new URL('https://jeff-aporta.github.io/Jeff-Aporta/blog/luz-y-sombra-2d/');

export default definirPruebas([
  {
    nombre: 'enlaces W-ENL-01 href literal y state en ?s=',
    categoria: 'what',
    correr({ eq }) {
      eq('href literal gana', hrefEnlace({ href: 'https://github.com/Jeff-Aporta', state: { v: 'blog' }, actual: spa }), 'https://github.com/Jeff-Aporta');
      eq('state en la página actual', hrefEnlace({ state: { v: 'blog' }, actual: spa }), `/Jeff-Aporta/?s=${b64({ v: 'blog' })}`);
      eq('estado vacío deja la base limpia', hrefEnlace({ state: {}, actual: spa }), '/Jeff-Aporta/');
      eq('nulos se descartan', hrefEnlace({ state: { sec: null, v: 'blog' }, actual: spa }), `/Jeff-Aporta/?s=${b64({ v: 'blog' })}`);
      eq('la base ignora query y hash actuales', hrefEnlace({ state: { sec: 'perfil' }, actual: new URL(`${spa.href}?s=xyz#contacto`) }), `/Jeff-Aporta/?s=${b64({ sec: 'perfil' })}`);
    },
  },
  {
    nombre: 'enlaces W-ENL-02 base relativa, data-spa-base y param',
    categoria: 'what',
    correr({ eq }) {
      eq('base relativa desde blog/<slug>/', hrefEnlace({ state: { v: 'blog' }, base: '../../', actual: pagina, baseDoc: pagina.href }), `/Jeff-Aporta/?s=${b64({ v: 'blog' })}`);
      eq('data-spa-base como base por defecto', hrefEnlace({ state: { sec: 'contacto' }, spaBase: '../../', actual: pagina, baseDoc: pagina.href }), `/Jeff-Aporta/?s=${b64({ sec: 'contacto' })}`);
      eq('base explícita gana sobre data-spa-base', hrefEnlace({ state: {}, base: '../', spaBase: '../../', actual: pagina, baseDoc: pagina.href }), '/Jeff-Aporta/blog/');
      eq('base absoluta en otro origen → href absoluto', hrefEnlace({ state: { v: 'blog' }, base: 'https://otro.test/app/', actual: pagina }), `https://otro.test/app/?s=${b64({ v: 'blog' })}`);
      eq('param propio', hrefEnlace({ state: { p: 1 }, param: 'estado', actual: spa }), `/Jeff-Aporta/?estado=${b64({ p: 1 })}`);
    },
  },
  {
    nombre: 'enlaces W-ENL-03 merge, current y rel automático',
    categoria: 'what',
    correr({ eq, expect }) {
      const actual = new URL(`${spa.href}?s=${b64({ theme: 'dark', sec: 'perfil' })}`);
      eq('merge conserva lo demás y pisa lo dado', hrefEnlace({ state: { sec: 'contacto' }, merge: true, actual }), `/Jeff-Aporta/?s=${b64({ theme: 'dark', sec: 'contacto' })}`);
      eq('sin merge reemplaza', hrefEnlace({ state: { sec: 'contacto' }, actual }), `/Jeff-Aporta/?s=${b64({ sec: 'contacto' })}`);
      eq('merge con estado actual dado', hrefEnlace({ state: { b: 2 }, merge: true, estadoActual: { a: 1 }, actual: spa }), `/Jeff-Aporta/?s=${b64({ a: 1, b: 2 })}`);
      expect('current: misma base y mismo estado', esActual(`/Jeff-Aporta/?s=${b64({ sec: 'perfil', theme: 'dark' })}`, actual));
      expect('current: index.html equivale a la carpeta', esActual('/Jeff-Aporta/index.html', spa));
      expect('no current: otro estado', !esActual(`/Jeff-Aporta/?s=${b64({ sec: 'contacto' })}`, actual));
      expect('no current: otra base', !esActual('/Jeff-Aporta/blog/', spa));
      eq('_blank añade noopener', relAuto('_blank', ''), 'noopener');
      eq('_blank conserva rel y añade noopener', relAuto('_blank', 'nofollow'), 'nofollow noopener');
      eq('_blank ya con noopener no duplica', relAuto('_blank', 'noopener noreferrer'), 'noopener noreferrer');
      eq('sin _blank no toca rel', relAuto('', 'me'), 'me');
    },
  },
]);
