---
name: ja-portafolio
description: Shell de la vista: portada y todas las secciones en orden; expone irA(id) y emite ja-seccion-visible.
---

# `<ja-portafolio>`

Shell de la vista: portada y todas las secciones en orden; expone irA(id) y emite ja-seccion-visible. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-portafolio>
  #shadow-root
    <ja-hero id="inicio">
    <ja-seccion id="perfil|trayectoria|experiencia|proyectos|habilidades|educacion|contacto">  ← utils/secciones.ts
      <ja-perfil> · <ja-trayectoria> · …
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

Sin props: lee el contenido central.

## Eventos

| Evento | `detail` | Cuándo |
| --- | --- | --- |
| `ja-seccion-visible` | `{ id: string }` | Cuando una sección ocupa la franja central de la ventana. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-portafolio></ja-portafolio>
```
