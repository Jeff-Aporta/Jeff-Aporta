# Jeffrey Agudelo — Portafolio y hoja de vida

Sitio estático (GitHub Pages) hecho con **Web Components**, **TypeScript**, **Deno**, **SCSS** y **Zod**
sobre el kit [iswc](https://github.com/Jeff-Aporta/is-webcomponents), consumido **solo por CDN** y fijado
a un SHA. Sin frameworks ni bundler en runtime.

**Publicado:** https://jeff-aporta.github.io/Jeff-Aporta/

## Editar el contenido

Todo el texto y los datos viven en `src/js/contenido/`, separados de la UI y validados con Zod:

| Archivo | Qué contiene |
| --- | --- |
| `perfil.ts` | Identidad, propuesta, resumen, pilares, video y contacto |
| `experiencia.ts` | Empleos con periodos (`AAAA-MM` o `AAAA-MM-DD`), contrato, logros, tecnologías y certificado |
| `educacion.ts` | Estudios |
| `habilidades.ts` | Áreas y tecnologías |
| `proyectos.ts` | Productos y laboratorio (este último generado desde una tabla) |
| `sitio.ts` | Metadatos SEO y secciones de la navegación |
| `blog/` | Guías narradas del blog (una por archivo, registradas en `blog/index.ts`): pasos con narración, bloques y demo |
| `derivados.ts` | Lo que se calcula: duraciones (meses hacia arriba), total sin doble conteo, trayectoria, cifras, uso por tecnología |

Cambias un archivo, corres `deno task build` y se actualizan la página, los metadatos (`<head>`, JSON-LD,
sitemap, manifest) y las cifras.

## Comandos

```bash
deno install
deno task build        # íconos + SCSS + módulos con ?v=<hash> + metadatos
deno task serve        # http://127.0.0.1:4200/
deno task test:all     # gate: build, check, pin, pruebas de contenido/sitio y e2e (Stagehand)
```

Para el e2e en Windows conviene usar Edge: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" deno task test:all`.

## Publicar en GitHub Pages

El sitio se sirve tal cual desde la raíz del repositorio (`index.html`, `dist/cdn/`, `assets/`). En
**Settings → Pages**: *Deploy from a branch*, rama `main`, carpeta `/ (root)`. Corre `deno task build`
antes de cada commit para que `dist/cdn/` y los metadatos queden al día.

## Estructura

- `src/js/components/ja/` — componentes transversales (`ja-app`, `ja-seccion`, `ja-marca`, `ja-forma`, `ja-rasgo`, `ja-lista`, `ja-insignia`, `ja-ilustracion`).
- `view/portafolio/` — portada, perfil, trayectoria (gráfico de ramas), experiencia, proyectos, habilidades, educación y contacto.
- `view/blog/` — banner animado (`<ja-banner-blog>`), lista del blog, guía narrada a todo el ancho (`<ja-post>` + `<ja-paso>`) y demos interactivas (`<ja-luz-demo>`). La narración de cada paso va en `assets/blog/<slug>/voz/NN.mp3` (voz clonada de MiniMax).
- SPA por hash: `#/` «Yo», el portafolio (`#/<sección>`), `#/blog` y `#/blog/<slug>`; pestañas con `iswc-app-nav`.
- `view/demo/` — galería con playground de cada componente.
- `assets/` — fotos, logos, ilustraciones corporate memphis (SVG), íconos y la hoja de vida en PDF.
- Agentes: [`AGENTS.md`](AGENTS.md). Specs: [`specs/`](specs/README.md).
