# 10 — Plataforma, build y pines

> Alcance: qué es Jeff Aporta, cómo arranca la página, las tareas de Deno, el build a `dist/cdn/` y los
> pines del kit. Fuera: el comportamiento de cada vista (specs `30+`) y las pruebas (spec `70`).

## 1. Propósito (WHAT)

Jeff Aporta es una aplicación estática (HTML + módulos ES servidos tal cual, sin framework) construida
con el kit iswc-root (`iswc-*`) y componentes propios `ja-*`.

## 2. Requisitos WHAT

- [W-PLAT-01] La página raíz se titula «Jeff Aporta», idioma `es`, y sin JavaScript muestra «JavaScript requerido».
- [W-PLAT-02] El tema inicial (claro/oscuro) y la paleta se aplican antes del primer pintado: nunca hay un destello del tema equivocado.
- [W-PLAT-03] La página permanece oculta hasta que el arranque termina; si tarda más de 6 s se revela igual, con aviso en consola.
- [W-PLAT-04] La app funciona servida desde la raíz del host o desde cualquier sub-ruta.
- [W-PLAT-05] Un solo comando produce todos los artefactos servibles; otro lo hace en modo vigilancia.
- [W-PLAT-06] Cada módulo propio se sirve con una URL que cambia si y solo si cambia su contenido, y la misma en toda la app.
- [W-PLAT-07] El kit se usa siempre en la misma versión congelada en toda la app (página, vistas aisladas, demos).
- [W-PLAT-13] Carga perezosa: al arrancar solo se descarga lo transversal y la vista que se abre; otra vista (y los componentes del kit que solo ella usa) se descarga la primera vez que se visita.
- [W-PLAT-14] Primera carga fría: el arranque pide pocos ficheros (bundles por consumidor + un lote del kit), no un módulo por componente; nada espera en serie a otro paso.

## 3. Guía HOW WEAK

- [HW-PLAT-01] Separar el loader del kit (externo, CDN) del registrador de la app (propio, generado por el build): el registrador solo mapea tag → URL y falla explícito si el loader no está.
- [HW-PLAT-02] La lista de tags (kit, transversales, por vista) es una única fuente que consumen el build, el arranque y la galería.
- [HW-PLAT-03] Un bundle por consumidor (el núcleo común, el shell de la SPA y cada vista), no un bundle por componente: el núcleo se comparte entre el shell y las vistas (el navegador lo descarga una vez).
- [HW-PLAT-04] Los tags del kit que la página usa van en un LOTE (un `.mjs` con su cierre, bajado del pin y empaquetado por el build), no en peticiones sueltas: el registrador lo publica con `registerApp`.
- [HW-PLAT-05] El CSS de cada componente va dentro de su bundle (el build lo registra por tag): se adopta al instante, sin pedir la hoja y sin frame sin estilos.

## 4. Contratos HOW STRONG

