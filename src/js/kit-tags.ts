/**
 * kit-tags.ts — REGISTRO ÚNICO de tags de la app (estándar iswc-foundation).
 *
 * Todo lo demás se deriva de aquí: el registrador (`jaLoader.min.js`, vía `registerApp`),
 * el bundle de compatibilidad, la galería de demos y los guardianes. Un componente nuevo se declara
 * UNA vez, en la lista que le toca:
 *
 *   KIT_TAGS   → tags `iswc-*` del kit que la app pide al loader (solo padres registrables).
 *   APP_TAGS   → componentes transversales → `dist/cdn/js/components/ja/<tag>.js`.
 *   VIEW_TAGS  → componentes de cada vista → `dist/cdn/view/<vista>/components/<tag>.js`.
 *
 * APP_TAGS y la unión de VIEW_TAGS son disjuntos: una vista no importa componentes de otra; lo
 * compartido sube a APP_TAGS. Se publica en `dist/cdn/js/kit-tags.js` para los hosts.
 *
 * Carga perezosa: el arranque pide solo `KIT_TAGS` + `APP_TAGS` (`tagsArranque`); cada vista llega con
 * `tagsVista(vista)` cuando `<ja-app>` la abre (sus componentes y los tags del kit que solo ella usa,
 * `KIT_TAGS_VISTA`). Así el portafolio no descarga el blog ni su renderizador de Markdown y código.
 */
export const KIT_TAGS = [
  'iswc-app-nav',
  'iswc-button',
  'iswc-copy-button',
  'iswc-card',
  'iswc-dialog',
  'iswc-icon',
  'iswc-progress-bar',
  'iswc-stat',
  'iswc-tab-group',
  'iswc-tag',
  'iswc-theme-toggle',
  'iswc-toast',
] as const;

export const PREFIJO = 'ja';

export const APP_TAGS = ['ja-forma', 'ja-boton-icono', 'ja-marca', 'ja-pie', 'ja-pagina', 'ja-insignia', 'ja-rasgo', 'ja-lista', 'ja-ilustracion', 'ja-seccion', 'ja-app'] as const;

export const VIEW_TAGS = {
  portafolio: [
    'ja-video',
    'ja-barra-uso',
    'ja-estudio',
    'ja-canal',
    'ja-hito',
    'ja-empleo',
    'ja-proyecto',
    'ja-hero',
    'ja-perfil',
    'ja-trayectoria',
    'ja-proyectos',
    'ja-habilidades',
    'ja-educacion',
    'ja-contacto',
    'ja-portafolio',
  ],
  blog: ['ja-luz-demo', 'ja-bloque', 'ja-paso', 'ja-banner-blog', 'ja-post-tarjeta', 'ja-post', 'ja-blog'],
} as const satisfies Record<string, readonly `ja-${string}`[]>;

/** Tags del kit que solo usa una vista: se piden con ella, no en el arranque. */
export const KIT_TAGS_VISTA = {
  portafolio: [],
  blog: ['iswc-callout', 'iswc-code', 'iswc-md-render', 'iswc-share-button', 'iswc-skeleton'],
} as const satisfies Record<keyof typeof VIEW_TAGS, readonly `iswc-${string}`[]>;

export type AppTag = (typeof APP_TAGS)[number] | (typeof VIEW_TAGS)[keyof typeof VIEW_TAGS][number];
export type Vista = keyof typeof VIEW_TAGS;

/** Carpeta publicada (relativa a `dist/cdn/`) de un componente propio; `null` si no es de la app. */
export function rutaComponente(tag: string): string | null {
  if ((APP_TAGS as readonly string[]).includes(tag)) return `js/components/${PREFIJO}/`;
  for (const [vista, tags] of Object.entries(VIEW_TAGS)) {
    if ((tags as readonly string[]).includes(tag)) return `view/${vista}/components/`;
  }
  return null;
}

/** tag → ruta del módulo relativa a `dist/cdn/` (exige el prefijo de la app). */
export function mapaRutas(): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const tag of [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()]) {
    if (!tag.startsWith(`${PREFIJO}-`)) throw new Error(`kit-tags: ${tag} no lleva el prefijo ${PREFIJO}-`);
    mapa[tag] = `${rutaComponente(tag)}${tag}.js`;
  }
  return mapa;
}

/** Tags propios que el shell pide al arrancar (los transversales; las vistas llegan con `tagsVista`). */
export const tagsArranque = (): string[] => [...APP_TAGS];

/** Lo que trae una vista al abrirse: los tags del kit que solo ella usa y sus componentes. */
export const tagsVista = (vista: Vista): string[] => [...KIT_TAGS_VISTA[vista], ...VIEW_TAGS[vista]];

/** Todos los tags (kit, transversales y vistas): la galería los muestra juntos. */
export const todosLosTags = (): string[] => [...KIT_TAGS, ...APP_TAGS, ...(Object.keys(VIEW_TAGS) as Vista[]).flatMap(tagsVista)];
