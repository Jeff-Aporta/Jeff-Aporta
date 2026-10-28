/**
 * all.ts — barril de compatibilidad → `dist/cdn/all.min.js` (todos los componentes en un módulo).
 * La carga normal es el registrador (`jaLoader.min.js`); este bundle es para hosts que
 * quieren un solo <script>. Fija la raíz de hojas: cada tag busca su CSS en su carpeta (kit-tags).
 */
import { setCssBase } from '../../base/componente.js';

setCssBase(new URL('./', import.meta.url).href);

await import('./ja-forma.js');
await import('./ja-boton-icono.js');
await import('./ja-marca.js');
await import('./ja-insignia.js');
await import('./ja-rasgo.js');
await import('./ja-lista.js');
await import('./ja-ilustracion.js');
await import('./ja-seccion.js');
await import('../../../../view/portafolio/components/all.js');
await import('../../../../view/blog/components/all.js');
await import('./ja-app.js');
