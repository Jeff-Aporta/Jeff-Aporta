---
name: ja-insignia
description: Pastilla elevada con ícono, título y subtítulo que flota suavemente en loop.
---

# `<ja-insignia>`

Pastilla elevada con ícono, título y subtítulo que flota suavemente en loop. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-insignia>
  #shadow-root
    <iswc-icon part="icono">
    <span> <strong> · <small>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `icono` | `string` | `"mdi:star-outline"` | Ícono set:nombre. |
| `titulo` | `string` | `""` | Título. |
| `subtitulo` | `string` | `""` | Subtítulo. |
| `flotar` | `boolean` | `true` | Animación de flotación. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-insignia></ja-insignia>
<script type="module">
  document.querySelector('ja-insignia').props = {"icono": "mdi:language-typescript", "titulo": "TypeScript", "subtitulo": "Web Components"};
</script>
```
