---
name: ja-video
description: Video de YouTube con fachada: miniatura y botón; el reproductor (youtube-nocookie) se carga solo al pulsar.
---

# `<ja-video>`

Video de YouTube con fachada: miniatura y botón; el reproductor (youtube-nocookie) se carga solo al pulsar. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-video>
  #shadow-root
    <button part="marco" class="fachada"> miniatura · velo · play · leyenda
    — o —
    <div part="marco"> <iframe>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `youtubeId` | `string` | `""` | Id de 11 caracteres del video. |
| `titulo` | `string` | `"Video"` | Título accesible y leyenda. |
| `activo` | `boolean` | `false` | true carga el reproductor. |

## Eventos

| Evento | `detail` | Cuándo |
| --- | --- | --- |
| `ja-video-play` | `{ youtubeId: string }` | Al pulsar la fachada. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-video></ja-video>
<script type="module">
  document.querySelector('ja-video').props = {"youtubeId": "32WdPbuVcdg", "titulo": "Presentación profesional"};
</script>
```
