---
name: ja-ilustracion
description: Ilustración corporate memphis por nombre, servida desde assets/ilustraciones/.
---

# `<ja-ilustracion>`

Ilustración corporate memphis por nombre, servida desde assets/ilustraciones/. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-ilustracion>
  #shadow-root
    <img part="imagen">  ← assets/ilustraciones/<nombre>.svg
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `nombre` | `"hero" | "trayectoria" | "proyectos" | "habilidades" | "contacto"` | `"hero"` | Ilustración a mostrar. |
| `alt` | `string` | `""` | Texto alternativo; vacío la deja decorativa (aria-hidden). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-ilustracion></ja-ilustracion>
<script type="module">
  document.querySelector('ja-ilustracion').props = {"nombre": "hero"};
</script>
```
