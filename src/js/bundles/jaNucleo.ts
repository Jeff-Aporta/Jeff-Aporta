/**
 * jaNucleo.ts — NÚCLEO común de la app: la base de los componentes, los schemas, el contenido, las
 * rutas y los componentes TRANSVERSALES (los que usan el shell y las vistas).
 *
 * Se publica APARTE (`dist/cdn/jaNucleo.min.js`): los bundles (el shell y cada vista) lo importan,
 * así el navegador lo descarga UNA vez y lo comparte —sin duplicar zod, el contenido ni los
 * componentes transversales en cada bundle—. El build lo marca externo en el resto de bundles
 * (plugin `nucleo-externo`).
 *
 * Fija además la base de las hojas (`dist/cdn/`): cada componente busca su CSS en su carpeta
 * (`js/components/ja/`, `view/<vista>/components/`), no junto al bundle. Por eso los componentes
 * se importan DINÁMICAMENTE (después de fijarla): los imports estáticos se evalúan antes del cuerpo.
 */
import { setCssBase } from '../base/componente.js';

setCssBase(new URL('./', import.meta.url).href);

export * from '../base/componente.js';
export * from '../base/enlaces.js';
export * from '../base/gestos.js';
export * from '../base/paralaje.js';
export * from '../base/props-registro.js';
export * from '../base/rutas.js';
export * from '../base/zod.js';
export * from '../consts/schemas/componentes.schemas.js';
export * from '../consts/schemas/contenido.schemas.js';
export * from '../consts/schemas/demo.schemas.js';
export * from '../consts/schemas/loader.schemas.js';
export * from '../consts/schemas/luz.schemas.js';
export * from '../contenido/derivados.js';
export { contenido, rutaSitio } from '../contenido/index.js';
export * from '../kit-tags.js';

// Transversales: los definen el núcleo (una sola copia) y los usan el shell y las vistas.
await import('../components/ja/ja-forma.js');
await import('../components/ja/ja-boton-icono.js');
await import('../components/ja/ja-insignia.js');
await import('../components/ja/ja-rasgo.js');
await import('../components/ja/ja-lista.js');
await import('../components/ja/ja-ilustracion.js');
await import('../components/ja/ja-seccion.js');
await import('../components/ja/ja-link.js');
await import('../components/ja/ja-marca.js');
await import('../components/ja/ja-pie.js');
await import('../components/ja/ja-pagina.js');