/**
 * all.ts — bundle de la vista `portafolio` → `dist/cdn/jaPortafolio.min.js`. Hijos antes que el shell.
 *
 * El núcleo (base, schemas, contenido y componentes transversales) lo importa: el build lo deja externo,
 * así el navegador lo descarga una vez y lo comparte con el shell y las demás vistas.
 */
import '../../../src/js/base/componente.js';

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
