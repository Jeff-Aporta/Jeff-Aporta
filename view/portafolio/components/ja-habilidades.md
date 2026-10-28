---
name: ja-habilidades
description: Áreas de capacidad con sus tecnologías y el uso real acumulado por tecnología (sin doble conteo).
---

# `<ja-habilidades>`

Áreas de capacidad con sus tecnologías y el uso real acumulado por tecnología (sin doble conteo). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-habilidades>
  #shadow-root
    <div part="areas"> tarjetas por área (iswc-tag)
    <section part="uso"> barras iswc-progress-bar  ← derivados.usoTecnologias()
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
<ja-habilidades></ja-habilidades>
```
