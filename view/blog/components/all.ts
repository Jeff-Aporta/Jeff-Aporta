/**
 * all.ts — bundle de la vista `blog` → `dist/cdn/jaBlog.min.js`. Hijos antes que el shell.
 *
 * El núcleo (base, schemas, contenido y componentes transversales) lo importa: el build lo deja externo,
 * así el navegador lo descarga una vez y lo comparte con el shell y las demás vistas.
 */
import '../../../src/js/base/componente.js';

await import('./ja-luz-demo.js');
await import('./ja-bloque.js');
await import('./ja-paso.js');
await import('./ja-banner-blog.js');
await import('./ja-post-tarjeta.js');
await import('./ja-post.js');
await import('./ja-blog.js');
