---
name: ja-post-tarjeta
description: Tarjeta de una publicación por slug: portada, fecha, número de pasos, título, resumen y etiquetas; toda la tarjeta enlaza a la publicación.
---

# `<ja-post-tarjeta>`

Tarjeta de una publicación por slug: portada, fecha, número de pasos, título, resumen y etiquetas; toda la tarjeta enlaza a la publicación. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-post-tarjeta>
  #shadow-root
    <a part="tarjeta" href="?s=…"> portada · meta · h3 · resumen · iswc-tag ×N · leer
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
<ja-post-tarjeta></ja-post-tarjeta>
<script type="module">
  document.querySelector('ja-post-tarjeta').props = {"slug": "luz-y-sombra-2d"};
</script>
```
