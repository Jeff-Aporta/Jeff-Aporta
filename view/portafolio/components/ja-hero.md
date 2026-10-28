---
name: ja-hero
description: Portada: ubicación, nombre, titular, propuesta, roles, llamados a la acción, retrato sobre ilustración, formas animadas, insignias y cifras (iswc-stat).
---

# `<ja-hero>`

Portada: ubicación, nombre, titular, propuesta, roles, llamados a la acción, retrato sobre ilustración, formas animadas, insignias y cifras (iswc-stat). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-hero>
  #shadow-root
    <div class="texto"> iswc-tag · h1 · titular · propuesta · roles · iswc-button ×3
    <div class="visual"> <ja-ilustracion> · retrato · tarjetas flotantes ×3
    <dl part="cifras"> ×4  ← derivados.cifras()
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
<ja-hero></ja-hero>
```
