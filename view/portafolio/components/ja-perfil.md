---
name: ja-perfil
description: Perfil profesional: video de presentación, resumen y los cuatro pilares.
---

# `<ja-perfil>`

Perfil profesional: video de presentación, resumen y los cuatro pilares. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-perfil>
  #shadow-root
    <div class="principal"> <ja-video> · resumen · iswc-button (canal)
    <ul part="pilares"> ×4
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
<ja-perfil></ja-perfil>
```
