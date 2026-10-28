---
name: ja-contacto
description: Canales de contacto (correo y teléfono con copia) y tarjeta de llamado a la acción.
---

# `<ja-contacto>`

Canales de contacto (correo y teléfono con copia) y tarjeta de llamado a la acción. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-contacto>
  #shadow-root
    <ul part="canales"> ×5 (iswc-copy-button en correo y teléfono)
    <aside part="cta"> <ja-ilustracion> · título · texto · iswc-button ×3
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
<ja-contacto></ja-contacto>
```
