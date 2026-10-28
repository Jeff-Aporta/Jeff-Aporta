---
name: ja-paso
description: Tarjeta de papel de un paso de una guía: sello con el número, ícono de plastilina, título, transcripción de la narración y bloques; en el último paso, los créditos.
---

# `<ja-paso>`

Tarjeta de papel de un paso de una guía: sello con el número, ícono de plastilina, título, transcripción de la narración y bloques; en el último paso, los créditos. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-paso>
  #shadow-root
    <article part="tarjeta"> pliegue · sello · título · ícono
      <blockquote part="narracion">
      <div part="bloques"> <ja-bloque> ×N
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `slug` | `string` | `""` | Slug de la publicación. |
| `indice` | `number` | `0` | Índice del paso (desde 0). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-paso></ja-paso>
<script type="module">
  document.querySelector('ja-paso').props = {"slug": "luz-y-sombra-2d", "indice": 2};
</script>
```
