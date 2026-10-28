---
name: ja-hito
description: Fila del gráfico de ramas: fecha, tramo del grafo (tronco, ramas que cruzan, curva hacia el tronco y punto) y tarjeta del evento (inicio, fin o actualidad).
---

# `<ja-hito>`

Fila del gráfico de ramas: fecha, tramo del grafo (tronco, ramas que cruzan, curva hacia el tronco y punto) y tarjeta del evento (inicio, fin o actualidad). El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-hito>
  #shadow-root
    <time class="fecha">
    <div part="tramo"> líneas · curva SVG · punto
    <article part="tarjeta"> etiqueta · logo · cargo · empresa · detalle
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `evento` | `EventoGrafo | null` | `null` | Evento del grafo (de grafoTrayectoria()). |
| `carriles` | `number` | `1` | Carriles del gráfico (ancho del tramo). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-hito></ja-hito>
<script type="module">
  document.querySelector('ja-hito').props = {"evento": {"clave": "insoft-0-inicio", "tipo": "inicio", "fecha": "2025-09-01", "carril": 1, "pasantes": [2], "empleoId": "insoft", "periodo": 0, "ultimo": false}, "carriles": 3};
</script>
```
