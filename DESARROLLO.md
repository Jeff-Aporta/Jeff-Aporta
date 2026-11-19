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
- **El encabezado va en un grid de DATOS en DOS columnas con la foto a la derecha** (decisión del autor, 19-nov-2026: «se ve desordenado», luego «debe ser de dos columnas, el título y valor separados por salto de línea» y, al ver el PDF, «mucho espaciado entre el título y el grid»). La tabla tiene **tres celdas por fila** (`tblGrid` 4225 | 4226 | 1755 dxa, 18 cm en total): **columna de datos A** (ubicación, teléfono, correo), **columna de datos B** (Portfolio, GitHub, YouTube, LinkedIn) y **columna de la foto** (1755 dxa, 3,1 cm, con `vMerge` para que abarque las cuatro filas). El nombre y el titular van **arriba, como párrafos sueltos**; los datos van en el grid, y cada dato es **un párrafo con la etiqueta en negrita y el valor debajo**, separados por un **salto de línea** (`w:br`), no por columnas sueltas. La tabla no lleva bordes y va con `tblLayout` fijo.
- Ojo al espaciado: el autor se quejó de «mucho espaciado entre el título y el grid». En el encabezado va **justo**: 5 pt después del titular (`w:after="100"`), 0 antes de cada etiqueta y 3 pt después de cada valor (`w:after="60"`).
- Ojo a las variantes: se probaron tres montajes del encabezado (etiqueta | valor | foto; dos columnas de datos + foto; y textos | foto) porque **varias sesiones del bot editaban este repo del VPS a la vez** y se pisaban. La que vale es la del **último commit** (ver `git log`), el **grid de DATOS en dos columnas con la foto a la derecha**: `.docx` sha256 `6b1cc23cc18c9b98cd3f8605a54e98e06181ac6c43696fa2be2eb7e12cc54d06` y `.pdf` sha256 `17c9bd756146b436e41eb322d5a49bf4035502ba9ee831bd6ed2a6abb5e3c08c` (2 páginas, con la foto a 2,6 cm y el perfil profesional enriquecido). Ojo: el `.docx` se regenera desde la **base con el encabezado de párrafos** (commit `37ddfaa`) con el script `/opt/datos/perfil-cv/grid-header-v3.py`; su `word/document.xml` es idéntico byte a byte al de la versión `b4224ac7…` (solo cambia el zip del `.docx`). **Descartada**: la variante con los datos en una sola columna (textos | foto, sha `6fa9d0a2…`, commit `32fd71c`), porque el autor pidió el grid de datos en dos columnas. Verificado mirando la portada renderizada del `.pdf` (2 páginas), no el texto plano.
- La **foto de Jeff** (`assets/img/perfil/jeffrey-agudelo.jpg`) va en la **columna de la derecha** del encabezado (antes iba flotante; el grid la sustituyó): inline, alineada a la derecha, de `cx="936000"` EMU (**2,6 cm** de ancho). Ojo con el tamaño: el 19-nov-2026 la pidió un 20 % más grande (3,63 cm, `cx="1306368"`) y a los pocos minutos dijo que «la imagen está muy grande, debes hacerla más pequeña», así que **queda en 2,6 cm** (más pequeña que la original de 3,02 cm); al encogerla hay que **estrechar también la columna de la foto** (2041 → 1755 dxa) y devolver el ancho a las dos de datos (4082 | 4083 → 4225 | 4226 dxa), si no la imagen no cabe en la celda. Su tamaño se cambia en el **XML** del `.docx` (`wp:extent` y `a:ext`), no con python-docx; para ajustarla está el script `/opt/datos/perfil-cv/foto-encajar.py` (toma el ancho en EMU y el de la columna en dxa). Ojo: cambiar solo el `.docx` no basta, hay que volver a exportar el `.pdf` con `soffice`.
- **Scripts de la foto**: `/opt/datos/perfil-cv/foto-mas-pequena.py <entrada.docx> <salida.docx> [cx_objetivo_emu]` (por defecto 936000 EMU = 2,6 cm) y `/opt/datos/perfil-cv/foto-mas-grande.py` (factor 1,2): los dos cambian el `wp:extent`/`a:ext` y reparten el `tblGrid` en la misma proporción. Ojo: si el `.docx` y el `.pdf` se cambian por separado se pueden pisar (el `.pdf` puede quedar generado desde otro `.docx`): **regenera siempre el `.pdf` desde el `.docx` del mismo commit y comprueba que los dos hashes cuadran**.
- Los **párrafos del encabezado** (nombre, cargo y cada dato) van **alineados a la izquierda** (no centrados), para que la foto a la derecha no se coma el texto; el titular va a 10,5 pt para que quepa en una sola línea.
- **El titular del encabezado es «Desarrollador Full Stack (web y móvil) | Ingeniero de IA aplicada (LLMs, RAG y MCP)»** (19-nov-2026, petición del autor: «en la parte de arriba no me gusta como quedó, el formato debe ser más simple, pero bien específico y usar | para separar fullstack de IA engineer»). Antes era la frase larga «Desarrollador Full Stack · Apps de punta a punta, del servidor al front · IA aplicada y apps móviles». Los dos roles van separados por una **barra vertical** (`|`), cada uno con su matiz (web y móvil; LLMs, RAG y MCP). Scripts: `/opt/datos/perfil-cv/cv-header-simple.py <entrada.docx> <salida.docx>` y `/opt/datos/perfil-cv/cv-titular-simple.py` (solo cambian ese párrafo; no tocan nombre, grid, foto ni anchos). `.docx` sha256 `1e51fbf5c05a64376ba6560acab45de85706b6f43859a29185510a0c42d01627`; `.pdf` sha256 `c15371b1950115e41c707e265d4cf0d7c68142bcbca368997204c13a6079a53d` (2 páginas, regenerado con `soffice` desde ese mismo `.docx` y verificado mirando la portada renderizada). Commit `8763788`.
- El grid del encabezado se monta con el script `/opt/datos/perfil-cv/grid-header-v3.py` (python-docx; la versión anterior, de dos columnas textos | foto, quedó en `header-2col.py`): deja el nombre y el titular como párrafos sueltos arriba, crea la tabla sin bordes de **tres celdas por fila** (datos A | datos B | foto, con `vMerge` para la foto), junta cada etiqueta con su valor en un párrafo con salto de línea y mete la foto **inline** en la tercera celda. Ojo: el ancho hay que fijarlo en el **grid de la tabla** (`w:tblGrid` + `tblLayout` fijo); si solo se cambia el ancho de la celda, las columnas se quedan a la mitad y el nombre se parte en dos líneas. El script no reescribe los enlaces: **copia los `<w:hyperlink>`** del párrafo viejo, por eso las URL siguen siendo enlaces de verdad (ojo: hay que mover **todos** los hijos del párrafo del valor, no solo los `w:r`, o los enlaces se pierden). Para ver la página 1 en imagen: `mutool draw -o p1.png -r 100 -F png <pdf> 1` (en el VPS no hay `pdftoppm`).
- En Educación, la Ingeniería de Sistemas dice **«Proceso de titulación»** (no «Título completado»): es un enlace al certificado de UniRemington y se edita en el `w:hyperlink`, no como texto suelto.
- La foto del CV no es el avatar: el avatar del sitio es `assets/img/avatar/jeffrey.svg`.
- Los márgenes son de 1,5 cm a los lados y 1,4 cm arriba y abajo; los títulos de sección llevan 13 pt antes y 6 pt después, y las viñetas 4 pt.
- El **perfil profesional y las habilidades** se reorientaron a IA (19-nov-2026, pedido del autor): LLMs, RAG, MCP, agentes, CRM, chatbots y mensajes automáticos por bot; y en habilidades, infraestructura (VPS, serverless, Terraform, CI/CD), ORM (Prisma, TypeORM, Sequelize), controladores y modelos cliente-controlador, datos (Redis, ETL) y apps auto-mantenibles y auto-escalables por medio de VPS. Al tocar el texto del `.docx` hay que conservar los runs (el primero en negrita es la etiqueta) y volver a exportar el `.pdf` con `soffice`.
- El **perfil del sitio** (`src/js/contenido/perfil.ts` y `habilidades.ts`) se orienta lo mismo que el CV (19-nov-2026): titular «Ingeniero de IA aplicada · Agentes LLM en la nube · Full Stack», roles de IA/agentes/cloud/infra, y un grupo nuevo de habilidades **«Arquitectura y controladores»** (controladores, servicios, patrón cliente-controlador, MVC). Al tocar el contenido del sitio hay que correr `deno task build` para rehacer `dist/`.
- **Perfil profesional ENRIQUECIDO** (19-nov-2026, pedido del autor: «enriquece un poco más el párrafo de perfil profesional y pon todas las palabras clave en negrita»): además de la letra a 10 pt y las negritas, los dos párrafos de PERFIL PROFESIONAL **ganan una frase cada uno** (el primero habla del foco en resolver trabajo de negocio de punta a punta; el segundo, de los equipos donde el dato, la trazabilidad y la entrega continua pesan tanto como el código). Script: `/opt/datos/perfil-cv/cv-perfil-rico.py` (python-docx: los términos se marcan entre `**asteriscos**` y el párrafo se reconstruye **clonando el `w:rPr` del run base** —10 pt, `w:b w:val="0"` para el texto normal y `w:b` para las negritas—; si no se clona el `w:rPr` el texto sale con la letra por defecto del documento y **la negrita no se ve**). Ojo: el `.docx` y el `.pdf` tienen que salir del **mismo** `.docx`, o se pisan (la foto y el perfil se pisaron varias veces por sesiones paralelas del bot en el VPS).
- **Perfil profesional más grande y palabras clave en negrita** (19-nov-2026, pedido del autor): los dos párrafos de PERFIL PROFESIONAL pasan de 9,5 pt a **10 pt** y las palabras clave quedan **en negrita** (Full Stack, agentes, LLMs, RAG, MCP, APIs, bases de datos reales, CRM, chatbots, infraestructura en la nube, VPS, serverless, CI/CD, contenedores, monitorización). También van en negrita los términos clave de las viñetas de experiencia y **los nombres de las tecnologías** de las líneas «Tecnologías: …» (antes solo la etiqueta estaba en negrita). Se hace con el script `/opt/datos/perfil-cv/keywords-bold.py` (python-docx: reconstruye los `w:r` del párrafo partiendo el texto por los términos y conservando el formato del run base; en las líneas de «Tecnologías:» deja intacta la etiqueta y solo reconstruye lo que va tras los dos puntos). Ojo: `Run` de python-docx no tiene `.copy()`, hay que clonar el XML (`copy.deepcopy(run._r)`) y envolverlo en `Run(el, parent)`. Después del cambio hay que reexportar el `.pdf` con `soffice`.
- **Perfil profesional enriquecido** (19-nov-2026, pedido del autor: «enriquece un poco más el párrafo de perfil profesional y pon todas las palabras clave en negrita»): los dos párrafos de PERFIL PROFESIONAL ahora tienen **más texto** (el primero cierra con «con un foco claro en que el sistema resuelva trabajo de negocio de punta a punta, no solo que responda»; el segundo, con «y con equipos donde el dato, la trazabilidad y la entrega continua pesan tanto como el código») y las **palabras clave en negrita**. Se hace con el script `/opt/datos/perfil-cv/cv-perfil-rico.py`: reconstruye los `w:r` del párrafo partiendo el texto por los términos marcados con `**…**` y **clonando el `w:rPr` del run base** (10 pt, `w:b w:val="0"` para el texto normal y `w:b` para las negritas). Ojo: si el `w:rPr` base no se clona, el texto sale sin formato (letra del documento por defecto) y la negrita no se ve. `.docx` sha256 `59989a90c13cd337a82d58ab349ae3b0fa6e24ce972259496dde5add30c84053` (md5 `128206d4635807b7629d2fed7e1d3bc4`); `.pdf` sha256 `3fbd949b6f4cf83e075bba5ff73c1b57924f385a98d61b95a737c601058e865c` (md5 `ef386d06cb726fe7af8b0817e83f58c2`, 2 páginas; la segunda hoja llena hasta y=652 de 792).
- **Perfil profesional: full stack, apps de punta a punta y móviles** (19-nov-2026, pedido del autor: «falta poner que soy fullstack y que fabrico las Apps de punta a punta desde el server hasta el front y que hago apps móviles»). Los dos párrafos de PERFIL PROFESIONAL dicen ahora: «…y fabrico las aplicaciones de punta a punta, desde el **servidor** hasta el **front**» y «…y también **apps móviles** con **React Native** y **Android**», con las palabras clave en negrita. Script: `/opt/datos/perfil-cv/cv-perfil-rico.py` (clona el `w:rPr` del run base; si no se clona, la negrita no sale). **Ojo**: con el token de GitHub del VPS no se ve ningún repo Android de Jeff (son 122 repos públicos y ninguno es Android; el de Lava en Casa con React Native es privado o está en otra cuenta), así que el framework que se pone es **React Native y Android**, que es lo que ya decía el propio CV y `src/js/contenido/habilidades.ts` (grupo «Móvil y escritorio»: React Native, Kotlin, Android, C#, WPF, Java). Si el autor quiere otro framework, lo dice y se cambia. `.docx` sha256 `4b9885ecb34a9261a8ec8303e261dfd9216467d215a7f595797bc0241ecca58a` (md5 `31adf1f044f64d5ad1da3f6d8b159fc9`); `.pdf` sha256 `d92ce6fdb0f7e2fdcb06d88cb04d7d4a76c6edcb8e2b6b2c7087ecab401b4e4f` (md5 `aef3e5c5aaba75e4045df4efbfe789b3`, 2 páginas).
- La sección **PROYECTOS** se quitó por petición del autor (19-nov-2026): ya no está en el CV, aunque el repo siga teniendo los productos (`proyectos.ts`). Sin ella la segunda hoja queda a la mitad.
- La tarjeta del CV del sitio dice cuántas páginas ocupa: `perfil.ts` → `cvTarjeta.paginas` (2 desde el 19-nov-2026). Si cambia el `.docx`, se actualiza ese número y se corre `deno task build`.
- **Años de experiencia en el encabezado** (19-nov-2026, pedido del autor: «en el header falta poner años de experiencia»): el grid de datos del encabezado tiene ahora una fila más en la columna izquierda, **«Experiencia / Más de 8 años»**, debajo de Correo (la celda que estaba libre). Script: `/opt/datos/perfil-cv/cv-anos-experiencia.py <entrada.docx> <salida.docx>` (python-docx: busca la primera celda vacía de la **primera columna** y clona los párrafos de etiqueta y valor de otra celda de datos, cambiando solo el texto; no se tocan el nombre, el titular, la foto ni el `tblGrid`). El número sale del propio repo: `perfil.ts` y `sitio.ts` dicen «más de 8 años» / «8+ años». `.docx` sha256 `7557532afcd7295d94dd8b5b4c0bfb008afcd3416482b1460b092891f50c9057`; `.pdf` sha256 `46116d8caa2dc306957f4c3478c6f718fe4c3a2c0bc66e25fe56c71efbd08d60`, **2 páginas**, verificado mirando la portada renderizada (pymupdf).
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

## CV (19-nov-2026, tarde)

- El encabezado del CV (`assets/docs/jeffrey-agudelo-cv.docx`) lleva el titular en una sola línea:
  «Desarrollador Full Stack (web y móvil) | Ingeniero de IA aplicada (LLMs, RAG y MCP)», y el grid de
  datos de dos columnas con «Experiencia / Más de 8 años».
- El texto del CV usa «aplicativos» en vez de «apps» (petición del autor): «desarrollo de
  aplicativos móviles», «aplicativos de punta a punta», «Aplicativos auto-mantenibles».
- Los scripts de los cambios están en `/opt/datos/perfil-cv/` (`cv-titular-simple.py`,
  `cv-aplicativos.py`) y las notas en `/opt/datos/perfil-cv/NOTAS.md`.
- **El push sigue pendiente y por eso el sitio no lo enseña** (19-nov-2026, 15:15 UTC): el autor volvió a
  pedir «en el header falta poner años de experiencia» porque en `jeff-aporta.github.io` se sigue viendo el
  CV viejo. El dato «Experiencia / Más de 8 años» sí está en el `.docx` y en el `.pdf` del VPS (verificado
  mirando la portada renderizada) y se le reenviaron por privado. Lo que falta es el `push`: el token de `gh`
  del VPS es de **solo lectura** (403 "Permission to Jeff-Aporta/Jeff-Aporta.git denied", comprobado otra vez
  con `git push --dry-run`), así que lo hace el PC. HEAD en el VPS `5e7e8a1` (38 commits por delante de
  `origin/main`), encargo en `taller/datos/buzon/para-pc/20261119T151500Z-13.md` y en el canal
  `estudio:general` (id `8ddf8331-fc40-42a6-b38d-10164c99f2d3`).
