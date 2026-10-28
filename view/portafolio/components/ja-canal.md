---
name: ja-canal
description: Canal de contacto: ícono, título y valor como enlace (toda la fila clicable) y, opcional, iswc-copy-button.
---

# `<ja-canal>`

Canal de contacto: ícono, título y valor como enlace (toda la fila clicable) y, opcional, iswc-copy-button. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-canal>
  #shadow-root
    <span part="icono"> · <a part="enlace"> · iswc-copy-button | flecha
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `icono` | `string` | `"mdi:link"` | Ícono. |
| `titulo` | `string` | `""` | Rótulo. |
| `valor` | `string` | `""` | Texto visible. |
| `url` | `string` | `""` | Destino (mailto:, tel:, https:). |
| `copiar` | `string` | `""` | Texto a copiar; vacío muestra la flecha. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-canal></ja-canal>
<script type="module">
  document.querySelector('ja-canal').props = {"icono": "mdi:email-outline", "titulo": "Correo", "valor": "correo@ejemplo.com", "url": "mailto:correo@ejemplo.com", "copiar": "correo@ejemplo.com"};
</script>
```
