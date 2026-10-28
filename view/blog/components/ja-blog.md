---
name: ja-blog
description: Vista del blog: banner animado, encabezado de sección y una tarjeta por publicación, de la más reciente a la más antigua.
---

# `<ja-blog>`

Vista del blog: banner animado, encabezado de sección y una tarjeta por publicación, de la más reciente a la más antigua. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-blog>
  #shadow-root
    <ja-banner-blog>
    <ja-seccion> cejilla · título · entrada
      <div part="lista"> <ja-post-tarjeta> ×N
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
<ja-blog></ja-blog>
```
