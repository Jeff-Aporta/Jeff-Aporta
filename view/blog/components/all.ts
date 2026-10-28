/** all.ts — barril de la vista `blog` → `dist/cdn/view/blog/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./ja-luz-demo.js');
await import('./ja-bloque.js');
await import('./ja-paso.js');
await import('./ja-banner-blog.js');
await import('./ja-post-tarjeta.js');
await import('./ja-post.js');
await import('./ja-blog.js');
