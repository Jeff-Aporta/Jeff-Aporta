---
name: ja-paso
description: Tarjeta de papel de un paso de una guía, recibido por props: sello con el número, ícono de plastilina, título, transcripción de la narración y bloques; en el último paso, los créditos.
---

# `<ja-paso>`

Tarjeta de papel de un paso de una guía: sello con el número, ícono de plastilina, título, transcripción de la narración y bloques (`<ja-bloque>`); en el último paso, los créditos. Recibe el paso por props (no lee el contenido importado): `<ja-post>` le pasa el paso que viene de `post.json`.

## Anatomía

```
<ja-paso>
  #shadow-root
    <article part="tarjeta"> pliegue · sello · título · ícono
      <blockquote part="narracion">
      <div part="bloques"> <ja-bloque> ×N
      <iswc-callout class="creditos"> (solo en el último paso, si hay créditos)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `paso` | `PasoGuia \| null` | `null` | El paso (título, ícono, narración, bloques, demo). Sin paso no pinta nada. |
| `indice` | `number` | `0` | Índice del paso (desde 0): sello y «Paso N de M». |
| `total` | `number` | `1` | Cuántos pasos tiene la guía. |
| `creditos` | `string` | `""` | Créditos de la publicación; se pintan solo en el último paso. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-paso></ja-paso>
<script type="module">
  document.querySelector('ja-paso').props = {
    paso: { titulo: 'Rayos', icono: 'mdi:white-balance-sunny', narracion: 'Lanzamos un rayo…', bloques: [], demo: null },
    indice: 2,
    total: 10,
  };
</script>
```
