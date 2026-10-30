---
name: ja-paso
description: Tarjeta discreta y neutra de un paso de una guía, recibido por props: número y título, botón pequeño play/pausa de la narración, el texto del paso, bloques, demo interactiva y, en el último paso, los créditos.
---

# `<ja-paso>`

Tarjeta de un paso de una guía, **discreta y neutra** (superficie del kit, todas iguales): número y título, un único botón pequeño play/pausa en la esquina superior derecha si el paso tiene narración (`iswc-button` ghost circular, `aria-label` «Reproducir/Pausar la narración del paso N»), la narración como texto normal del paso, los bloques (`<ja-bloque>`), la demo interactiva del paso (`<ja-luz-demo>`) si la trae y, en el último paso, los créditos. Recibe todo por props (no lee el contenido importado): `<ja-post>` le pasa el paso que viene de `post.json`. El botón emite `ja-narracion`; quién suena lo decide `<ja-post>` y lo refleja en `sonando`.

## Anatomía

```
<ja-paso id="paso-N">
  #shadow-root
    <article part="tarjeta">
      <header> número · h2 (ícono + título) · <iswc-button part="audio"> play/pausa
      <p part="narracion">
      <div part="bloques"> <ja-bloque> ×N
      <figure part="demo"> <ja-luz-demo> + leyenda
      <iswc-callout class="creditos"> (solo en el último paso, si hay créditos)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `paso` | `PasoGuia \| null` | `null` | El paso (título, ícono, narración, bloques, demo). Sin paso no pinta nada. |
| `indice` | `number` | `0` | Índice del paso (desde 0): número y `id="paso-N"`. |
| `total` | `number` | `1` | Cuántos pasos tiene la guía (para saber cuál es el último). |
| `creditos` | `string` | `""` | Créditos de la publicación; se pintan solo en el último paso. |
| `audio` | `string` | `""` | URL de la narración; vacía = sin botón. |
| `sonando` | `boolean` | `false` | El paso está sonando: botón en pausa y `data-sonando` en el host (solo cambia el botón, no repinta). |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `ja-narracion` | `{ indice }` | Al pulsar el botón de audio (alternar). |

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
    audio: 'assets/blog/luz-y-sombra-2d/voz/02.mp3',
  };
</script>
```
