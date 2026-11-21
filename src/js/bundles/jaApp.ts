/**
 * jaApp.ts — bundle del SHELL de la SPA: el `<ja-app>` (la barra, el enrutador y la vista activa).
 * Es lo único de la app que no comparte la vista, así que va solo: las páginas especializadas (blog,
 * vista aislada) no lo descargan.
 *
 * Los componentes transversales (sus hijos: `ja-link`, `ja-marca`, `ja-pie`) y la base viven en el
 * núcleo, que se importa antes: así el padre nunca se define antes que sus hijos (si un subordinado
 * va después, el loader lo vuelve a bajar).
 */
import '../base/componente.js';
import '../components/ja/ja-app.js';
