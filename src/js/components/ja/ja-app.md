---
name: ja-app
description: Shell del portafolio: barra fija con marca, navegación por secciones y tema; la vista y el pie.
---

# `<ja-app>`

Shell del portafolio: barra fija con marca, navegación por secciones y tema; la vista y el pie (`<ja-pie>`). Enruta con `src/js/base/rutas.ts`: la raíz muestra el portafolio, `blog/` la lista y `blog/<slug>/` una publicación (URL limpias, sin recargar). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-app>
  #shadow-root
    <header part="barra"> marca · <nav> · iswc-theme-toggle
    <main part="vista"> <ja-portafolio> | <ja-blog> | <ja-post slug>
    <ja-pie part="pie"> firma · redes · legal
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `seccion` | `string` | `"inicio"` | Sección marcada como activa en la navegación. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-app></ja-app>
```
