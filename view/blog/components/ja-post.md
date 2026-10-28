---
name: ja-post
description: Publicación como guía narrada a todo el ancho: índice de pasos con progreso, tarjeta del paso (<ja-paso>), demo fija y controles solo con ícono (anterior, escuchar, siguiente, modo guiado); flechas del teclado.
---

# `<ja-post>`

Publicación como guía narrada a todo el ancho: índice de pasos con progreso, tarjeta del paso (<ja-paso>), demo fija y controles solo con ícono (anterior, escuchar, siguiente, modo guiado); flechas del teclado. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-post>
  #shadow-root
    <div part="guia">
      <aside part="indice"> volver · título · autor · progreso · <ol> pasos
      <section part="escenario"> <ja-paso>
      <aside part="lado"> <figure> <ja-luz-demo> + leyenda · <nav> <ja-boton-icono> ×4
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `slug` | `string` | `""` | Slug de la publicación. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-post></ja-post>
<script type="module">
  document.querySelector('ja-post').props = {"slug": "luz-y-sombra-2d"};
</script>
```
