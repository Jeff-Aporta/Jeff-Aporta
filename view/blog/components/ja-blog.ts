/**
 * <ja-blog> — vista del blog: el banner animado (`<ja-banner-blog>`), el encabezado y una
 * `<ja-post-tarjeta>` por publicación, de la más reciente a la más antigua. Todo el contenido está quemado en `src/js/contenido/blog/`.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-seccion.js';
import './ja-banner-blog.js';
import './ja-post-tarjeta.js';

const JaBlog = crearComponente<SinProps>(import.meta.url, 'ja-blog', {}, (root) => {
  root.append(pieza('ja-banner-blog', {}));
  const lista = [...contenido.blog].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const cuerpo = html`<div class="lista" part="lista">${lista.map((p) => pieza('ja-post-tarjeta', { slug: p.slug }))}</div>`;
  const vacio = html`<iswc-callout tone="info"><strong slot="title">Pronto</strong>Aún no hay publicaciones.</iswc-callout>`;
  root.append(pieza('ja-seccion', {
    cejilla: 'Blog',
    titulo: 'Guías paso a paso',
    entrada: 'Lo que voy aprendiendo, explicado con mi voz y con demos que puedes probar.',
    fondo: 'base',
    ilustracion: null,
  }, {}, lista.length ? cuerpo : vacio));
});

define('ja-blog', JaBlog);
