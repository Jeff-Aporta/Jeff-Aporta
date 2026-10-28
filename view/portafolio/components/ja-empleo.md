---
name: ja-empleo
description: Tarjeta plegable de un empleo: cargo, empresa, fechas, duración, modalidad, logros, periodos con contrato, galería, tecnologías y certificado.
---

# `<ja-empleo>`

Tarjeta plegable de un empleo: cargo, empresa, fechas, duración, modalidad, logros, periodos con contrato, galería, tecnologías y certificado. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-empleo>
  #shadow-root
    <article part="tarjeta">
      <button class="cabeza"> logo · cargo · empresa · meta · iswc-tag (certificado)
      <div part="cuerpo"> resumen · logros · periodos · galería · tecnologías · enlaces
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string` | `""` | Id del empleo. |
| `abierto` | `boolean` | `false` | Muestra el detalle. |

## Eventos

| Evento | `detail` | Cuándo |
| --- | --- | --- |
| `ja-empleo-toggle` | `{ id, abierto }` | Al abrir o cerrar con la cabeza. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-empleo></ja-empleo>
<script type="module">
  document.querySelector('ja-empleo').props = {"id": "coremsa", "abierto": true};
</script>
```
