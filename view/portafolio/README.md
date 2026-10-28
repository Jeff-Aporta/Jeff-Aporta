# view/portafolio — el portafolio y hoja de vida

Vista única del sitio: portada, perfil con video, trayectoria, experiencia, proyectos,
habilidades, educación y contacto. Todo el texto sale de `src/js/contenido/` (contenido central);
los componentes solo pintan.

```
view/portafolio/
├── index.html          ← la vista sola (QA aislado), mismo kit y pin que la app
├── README.md           ← alcance y contrato (este archivo)
├── demo/index.html     ← cada pieza aislada
├── components/         ← <tag>.ts + .scss + .md + .json, y all.ts (barril de la vista)
└── utils/              ← dominio sin DOM: secciones.ts (orden y encabezados), trayectoria.ts (hitos)
```

| Dentro | Fuera |
| --- | --- |
| Secciones del portafolio y sus tarjetas | Barra, navegación y pie (los pone `<ja-app>`) |
| Encabezados de sección (`utils/secciones.ts`) | Datos (perfil, empleos, proyectos…): `src/js/contenido/` |

- **Shell**: `<ja-portafolio>`; expone `irA(id)` y emite `ja-seccion-visible { id }`.
- **Registro**: `VIEW_TAGS.portafolio` en `src/js/kit-tags.ts`.
- **Pruebas**: `tests/contenido/` (datos y derivados) y `tests/e2e/` (UI).
