---
name: ja-marca
description: Identidad: logo circular con el avatar ilustrado de Jeffrey, nombre y subtítulo; el logo gira levemente al pasar el cursor.
---

# `<ja-marca>`

Identidad: logo circular con el avatar ilustrado de Jeffrey, nombre y subtítulo; el logo gira levemente al pasar el cursor. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-marca>
  #shadow-root
    <img part="logo">
    <span> <strong part="nombre"> · <small part="subtitulo">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `subtitulo` | `string` | `"Full Stack Developer"` | Texto bajo el nombre. |
| `compacta` | `boolean` | `false` | Oculta el subtítulo. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-marca></ja-marca>
<script type="module">
  document.querySelector('ja-marca').props = {"subtitulo": "Full Stack Developer"};
</script>
```
