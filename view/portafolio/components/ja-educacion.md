---
name: ja-educacion
description: Formación académica en tarjetas, con nota de honor y certificado cuando existen.
---

# `<ja-educacion>`

Formación académica en tarjetas, con nota de honor y certificado cuando existen. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-educacion>
  #shadow-root
    <ol part="lista"> tarjetas: sello · nivel/año · título · institución · lugar · nota · iswc-button (certificado)
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
<ja-educacion></ja-educacion>
```
