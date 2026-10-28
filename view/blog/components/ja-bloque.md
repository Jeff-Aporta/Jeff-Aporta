---
name: ja-bloque
description: Bloque dentro de un paso de una guía: markdown (iswc-md-render), código (iswc-code) o nota (iswc-callout).
---

# `<ja-bloque>`

Bloque dentro de un paso de una guía: markdown (iswc-md-render), código (iswc-code) o nota (iswc-callout). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-bloque>
  #shadow-root
    md → <iswc-md-render> · codigo → <figure> título + <iswc-code> · nota → <iswc-callout>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `bloque` | `Bloque | null` | `null` | Bloque de PublicacionSchema. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-bloque></ja-bloque>
<script type="module">
  document.querySelector('ja-bloque').props = {"bloque": {"tipo": "nota", "tono": "info", "titulo": "Nota", "md": "Un bloque de **ejemplo**."}};
</script>
```
