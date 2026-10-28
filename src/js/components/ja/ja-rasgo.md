---
name: ja-rasgo
description: Tarjeta de rasgo: baldosa de ícono con tono, título, texto y un slot para extras (etiquetas).
---

# `<ja-rasgo>`

Tarjeta de rasgo: baldosa de ícono con tono, título, texto y un slot para extras (etiquetas). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-rasgo>
  #shadow-root
    <article part="tarjeta">
      <header> <span part="icono"> · <h3 part="titulo">
      <p>
      <slot>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `icono` | `string` | `"mdi:star-outline"` | Ícono set:nombre. |
| `titulo` | `string` | `""` | Título. |
| `texto` | `string` | `""` | Descripción. |
| `tono` | `"marca" | "acento" | "exito" | "peligro" | "lila"` | `"marca"` | Color de la baldosa. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-rasgo></ja-rasgo>
<script type="module">
  document.querySelector('ja-rasgo').props = {"icono": "mdi:puzzle-outline", "titulo": "Sistemas de diseño", "texto": "Componentes reutilizables y documentados.", "tono": "marca"};
</script>
```
