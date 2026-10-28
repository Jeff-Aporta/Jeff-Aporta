---
name: ja-trayectoria
description: La experiencia como gráfico de ramas al estilo GitHub: tronco hasta la actualidad y una rama por vinculación (inicio y fin); las simultáneas corren en paralelo.
---

# `<ja-trayectoria>`

La experiencia como gráfico de ramas al estilo GitHub: tronco hasta la actualidad y una rama por vinculación (inicio y fin); las simultáneas corren en paralelo. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-trayectoria>
  #shadow-root
    <ol part="grafo"> <ja-hito> por fila  ← derivados.grafoTrayectoria()
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
<ja-trayectoria></ja-trayectoria>
```
