---
name: ja-seccion
description: Bloque de página con cejilla, título, entrada, ilustración opcional y fondo alterno; el contenido va en el slot.
---

# `<ja-seccion>`

Bloque de página con cejilla, título, entrada, ilustración opcional y fondo alterno; el contenido va en el slot. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-seccion>
  #shadow-root
    <span class="forma"> ×2 (memphis)
    <div part="contenedor">
      <header part="encabezado"> cejilla · <h2 part="titulo"> · entrada · <ja-ilustracion part="ilustracion">
      <div part="cuerpo"><slot>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `cejilla` | `string` | `""` | Rótulo corto sobre el título. |
| `titulo` | `string` | `""` | Título de la sección (h2). |
| `entrada` | `string` | `""` | Párrafo de entrada. |
| `fondo` | `"base" | "suave" | "marca"` | `"base"` | Fondo de la sección. |
| `ilustracion` | `nombre de ilustración | null` | `null` | Ilustración a la derecha del encabezado. |

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Uso |
| --- | --- |
| (default) | Contenido de la sección. |

## Ejemplos

```html
<ja-seccion></ja-seccion>
<script type="module">
  document.querySelector('ja-seccion').props = {"cejilla": "Sección", "titulo": "Título de ejemplo", "entrada": "Texto de entrada.", "fondo": "suave", "ilustracion": "proyectos"};
</script>
```
