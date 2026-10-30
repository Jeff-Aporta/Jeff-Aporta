---
name: ja-pagina
description: Shell mínimo de una página especializada del blog: barra fija con marca, enlaces a las vistas y tema; la vista en el slot; y el pie común. No enruta, cada enlace carga su página.
---

# `<ja-pagina>`

Shell mínimo de una página especializada (`blog/index.html`, `blog/<slug>/index.html`): barra fija con la marca (enlace a la portada), las dos vistas (Yo, Blog) como enlaces y el tema; la vista que monta la propia página en el slot; y el pie común (`<ja-pie>`). A diferencia de `<ja-app>`, no enruta ni carga vistas: cada enlace carga su página (la portada con `?s=`, el blog con su URL limpia). Las URL salen de `src/js/base/rutas.ts` (`hrefDe`).

## Anatomía

```
<ja-pagina activa="blog">
  #shadow-root
    <header part="barra"> marca · <nav part="vistas"> a ×2 · iswc-theme-toggle
    <main part="contenido"> <slot>
    <ja-pie>
  <ja-post slug="…"> (hijo de luz: la vista de la página)
```

## Atributos observados

| Atributo | Prop | Notas |
| --- | --- | --- |
| `activa` | `activa` | Permite montar el shell desde HTML estático, sin script. |

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `activa` | `'portafolio' \| 'blog'` | `"blog"` | Vista marcada como actual en la barra. |

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Uso |
| --- | --- |
| default | La vista de la página (`<ja-post>` o `<ja-blog>`). |

## Ejemplos

```html
<ja-pagina activa="blog">
  <ja-post slug="luz-y-sombra-2d"></ja-post>
</ja-pagina>
```
