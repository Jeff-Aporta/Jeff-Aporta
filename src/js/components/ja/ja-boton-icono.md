---
name: ja-boton-icono
description: Botón redondo solo con ícono en volumen de plastilina; la etiqueta va a aria-label y al tooltip. Con href es enlace; activo lo deja hundido.
---

# `<ja-boton-icono>`

Botón redondo solo con ícono en volumen de plastilina; la etiqueta va a aria-label y al tooltip. Con href es enlace; activo lo deja hundido. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-boton-icono>
  #shadow-root
    <a|button part="boton"> <iswc-icon>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `icono` | `string` | `"mdi:circle-outline"` | Ícono de Iconify. |
| `etiqueta` | `string` | `""` | Texto accesible y tooltip. |
| `href` | `string` | `""` | Si se da, es un enlace. |
| `tono` | `"papel" | "marca" | "acento"` | `"papel"` | Color. |
| `tam` | `"md" | "lg"` | `"md"` | Tamaño. |
| `activo` | `boolean` | `false` | Hundido (alternadores). |
| `deshabilitado` | `boolean` | `false` | Apagado. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-boton-icono></ja-boton-icono>
<script type="module">
  document.querySelector('ja-boton-icono').props = {"icono": "mdi:play", "etiqueta": "Escuchar", "tono": "marca", "tam": "lg"};
</script>
```
