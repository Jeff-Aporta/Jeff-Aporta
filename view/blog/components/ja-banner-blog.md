---
name: ja-banner-blog
description: Portada animada en SVG: caricatura de Jeffrey tecleando, código que se escribe en la hoja, aviones de papel, taza humeante, título en papel recortado y muro de texto; respeta prefers-reduced-motion.
---

# `<ja-banner-blog>`

Portada animada en SVG: caricatura de Jeffrey tecleando, código que se escribe en la hoja, aviones de papel, taza humeante, título en papel recortado y muro de texto; respeta prefers-reduced-motion. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-banner-blog>
  #shadow-root
    <div class="muro"> lema repetido
    <div class="escena"> <svg> formas · título · escritorio · caricatura · hoja · aviones
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

Sin props: lee el contenido central.

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-banner-blog></ja-banner-blog>
```
