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
sitemap, manifest), las páginas del blog (`blog/`) y las cifras. La hoja de vida está en `assets/docs/`: el `.docx` es la fuente y el `.pdf` se exporta desde él (Word) con el mismo nombre.

### La hoja de vida (`assets/docs/`)

- El `.docx` manda; el `.pdf` sale de él. En el VPS se exporta con `soffice --headless --convert-to pdf` (si no hay Word a mano): el resultado es el mismo maquetado, con las fuentes incrustadas.
- El documento ocupa **dos hojas** (decisión del autor, 19-nov-2026: no debe quedar apretado en una sola). Por eso el espaciado es amplio: `space_after` de 5-6 pt en el texto, 13 pt antes de cada título de sección, y `line_spacing` 1,15.
- **El encabezado va en un grid (tabla de 2 columnas)**, no con párrafos sueltos (decisión del autor, 19-nov-2026: «se ve desordenado»): columna izquierda `w:w="8164"` dxa con los cuatro párrafos (nombre, cargo, contacto, enlaces) alineados a la izquierda, columna derecha `w:w="2098"` dxa con la foto alineada a la derecha. La tabla no lleva bordes (salvo una línea inferior azul `D9E2F3`) y `tblLayout` fijo.
- **La foto de Jeff** (`assets/img/perfil/jeffrey-agudelo.jpg`) va en la **celda derecha de la tabla del encabezado** (antes iba flotante; el grid la sustituyó): inline, alineada a la derecha, de `cx="864000" cy="836285"` EMU (unos 2,4 cm de ancho; el autor la pidió un 20 % más grande el 19-nov-2026). Su tamaño se cambia en el **XML** del `.docx` (`wp:extent` y `a:ext`), no con python-docx. Ojo: cambiar solo el `.docx` no basta, hay que volver a exportar el `.pdf` con `soffice`.
- Los **cuatro párrafos del encabezado** (nombre, cargo, contacto y enlaces) van **alineados a la izquierda** (no centrados), para que la foto a la derecha no se coma el texto.
- El grid del encabezado se monta con el script `/opt/datos/perfil-cv/grid-header.py` (python-docx): mueve los cuatro párrafos a la celda izquierda, quita la foto flotante, la mete **inline** en la celda derecha (`width=Cm(2.4)`) y deja una línea inferior fina (`D9E2F3`). Ajustes para que el bloque se lea ordenado: titular a 10,5 pt (una sola línea), enlaces a 9 pt y el **correo en su propia línea** (se saca del párrafo de contacto y se clona). Ojo: el ancho hay que fijarlo en el **grid de la tabla** (`tbl.columns[i].width`) y con `tblLayout` fijo; si solo se cambia el ancho de la celda, las columnas se quedan a la mitad y el nombre se parte en dos líneas.
- En Educación, la Ingeniería de Sistemas dice **«Proceso de titulación»** (no «Título completado»): es un enlace al certificado de UniRemington y se edita en el `w:hyperlink`, no como texto suelto.
- La foto del CV no es el avatar: el avatar del sitio es `assets/img/avatar/jeffrey.svg`.
- Los márgenes son de 1,5 cm a los lados y 1,4 cm arriba y abajo; los títulos de sección llevan 13 pt antes y 6 pt después, y las viñetas 4 pt.
- El **perfil profesional y las habilidades** se reorientaron a IA (19-nov-2026, pedido del autor): LLMs, RAG, MCP, agentes, CRM, chatbots y mensajes automáticos por bot; y en habilidades, infraestructura (VPS, serverless, Terraform, CI/CD), ORM (Prisma, TypeORM, Sequelize), controladores y modelos cliente-controlador, datos (Redis, ETL) y apps auto-mantenibles y auto-escalables por medio de VPS. Al tocar el texto del `.docx` hay que conservar los runs (el primero en negrita es la etiqueta) y volver a exportar el `.pdf` con `soffice`.
- El **perfil del sitio** (`src/js/contenido/perfil.ts` y `habilidades.ts`) se orienta lo mismo que el CV (19-nov-2026): titular «Ingeniero de IA aplicada · Agentes LLM en la nube · Full Stack», roles de IA/agentes/cloud/infra, y un grupo nuevo de habilidades **«Arquitectura y controladores»** (controladores, servicios, patrón cliente-controlador, MVC). Al tocar el contenido del sitio hay que correr `deno task build` para rehacer `dist/`.
- La sección **PROYECTOS** se quitó por petición del autor (19-nov-2026): ya no está en el CV, aunque el repo siga teniendo los productos (`proyectos.ts`). Sin ella la segunda hoja queda a la mitad.
- La tarjeta del CV del sitio dice cuántas páginas ocupa: `perfil.ts` → `cvTarjeta.paginas` (2 desde el 19-nov-2026). Si cambia el `.docx`, se actualiza ese número y se corre `deno task build`.
- Cómo se edita el `.docx` en el VPS: con `python-docx` se cambian márgenes y `paragraph_format` (espaciado, interlineado) y se clonan párrafos existentes para no perder el formato (los clones se insertan con `addprevious`/`addnext` **del ancla correcta**: clonar la plantilla de título equivocada mete la sección donde no es).
- En el VPS, el token de `gh` es de una GitHub App **sin permiso de escritura** sobre este repo (403 al hacer push): el push lo hace el PC, que sí tiene credenciales.

