---
name: ja-luz-demo
description: Demo interactiva de luz y sombra 2D por paso (0 a 8): sigue al cursor o al dedo y, sin interacción, la luz recorre la escena; solo anima mientras está visible.
---

# `<ja-luz-demo>`

Demo interactiva de luz y sombra 2D por paso (0 a 8): sigue al cursor o al dedo y, sin interacción, la luz recorre la escena; solo anima mientras está visible. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-luz-demo>
  #shadow-root
    <div part="marco"> <canvas 840×360>
    <p part="ayuda">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `paso` | `0…8` | `0` | Paso del tutorial a dibujar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-luz-demo></ja-luz-demo>
<script type="module">
  document.querySelector('ja-luz-demo').props = {"paso": 5};
</script>
```
