---
name: ja-barra-uso
description: Fila de uso acumulado de una tecnología: nombre, iswc-progress-bar y años acumulados con un decimal.
---

# `<ja-barra-uso>`

Fila de uso acumulado de una tecnología: nombre, iswc-progress-bar y años acumulados con un decimal. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-barra-uso>
  #shadow-root
    <span part="nombre"> · <iswc-progress-bar> · <span part="valor">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `nombre` | `string` | `""` | Tecnología. |
| `meses` | `number` | `0` | Meses de uso. |
| `maximo` | `number` | `1` | Meses de la barra llena. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-barra-uso></ja-barra-uso>
<script type="module">
  document.querySelector('ja-barra-uso').props = {"nombre": "Node.js", "meses": 94, "maximo": 94};
</script>
```
