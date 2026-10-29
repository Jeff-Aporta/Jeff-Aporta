# 30 — Portafolio y hoja de vida

## 1. Propósito

Presentar a Jeffrey Agudelo como hoja de vida, catálogo de proyectos y perfil profesional, en un sitio
estático publicable en GitHub Pages, con el contenido separado de la UI.

## 2. Alcance

Una SPA con dos vistas: el portafolio (`view/portafolio/`) con portada, perfil y video, trayectoria, experiencia, proyectos,
habilidades, educación y contacto; y el blog (`view/blog/`) con publicaciones quemadas. Fuera: backend, base de datos, formularios con envío.

## 3. Requisitos (WHAT)

| ID | Requisito |
| --- | --- |
| W-CON-01 | Todo el contenido cumple `ContenidoSchema`; un dato inválido rompe el gate, no la página. |
| W-CON-02 | Las duraciones se expresan en meses enteros redondeados hacia arriba, sin días. |
| W-CON-03 | La experiencia total cuenta cada mes del calendario una sola vez. |
| W-CON-04 | Ninguna tecnología acumula más tiempo que la experiencia total. |
| W-CON-05 | Todo archivo local referenciado por el contenido existe. |
| W-CON-06 | La trayectoria une empleos y estudios, del más reciente al más antiguo. |
| W-SIT-01 | `index.html` trae título, descripción, canonical, Open Graph, Twitter y JSON-LD generados del contenido. |
| W-SIT-02 | Existen `sitemap.xml`, `robots.txt`, `site.webmanifest` y `.nojekyll`. |
| W-SIT-03 | Existen los íconos del manifest, el favicon, el logo y la imagen social. |
| W-SIT-04 | Ninguna ruta de la app es absoluta a la raíz del dominio (el sitio vive en `/Jeff-Aporta/`). |
| W-SIT-05 | Todo lo que las páginas piden de `dist/cdn/` lleva el `?v=` de su hash vigente: la caché del navegador nunca sirve un arranque viejo. |
| W-SIT-06 | `index.html` lleva, dentro de `<ja-app>`, un resumen estático del contenido (nombre, trayectoria, proyectos, habilidades, educación, blog y contacto) que un rastreador lee sin ejecutar JS. |
| W-POR-01 | La portada muestra el nombre y cuatro cifras calculadas. |
| W-POR-02 | Están todas las secciones de la navegación, en orden. |
| W-POR-03 | La trayectoria alterna lados y se filtra por experiencia o formación. |
| W-POR-04 | Una tarjeta de empleo se abre y se cierra, y lo avisa con `ja-empleo-toggle`. |
| W-BLG-01 | Cada publicación cumple `PublicacionSchema`, con slug único y portada existente. |
| W-BLG-02 | El post «Luz y sombra en 2D» trae una demo interactiva por cada paso (0 a 8). |
| W-SPA-01 | Las rutas por hash van y vuelven: portafolio (con sección), blog y publicación. |
| W-SPA-02 | La pestaña Blog lleva a la lista, una tarjeta abre la publicación y Portafolio regresa, sin errores. |
| W-LUZ-01 | La intersección rayo-segmento acierta y descarta paralelos, choques detrás del rayo y fuera del segmento. |
| W-LUZ-02 | El polígono de visión queda dentro de la escena y ordenado por ángulo. |

## 4. HOW STRONG

- Tema claro por defecto, paleta propia `jeff`; colores solo con tokens `--iswc-*`.
- Animaciones sutiles en loop y al aparecer; con `prefers-reduced-motion` no hay movimiento.
- Responsive de 320 px a escritorio ancho, sin desbordes horizontales.

## 5. Pruebas

`tests/contenido/`, `tests/sitio/` (sin navegador) y `tests/e2e/00.portafolio.test.ts` (Stagehand).

## 6. Riesgos

Contratos simultáneos en la experiencia: se muestran tal cual, y los totales nunca los suman dos veces.

## 7. Pendientes

Confirmar tecnologías y logros de Ferremateriales (hoy solo lo certificado).
