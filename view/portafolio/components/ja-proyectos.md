---
name: ja-proyectos
description: Catálogo de proyectos en pestañas del kit: productos y laboratorio creativo.
---

# `<ja-proyectos>`

Catálogo de proyectos en pestañas del kit: productos y laboratorio creativo. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-proyectos>
  #shadow-root
    <iswc-tab-group part="pestanas"> iswc-tab ×2 · iswc-tab-panel ×2 → <ja-proyecto> ×N
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tipo` | `"Producto" | "Laboratorio"` | `"Producto"` | Pestaña activa al pintar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-proyectos></ja-proyectos>
<script type="module">
  document.querySelector('ja-proyectos').props = {"tipo": "Producto"};
</script>
```
