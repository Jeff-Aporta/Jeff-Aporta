# Desarrollo del portafolio

Sitio estático (GitHub Pages) hecho con **Web Components**, **TypeScript**, **Deno**, **SCSS** y **Zod**
sobre el kit [iswc](https://github.com/Jeff-Aporta/is-webcomponents), consumido **solo por CDN** y fijado
a un SHA. Sin frameworks ni bundler en runtime. El `README.md` es la presentación del perfil de GitHub;
las reglas para agentes están en [`AGENTS.md`](AGENTS.md) y las specs en [`specs/`](specs/README.md).

**Publicado:** https://jeff-aporta.github.io/Jeff-Aporta/

## Editar el contenido

Todo el texto y los datos viven en `src/js/contenido/`, separados de la UI y validados con Zod:

| Archivo | Qué contiene |
| --- | --- |
| `perfil.ts` | Identidad, propuesta, resumen, pilares, video, hoja de vida y contacto |
| `experiencia.ts` | Empleos con periodos (`AAAA-MM` o `AAAA-MM-DD`), contrato, logros, tecnologías, sitio y certificado |
| `educacion.ts` | Estudios (año de grado o `cursando`) |
| `habilidades.ts` | Áreas y tecnologías |
| `proyectos.ts` | Maquetas, open source, educativos y laboratorio |
| `ilustraciones.ts` | Composiciones por piezas WebP (`assets/ilustraciones/<nombre>/`) con su parallax |
| `sitio.ts` | Metadatos SEO y secciones de la navegación |
| `blog/` | Guías narradas del blog (una por archivo, registradas en `blog/index.ts`) |
| `derivados.ts` | Lo que se calcula: duraciones, total sin doble conteo, trayectoria, cifras, uso por tecnología |

Cambias un archivo, corres `deno task build` y se actualizan la página, los metadatos (`<head>`, JSON-LD,
sitemap, manifest) y las cifras. La hoja de vida está en `assets/docs/`: el `.docx` es la fuente y el `.pdf` se exporta desde él (Word) con el mismo nombre.

## Comandos

```bash
deno install
deno task build        # íconos + SCSS + módulos con ?v=<hash> + metadatos
deno task serve        # http://127.0.0.1:4200/
deno task test:all     # gate: build, check, pin, pruebas de contenido/sitio y e2e (Stagehand)
```

En Windows el e2e usa Edge: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" deno task test:all`.

## Publicar

GitHub Pages sirve la raíz de `main` tal cual (`index.html`, `dist/cdn/`, `assets/`). Corre
`deno task test:all` antes de cada commit para que `dist/cdn/`, los `?v=` y los metadatos queden al día.

## Estructura

- `src/js/components/ja/` — componentes transversales (`ja-app`, `ja-seccion`, `ja-marca`, `ja-forma`, `ja-rasgo`, `ja-lista`, `ja-insignia`, `ja-ilustracion`).
- `view/portafolio/` — portada, perfil, trayectoria (gráfico de ramas con ficha de detalle), proyectos, habilidades, educación y contacto.
- `view/blog/` — banner animado, lista del blog, guías narradas (`<ja-post>` + `<ja-paso>`) y demos interactivas.
- Navegación SPA en `?s=` con `createSpaState` del kit (`src/js/base/rutas.ts`).
- Carga perezosa: el arranque trae lo transversal; cada vista llega al abrirse (`tagsVista` en `src/js/kit-tags.ts`).
- `view/demo/` — galería con playground de cada componente.