## Comandos

```bash
deno install
deno task build        # íconos + SCSS + módulos con ?v=<hash> + metadatos
deno task serve        # http://127.0.0.1:4200/
deno task test:all     # gate: build, check, pin, pruebas de contenido/sitio y e2e (Stagehand)
```

En Windows el e2e usa Edge: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" deno task test:all`.

## Publicar

GitHub Pages sirve la raíz de `main` tal cual (`index.html`, `blog/`, `dist/cdn/`, `assets/`). Corre
`deno task test:all` antes de cada commit para que `dist/cdn/`, `blog/`, los `?v=` y los metadatos queden al día.

## Blog: una página por publicación

Cada publicación vive en la SPA y además tiene su **propio HTML estático con URL limpia**, indexable sin JS:

| Archivo (lo escribe `deno task build`, `scripts/build/build-blog.ts`) | Qué es |
| --- | --- |
| `blog/<slug>/post.json` | Datos mínimos de la publicación (`PublicacionSchema`); `<ja-post>` los carga y valida con Zod |
| `blog/<slug>/index.html` | Página especializada: `<ja-pagina>` (barra mínima + pie) con `<ja-post slug="…">`, `<head>` SEO (título, descripción, canonical, Open Graph/Twitter con la portada, JSON-LD `BlogPosting`) y el texto del post dentro del tag para rastreadores |
| `blog/index.html` · `blog/index.json` | Lista del blog (`<ja-blog>`, JSON-LD `Blog`) y su índice en JSON |

URL: `https://jeff-aporta.github.io/Jeff-Aporta/blog/<slug>/`. El mismo componente `<ja-post>` pinta la publicación en
la SPA (por slug, desde el JSON) y en su página: todos los pasos seguidos en una sola página, cada tarjeta con su botón
discreto de narración; con `datos` por prop pinta sin red. El sitemap lista las URL limpias; los enlaces viejos `?s=` del
blog siguen funcionando y se reescriben a la URL limpia.

**Compartir** va en la barra, junto al tema, en la SPA (`<ja-app>`) y en las páginas del blog (`<ja-pagina>`):
`<iswc-share-button>` del kit con la URL canónica de la vista actual (`urlCompartir` en `src/js/base/rutas.ts`); sin
Web Share copia al portapapeles y avisa con el toast.

**Metadatos** de cada página del blog (`scripts/build/seo.ts`, una sola fuente): el `Person` del sitio (el mismo de
`index.html`), `Blog` + `ItemList` en la lista, `BlogPosting` completo en cada post (`author`/`publisher` → `#persona`,
`mainEntityOfPage`, `isPartOf`, `dateModified` si la publicación trae `actualizado`), `article:*`, Open Graph y Twitter.

### Enlaces internos: `<ja-link>` (candidato a `iswc-link`)

Todo enlace interno entre vistas (marca, pestañas de las páginas del blog, tarjetas de `ja-blog`, «Todas las
publicaciones») es un `<ja-link>` (`src/js/components/ja/ja-link.*`): recibe un `state` (el estado `?s=` de
`createSpaState`, que `rutas.ts` da con `estadoSpa(ruta)`) y una `base` (en la SPA, `<html data-spa-base>` que fija
`<ja-app>` con la raíz del sitio; en `blog/<slug>/index.html`, `data-spa-base="../../"`). Dentro de la SPA el router
navega sin recargar y reescribe a la URL limpia; desde una página del blog aterriza en el SPA. Su API es general (nada
del portafolio): es el **candidato a subir al kit como `iswc-link`** sin cambiar el contrato; cuando llegue, el
reemplazo es mecánico (mismo nombre de props, solo cambia el tag en `ja-app`, `ja-pagina`, `ja-post` y
`ja-post-tarjeta`). Las pestañas de `ja-app` siguen en `iswc-app-nav` del kit (reciben `href` de `hrefDe`), y los
enlaces del resumen estático para rastreadores son `<a>` planos a propósito.

## Estructura

- `src/js/components/ja/` — componentes transversales (`ja-app`, `ja-seccion`, `ja-marca`, `ja-forma`, `ja-rasgo`, `ja-lista`, `ja-insignia`, `ja-ilustracion`).
- `view/portafolio/` — portada, perfil, trayectoria (gráfico de ramas con ficha de detalle), proyectos, habilidades, educación y contacto.
- `view/blog/` — banner animado, lista del blog, guías narradas (`<ja-post>` + `<ja-paso>`), demos interactivas y `utils/publicaciones.ts` (carga de `post.json`, URL pública).
- `src/js/components/ja/ja-pagina` y `ja-pie` — shell mínimo y pie de las páginas especializadas (el pie también lo usa `<ja-app>`).
- Navegación SPA con router propio (`src/js/base/rutas.ts`): `?s=` para la sección del portafolio, URL limpias `blog/` y `blog/<slug>/` para el blog; los enlaces se interceptan dentro de la SPA.
- Carga perezosa: el arranque trae lo transversal; cada vista llega al abrirse (`tagsVista` en `src/js/kit-tags.ts`).
- `view/demo/` — galería con playground de cada componente.
