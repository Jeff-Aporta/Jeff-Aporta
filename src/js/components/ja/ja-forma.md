---
name: ja-forma
description: Figura memphis decorativa con animación suave en loop (girar, flotar, latir, derivar); respeta prefers-reduced-motion.
---

# `<ja-forma>`

Figura memphis decorativa con animación suave en loop (girar, flotar, latir, derivar); respeta prefers-reduced-motion. El contenido sale de `src/js/contenido/` (validado con Zod); el componente solo pinta.

## Anatomía

```
<ja-forma>
  #shadow-root
    <svg part="figura" viewBox="0 0 100 100">  ← dibujo según `tipo`, color por `tono`
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tipo` | `"circulo" | "anillo" | "semicirculo" | "triangulo" | "cruz" | "onda" | "zigzag" | "puntos"` | `"circulo"` | Figura. |
| `tono` | `"marca" | "acento" | "exito" | "peligro" | "lila"` | `"marca"` | Color (tokens del kit). |
| `tam` | `number` | `3` | Tamaño en rem. |
| `animacion` | `"girar" | "flotar" | "latir" | "derivar" | "ninguna"` | `"flotar"` | Animación en loop. |
| `retraso` | `number` | `0` | Desfase del ciclo en segundos. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<ja-forma></ja-forma>
<script type="module">
  document.querySelector('ja-forma').props = {"tipo": "triangulo", "tono": "peligro", "tam": 4, "animacion": "girar"};
</script>
```
