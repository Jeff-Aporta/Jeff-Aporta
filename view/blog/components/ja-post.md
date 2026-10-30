---
name: ja-post
description: Publicación como guía narrada a todo el ancho, a partir de datos mínimos (post.json por slug o `datos`): índice de pasos con progreso, compartir, tarjeta del paso (<ja-paso>), demo fija y controles solo con ícono.
---

# `<ja-post>`

Publicación como guía narrada a todo el ancho: índice de pasos con progreso, «Compartir», tarjeta del paso (`<ja-paso>`), demo fija y controles solo con ícono (anterior, escuchar, siguiente, modo guiado); flechas del teclado. La misma pieza pinta la publicación en la SPA (`<ja-app>` la monta por slug) y en su página especializada `blog/<slug>/index.html` (HTML estático, `<ja-post slug="…">`).

**Datos mínimos.** Con `slug` descarga `blog/<slug>/post.json` (lo escribe `deno task build` desde `src/js/contenido/blog/`, con la forma de `PublicacionSchema`; se valida con Zod al leerlo y mientras llega se pintan esqueletos del kit). Con `datos` pinta directamente sin red. Si el JSON no existe o no cumple el schema, muestra «Publicación no encontrada». No lee el contenido importado: el autor (logo, nombre) sí sale de `contenido.perfil`.

**Compartir.** Entrega la URL limpia y pública `https://jeff-aporta.github.io/Jeff-Aporta/blog/<slug>/` con dos piezas del kit: `<iswc-share-button>` (Web Share con título y resumen; sin Web Share copia al portapapeles) e `<iswc-copy-button>` (copiar el enlace, con tooltip de éxito/error).

## Anatomía

```
<ja-post slug="…">
  #shadow-root
    <div part="guia">
      <aside part="indice"> volver · título · autor · <div part="compartir"> iswc-share-button + iswc-copy-button · progreso · <ol> pasos
      <section part="escenario"> <ja-paso>
      <aside part="lado"> <figure> <ja-luz-demo> + leyenda · <nav> <ja-boton-icono> ×4
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

<!-- exclude: Eventos -->

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