- [HS-PLAT-01] Runtime Deno; dependencias de build en `deno.json` `imports`: `esbuild@0.28.1`, `sass@^1.105.0`, `zod@4.4.3`, `jsdom@29.1.1`, `@browserbasehq/stagehand@4.1.0`; schemas del kit (`@iswc/component-schemas`, `@iswc/loader-schemas`) por SHA de 40 hex.
- [HS-PLAT-02] Tareas: `build:scss`, `build`, `dev`, `serve`, `check`, `pin`, `vendor:iswc`, `test`, `test:health`, `test:e2e`, `test:all`, `test:all:halt`, `sync:entregable`.
- [HS-PLAT-03] Build: bundles por consumidor — `src/js/bundles/jaNucleo.ts` → `dist/cdn/jaNucleo.min.js` (base, schemas, contenido y componentes transversales), `src/js/bundles/jaApp.ts` → `dist/cdn/jaApp.min.js` (el `<ja-app>`), `view/<v>/components/all.ts` → `dist/cdn/ja<v>.min.js` (la vista), `view/demo/components/all.ts` → `dist/cdn/jaGaleria.min.js`, `src/js/components/ja/all.ts` → `dist/cdn/all.min.js` (barril de compatibilidad). El núcleo queda EXTERNO en el resto de bundles (una sola copia en el navegador). `js/boot.ts` → `dist/cdn/boot.js` (IIFE). Hojas `.scss` → `.css` hermana del módulo (además, embebidas en su bundle).
- [HS-PLAT-04] Cache busting `?v=<6 caracteres del hash de contenido>` con `stampDirectory` del kit; `dist/cdn/asset-hashes.json`; `dist/cdn/jaLoader.min.js` llama `L.registerApp({tag: url?v=…}, { installSheets: false })` con URLs resueltas contra su propia ubicación (un host externo lo carga desde cualquier origen) — los tags del kit apuntan a su lote y los propios a su bundle; `dist/cdn/jaArranque.min.js` (el arranque, con las URLs ya selladas); `dist/cdn/build-stamp.json`. El build sella el mismo `?v=` en lo que los HTML piden de `dist/cdn/` (boot, app.css, registrador, arranque, bundles).
- [HS-PLAT-05] Pin único: `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@<sha40>/dist/cdn/core/loader.min.js` (`src/js/iswc.ts`). Prohibido `@main`, `@latest`, SHA corto, GitHub Pages o ramas en raw. `deno task pin` audita; `--nuevo=<sha40|ultimo>` actualiza tras verificar en jsDelivr; luego `deno task vendor:iswc` al mismo SHA.
- [HS-PLAT-07] Lote del kit: `dist/cdn/jaLote.min.mjs` (los tags del arranque) y `dist/cdn/jaLoteExtra.min.mjs` (los del blog y la galería). El build los baja del pin (índice `deps.json` + `deps/<cat>.json`, o el mapa del loader en los pines viejos) y los empaqueta con esbuild; el loader y zod quedan externos y `import.meta.url` de cada módulo vale su URL en el pin.
- [HS-PLAT-06] Arranque de `index.html`: `boot.js` → `styles/app.css` → loader del kit → `jaLoader.min.js` → `jaArranque.min.js`. El arranque pide TODO A LA VEZ (sin fases en serie): el lote del kit, el núcleo, el shell y la vista de la URL (`/blog/` → la del blog), más `L.loadPageStyles(['iswc-palettes-default'])` y `L.load(...KIT_TAGS)`. Luego espera a los componentes `ja-*` que la página trae y a `ja-app.vistaLista` → `data-app-ready` (watchdog de 6 s). `<ja-app>` pide `tagsVista(vista)` (`KIT_TAGS_VISTA` + `VIEW_TAGS`) al abrir cada vista. La galería usa `todosLosTags()`.

- [HS-PLAT-08] Los HTML llevan, entre `<!-- iswc:precarga:inicio -->` y `<!-- iswc:precarga:fin -->`, el bloque que escribe el build: import map (el alias del kit al pin), `<meta name="iswc-precargado" content="<sha40>">`, `modulepreload` del cierre que la página pide, las hojas base del kit SIN bloquear (`preload` + `onload` + `<noscript>`) y los scripts del loader y el registrador. Las fuentes de Google tampoco bloquean: una hoja externa retarda todos los scripts que van detrás.

## 5. Casos borde y errores

- [W-PLAT-08] Loader del kit ausente (CDN caído): el registrador lanza un error claro y el watchdog revela la página.
- [W-PLAT-09] Pin del kit no publicado en jsDelivr: el cambio de pin se rechaza sin tocar archivos.
- [W-PLAT-15] Un tag del kit que no esté en el lote ni en el `deps.json` del pin: el build falla con un error claro (no publica un lote incompleto).

## 6. Pruebas (WHAT / HOW WEAK)

- [W-PLAT-10] Tras el build existen `boot.js`, `jaLoader.min.js`, `jaArranque.min.js`, `jaLote.min.mjs`, `jaNucleo.min.js`, `jaApp.min.js`, `asset-hashes.json`, `build-stamp.json` y `all.min.js`.
- [W-PLAT-11] Un solo SHA de 40 hex del kit en todo HTML/TS y cero referencias mutables (`deno task pin` en exit 0).
- [W-PLAT-12] E2E: la página arranca sin errores de consola y queda marcada como lista.

## 7. Notas

Sin notas.