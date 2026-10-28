---
name: ja-lista
description: Lista con un ícono por ítem, en columna (logros) o en línea (roles).
---

# `<ja-lista>`

Lista con un ícono por ítem, en columna (logros) o en línea (roles). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-lista>
  #shadow-root
    <ul part="lista"> <li> iswc-icon · texto
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `string[]` | `[]` | Ítems. |
| `icono` | `string` | `"mdi:check-circle"` | Ícono de cada ítem. |
| `tono` | `"marca" | "acento" | "exito" | "peligro" | "lila"` | `"exito"` | Color del ícono. |
| `variante` | `"columna" | "linea"` | `"columna"` | Disposición. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-lista></ja-lista>
<script type="module">
  document.querySelector('ja-lista').props = {"items": ["Full Stack", "IA aplicada", "Liderazgo técnico"], "variante": "linea"};
</script>
```
