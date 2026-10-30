# AGENTS.md — Jeff Aporta

Punto de entrada para cualquier agente. App de web components sobre el kit **iswc-root**, creada con
`create-iswc-app` (estándar **iswc-foundation**): misma estructura, mismas tareas y mismas reglas que
todas las apps iswc.

## Antes de tocar código

1. [`specs/README.md`](specs/README.md) → [`specs/especificar-what.md`](specs/especificar-what.md).
   Componentes del kit disponibles: [`specs/iswc/kit/catalog.md`](specs/iswc/kit/catalog.md) (no reinventes ninguno).
2. La spec fundación del área (`specs/foundation/NN-*.md`).
3. La skill de la tarea en [`specs/iswc/`](specs/iswc/README.md) (componente, demo, vista, pin).

## Comandos

```bash
deno install                 # dependencias (npm: por deno.json; sin package.json)
deno task icons              # íconos usados (+ extra de dl.js) → assets/iconify/<set>/<n>.svg (va dentro de build)
deno task build              # icons + src/ + view/ → dist/cdn/ (SCSS, ?v=<hash>, registrador)
deno task dev                # build en vigilancia
deno task serve              # http://127.0.0.1:4200/
deno task check              # typecheck
deno task test:all           # build → check → pin → test:health → test:e2e (cooldown x600)
deno task pin                # inventario de pines (un SHA, sin refs mutables)
deno task pin --nuevo=<sha40|ultimo>   # subir el kit (y los alias @iswc/* de deno.json al mismo SHA)
deno task sync:entregable    # solo si existe el par _entregable: gate en verde → copia
```

## Reglas duras

1. Vanilla + Web Components, Deno. Cero React/MUI/JSX/Babel, cero bundler en runtime.
2. UI con el kit (`iswc-*`): no reinventar botones, campos, diálogos, tablas, toasts, iconos ni formatos.
3. Colores solo por tokens `--iswc-*`; estilos en `.scss` hermano del componente.
4. Cada componente: `.ts` + `.scss` + `.md` + `.json`, registrado UNA vez en `src/js/kit-tags.ts` y en
   `view/demo/manifest.json`.
5. Tipos con Zod en `src/js/consts/schemas/*.schemas.ts`; datos externos se parsean, nunca `as`.
6. Pines fijos: un SHA de 40 hex del kit en toda la app. Nunca `@main`.
7. El kit se consume SOLO por CDN: nada vendorizado. Las tools (build, pruebas, sync) se importan por los alias
   `@iswc/build/`, `@iswc/testing/`, `@iswc/tools/` de `deno.json` (raw de GitHub al SHA del pin); los `*.js` del kit
   que en realidad son `.ts` se remapean ahí mismo.
8. Specs WHAT primero; pruebas de caja negra en `tests/` con el formato común del kit.
9. Íconos: `<iswc-icon icon="set:nombre">` con el id literal; viven en `assets/` (no se piden a mano a la
   API). Un id armado en ejecución va en `extra` de `assets/dl.js`. Detalle: `10-iconos.md` del estándar.
10. Hecho = `deno task test:all` en verde.

## Layout

```
ja-app/
├── index.html                  ← shell (<ja-app>)
├── deno.json · tsconfig.json   ← `iswc.host`: dónde se publica la app
├── assets/                     ← dl.js (rutas) · iconify/<set>/<n>.svg
├── src/
│   ├── js/
│   │   ├── iswc.ts             ← pin canónico del kit
│   │   ├── kit-tags.ts         ← REGISTRO ÚNICO de tags (kit, app, vistas)
│   │   ├── boot.ts             ← tema antes del primer pintado (script plano)
│   │   ├── base/               ← componente.ts, zod.ts, props-registro.ts
│   │   ├── consts/schemas/     ← *.schemas.ts (Zod; los tipos salen de aquí)
│   │   ├── core/ · dominio/    ← lógica compartida sin DOM
│   │   └── components/ja/    ← componentes transversales + all.ts
│   ├── styles/                 ← _tokens.scss, _mixins.scss, app.scss
│   ├── utils/build.ts          ← build
├── view/<vista>/               ← index.html, README.md, demo/, components/, utils/
├── view/demo/                  ← galería de componentes (manifest.json)
├── scripts/{build,gate}/        ← build-scss, build-meta (SEO/sitemap/manifest), gate
├── tests/<area>/*.test.ts      ← pruebas (formato común del kit)
├── specs/                      ← FOUNDATION, W2H, especificar-what, foundation/, iswc/
└── dist/cdn/                   ← artefactos del build (se versionan: es lo que se sirve)
```

## Portafolio (esta app)

- **Contenido central** en `src/js/contenido/` (perfil, experiencia, educación, habilidades, proyectos, sitio),
  validado con `ContenidoSchema`. La UI no tiene textos de datos: los lee de ahí. `derivados.ts` calcula
  duraciones (meses enteros hacia arriba), el total sin doble conteo, la trayectoria y el uso por tecnología.
- **Una vista**: `view/portafolio/` (shell `<ja-portafolio>`); el orden y los encabezados de sección están en
  `view/portafolio/utils/secciones.ts`.
- **Todo es componente**: se compone con `pieza(tag, props)` (base) y piezas del kit (`iswc-*`); nada de HTML suelto
  con estructura fuera del shadow mínimo de cada componente.
- **Animaciones**: `<ja-forma>` (figuras memphis en loop), entrada al aparecer en `<ja-seccion>`; todo respeta
  `prefers-reduced-motion`.
- **Publicación**: GitHub Pages desde la raíz; `deno task build` deja `dist/cdn/`, el `<head>` SEO, `sitemap.xml`,
  `robots.txt`, `site.webmanifest` y `.nojekyll`.

## SPA y blog

- **Rutas** (`src/js/base/rutas.ts`, router propio): la raíz (sin estado o `?s=` con `{ sec }`) → portafolio, `blog/` →
  lista, `blog/<slug>/` → publicación (URL limpias; los `?s=` viejos con `{ v, p }` se reescriben). `<ja-app>` enruta y
  usa `iswc-app-nav` (fila principal Yo | Blog; secundaria con las secciones). `hrefDe`/`navegar` arman las URL; en la
  SPA los enlaces se interceptan y navegan sin recargar.
- **Blog quemado**: cada publicación es un archivo en `src/js/contenido/blog/` con la forma de `PublicacionSchema`
  (bloques `md`, `codigo`, `nota`, `demo`) y se registra en `blog/index.ts`. Sin APIs.
- **Una página por publicación**: `deno task build` (`scripts/build/build-blog.ts`) escribe `blog/index.html`,
  `blog/index.json` y, por post, `blog/<slug>/post.json` (datos mínimos) y `blog/<slug>/index.html` (shell mínimo
  `<ja-pagina>` + `<ja-post slug>`, `<head>` SEO, JSON-LD y resumen estático dentro del tag). `<ja-post>` carga el JSON
  por slug o recibe `datos` y pinta todos los pasos en una sola página (audio discreto por tarjeta). «Compartir» va en
  la barra (`iswc-share-button` con `urlCompartir`). Enlaces internos con `<ja-link>` (candidato a `iswc-link`). Se
  versiona junto con `dist/cdn/`: es lo que sirve GitHub Pages.
- **Primer post**: «Luz y sombra en 2D», reinterpretación en español de *Sight & Light* de Nicky Case (assets de fondo y
  frente con crédito). Geometría en `view/blog/utils/luz.ts`; demo por paso en `<ja-luz-demo>`.
