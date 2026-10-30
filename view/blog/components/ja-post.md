---
name: ja-post
description: Publicación en una sola página a partir de datos mínimos (post.json por slug o `datos`): encabezado, índice compacto con anclas y todos los pasos seguidos (<ja-paso>), cada uno con su demo y su botón discreto de narración.
---

# `<ja-post>`

Publicación en **una sola página**: encabezado (título, subtítulo, autor, fecha, etiquetas), un índice compacto con anclas y **todos los pasos seguidos** en un solo flujo de lectura (`<ja-paso>`, cada uno con su demo interactiva). Sin paginación, sin «paso N de M», sin índice lateral ni reproductor grande: cada paso con narración lleva su propio botón pequeño play/pausa y aquí vive el único `Audio` (reproducir un paso pausa el que sonara). El «Compartir» va en la barra del sitio (`<ja-app>` / `<ja-pagina>`), no dentro del post. La misma pieza pinta la publicación en la SPA (`<ja-app>` la monta por slug en `blog/<slug>/`) y en su página especializada `blog/<slug>/index.html` (HTML estático, `<ja-post slug="…">`).

**Datos mínimos.** Con `slug` descarga `blog/<slug>/post.json` (lo escribe `deno task build` desde `src/js/contenido/blog/`, con la forma de `PublicacionSchema`; se valida con Zod al leerlo y mientras llega se pintan esqueletos del kit). Con `datos` pinta directamente sin red. Si el JSON no existe o no cumple el schema, muestra «Publicación no encontrada». No lee el contenido importado: el autor (logo, nombre) sí sale de `contenido.perfil`.

## Anatomía

```
<ja-post slug="…">
  #shadow-root
    <article part="articulo">
      <header part="encabezado"> <ja-link variant="button"> volver · h1 · subtítulo · autor + fecha + pasos · etiquetas · <nav part="indice"> anclas #paso-N
      <div part="pasos"> <ja-paso id="paso-N"> ×N   (cada uno: título, botón de audio, narración, bloques, demo)
  (hijos de luz: resumen estático del post para rastreadores; el shadow root no lo muestra)
```

## Atributos observados

| Atributo | Prop | Notas |
| --- | --- | --- |
| `slug` | `slug` | Permite montar la publicación desde HTML estático, sin script. |

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `slug` | `string` | `""` | Slug de la publicación: descarga `blog/<slug>/post.json`. |
| `datos` | `Publicacion \| null` | `null` | La publicación completa (`PublicacionSchema`); evita la descarga. Si también hay `slug`, manda cuando su slug coincide. |

## Eventos

Escucha `ja-narracion { indice }` de sus `<ja-paso>` para alternar la narración (un solo audio a la vez).

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-post slug="luz-y-sombra-2d"></ja-post>
```

```html
<ja-post></ja-post>
<script type="module">
  const post = await (await fetch('./blog/luz-y-sombra-2d/post.json')).json();
  document.querySelector('ja-post').props = { datos: post };
</script>
```
