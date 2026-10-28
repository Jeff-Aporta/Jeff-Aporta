/** all.ts — barril de la vista `portafolio` → `dist/cdn/view/portafolio/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./ja-video.js');
await import('./ja-barra-uso.js');
await import('./ja-estudio.js');
await import('./ja-canal.js');
await import('./ja-hito.js');
await import('./ja-empleo.js');
await import('./ja-proyecto.js');
await import('./ja-hero.js');
await import('./ja-perfil.js');
await import('./ja-trayectoria.js');
await import('./ja-proyectos.js');
await import('./ja-habilidades.js');
await import('./ja-educacion.js');
await import('./ja-contacto.js');
await import('./ja-portafolio.js');
