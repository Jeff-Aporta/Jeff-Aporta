# view/blog — el blog: lista y guías narradas

Segunda vista del sitio: la lista de publicaciones (`<ja-blog>`) y cada publicación como guía narrada por
pasos (`<ja-post>`). El contenido está quemado en `src/js/contenido/blog/` (un archivo por publicación con la
forma de `PublicacionSchema`); los componentes solo pintan.

```
view/blog/
├── README.md           ← alcance y contrato (este archivo)
├── components/         ← <tag>.ts + .scss + .md + .json, y all.ts (barril de la vista)
└── utils/              ← dominio sin DOM: luz.ts (geometría de la demo), publicaciones.ts (post.json, URL pública)
```

| Dentro | Fuera |
| --- | --- |
| Lista (`ja-blog`, `ja-banner-blog`, `ja-post-tarjeta`) | Barra, navegación y pie: `<ja-app>` en la SPA, `<ja-pagina>` en las páginas especializadas |
| Guía (`ja-post`, `ja-paso`, `ja-bloque`, `ja-luz-demo`) | Datos: `src/js/contenido/blog/`; HTML y JSON generados: `blog/` (lo escribe el build) |

## Dos formas de llegar a una publicación, un solo componente

- **SPA**: `<ja-app>` monta `<ja-post slug>` en la URL limpia `blog/<slug>/` (router propio en `src/js/base/rutas.ts`).
- **Página especializada**: `blog/<slug>/index.html`, generada por `scripts/build/build-blog.ts`, monta
  `<ja-pagina activa="blog">` + `<ja-post slug="…">` con su `<head>` SEO y el texto del post dentro del tag.

`<ja-post>` carga `blog/<slug>/post.json` (validado con Zod, con esqueletos del kit mientras llega) o recibe la
publicación completa en `datos`. «Compartir» entrega `https://jeff-aporta.github.io/Jeff-Aporta/blog/<slug>/` con
`<iswc-share-button>` e `<iswc-copy-button>` del kit. La lista sigue leyendo el contenido importado (no necesita red).

- **Registro**: `VIEW_TAGS.blog` y `KIT_TAGS_VISTA.blog` (`iswc-callout`, `iswc-code`, `iswc-md-render`,
  `iswc-share-button`, `iswc-skeleton`) en `src/js/kit-tags.ts`.
- **Pruebas**: `tests/blog/` (datos, rutas y geometría), `tests/sitio/` (W-SIT-07: páginas generadas) y
  `tests/e2e/01.blog.test.ts` (página especializada, compartir, `datos` por prop, enlaces viejos).

## Publicar una guía nueva

1. Crear `src/js/contenido/blog/<slug>.ts` con la forma de `PublicacionSchema` y registrarlo en `blog/index.ts`.
2. Portada en `assets/blog/<slug>/` y narraciones `assets/blog/<slug>/voz/NN.mp3` (una por paso).
3. `deno task test:all`: el build escribe `blog/<slug>/` (HTML + JSON), el sitemap y los metadatos; el gate lo valida.
