---
name: ja-link
description: Enlace a una página SPA calculado desde su estado ?s= (contrato de createSpaState del kit): href literal o `state` + `base`, variantes plain/button/nav, icono y slots. Candidato a subir al kit como iswc-link.
---

# `<ja-link>`

Enlace a una página SPA calculado desde su estado `?s=` (el contrato de `createSpaState` del kit): recibe un `href` literal **o** un `state` (objeto; como atributo, JSON) y arma `<base>?<param>=<b64url(JSON)>`. Es general: nada del portafolio vive aquí; `src/js/base/rutas.ts` solo lo alimenta (`estadoSpa(ruta)`). **Candidato a subir al kit como `iswc-link`** sin cambiar el contrato (ver `reuso` en su `.json`).

Navegación sin lógica propia: dentro de la SPA el interceptor de enlaces navega sin recargar (atraviesa shadow roots); desde una página especializada (`blog/<slug>/`, con `<html data-spa-base="../../">`) el href absoluto a la base es navegación normal y aterriza en el SPA.

## Anatomía

```
<ja-link state='{"v":"blog"}' icon="mdi:arrow-left">Todas las publicaciones</ja-link>
  #shadow-root
    <a part="anchor" href="…?s=…" [aria-current="page"]>
      <iswc-icon part="start"> | <slot name="start" part="start">
      <span part="label"><slot>label</slot></span>
      <slot name="end" part="end">
  variant="button" → <iswc-button part="anchor" variant="ghost" color size shape href>
```

## Atributos observados

| Atributo | Prop | Notas |
| --- | --- | --- |
| `href`, `state` (JSON), `param`, `base`, `variant`, `icon`, `label`, `target`, `rel`, `download`, `color`, `size`, `shape` | la homónima | Permiten usarlo desde HTML estático. `data-spa="off"` pasa al `<a>` (el interceptor lo ignora). |
| `current` | — | Lo escribe el componente cuando el href coincide con la URL actual (misma base y `?s=` normalizado). |
| `data-spa-base` en `<html>` | — | Base SPA por defecto de toda la página (`../../` en `blog/<slug>/`). |

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `href` | `string` | `""` | Destino literal; gana sobre `state`. |
| `state` | `object \| string \| null` | `null` | Estado SPA a serializar en `?<param>=`; vacío deja la base sin query. |
| `param` | `string` | `"s"` | Nombre del parámetro. |
| `base` | `string` | `""` | Página SPA destino (relativa, contra `document.baseURI`); vacía = `data-spa-base` o la página actual sin query ni hash. |
| `merge` | `boolean` | `false` | Combina `state` con el estado actual de la URL en vez de reemplazarlo. |
| `variant` | `'plain' \| 'button' \| 'nav'` | `"plain"` | Enlace de texto, `iswc-button` (ghost) o pastilla de navegación. |
| `icon` | `string` | `""` | Ícono Iconify al inicio (`set:nombre`). |
| `label` | `string` | `""` | Texto cuando no hay contenido en el slot. |
| `target`, `rel`, `download` | `string` | `""` | Pasan al `<a>`; con `_blank` se añade `noopener` si falta. |
| `disabled` | `boolean` | `false` | Sin `href`, `aria-disabled`. |
| `color`, `size`, `shape` | `string` | `""` | Solo con `variant="button"`: pasan a `iswc-button`. |

Propiedad pública `href` (el calculado) y método `resolve()`.

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Uso |
| --- | --- |
| `start` | Antes del texto (si no hay `icon`). |
| default | El texto del enlace (si no, `label`). |
| `end` | Después del texto. |

## Ejemplos

```html
<ja-link state='{"v":"post","p":"luz-y-sombra-2d"}'>Luz y sombra en 2D</ja-link>
<ja-link state='{"sec":"contacto"}' base="../../" variant="button" icon="mdi:account-tie-outline">Ir al portafolio</ja-link>
<ja-link href="https://github.com/Jeff-Aporta" target="_blank">GitHub</ja-link>
```
