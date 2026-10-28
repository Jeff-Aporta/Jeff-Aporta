---
name: ja-estudio
description: Tarjeta de un estudio por id: sello, nivel y año, título, institución, lugar, nota y certificado.
---

# `<ja-estudio>`

Tarjeta de un estudio por id: sello, nivel y año, título, institución, lugar, nota y certificado. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-estudio>
  #shadow-root
    <article part="tarjeta"> sello · nivel · título · institución · lugar · nota · iswc-button (certificado)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string` | `""` | Id del estudio. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-estudio></ja-estudio>
<script type="module">
  document.querySelector('ja-estudio').props = {"id": "sena"};
</script>
```
