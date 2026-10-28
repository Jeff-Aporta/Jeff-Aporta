---
name: ja-proyecto
description: Tarjeta de un proyecto por id: portada, categoría, descripción, tecnologías y enlaces (demo, código, video).
---

# `<ja-proyecto>`

Tarjeta de un proyecto por id: portada, categoría, descripción, tecnologías y enlaces (demo, código, video). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-proyecto>
  #shadow-root
    <article part="tarjeta"> <div part="portada"> imagen/logo · iswc-tag · cuerpo · acciones (iswc-button)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string` | `""` | Id del proyecto. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-proyecto></ja-proyecto>
<script type="module">
  document.querySelector('ja-proyecto').props = {"id": "fyxtoken"};
</script>
```
