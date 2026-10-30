---
name: ja-pie
description: Pie del sitio: firma con la marca, redes de contacto y aviso legal con el año; lo comparten la SPA y las páginas especializadas del blog.
---

# `<ja-pie>`

Pie del sitio: firma con la marca (`<ja-marca>` con titular y ubicación), redes de contacto (GitHub, YouTube, WhatsApp, correo) y aviso legal con el año. Lo comparten el shell de la SPA (`<ja-app>`) y las páginas especializadas (`<ja-pagina>`). El contenido sale de `src/js/contenido/perfil.ts`; el componente solo pinta.

## Anatomía

```
<ja-pie>
  #shadow-root
    <footer part="pie">
      <ja-marca class="firma"> · <div part="redes"> iswc-button ×4 · <p part="legal">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

Sin props: lee `contenido.perfil`.

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-pie></ja-pie>
```
