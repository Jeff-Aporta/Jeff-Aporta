/**
 * <ja-ilustracion> — ilustración corporate memphis por nombre.
 *
 * Si el nombre tiene composición por piezas en `contenido.ilustraciones` («complex»), se arma con sus
 * piezas (`assets/ilustraciones/<nombre>/<pieza>`) posicionadas en porcentaje del lienzo; cada pieza
 * lleva su profundidad (`--prof`) y se desplaza con el cursor (parallax de `base/paralaje.ts`). Si no,
 * se pinta el SVG `assets/ilustraciones/<nombre>.svg`, que se mueve entero, más suave.
 *
 * Decorativa por defecto (`alt` vacío → `aria-hidden`); con `alt` se anuncia como imagen.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import { contenido, rutaSitio } from '../../contenido/index.js';
import type { JaIlustracionProps } from '../../consts/schemas/componentes.schemas.js';

const pct = (n: number, total: number) => `${((n / total) * 100).toFixed(3)}%`;

const JaIlustracion = crearComponente<JaIlustracionProps>(import.meta.url, 'ja-ilustracion', { nombre: 'hero', alt: '' }, (root, props) => {
  const compo = contenido.ilustraciones[props.nombre];
  if (!compo) {
    const src = rutaSitio(`assets/ilustraciones/${props.nombre}.svg`);
    root.append(html`<img class="plana" part="imagen" src=${src} alt=${props.alt} aria-hidden=${props.alt ? 'false' : 'true'} loading="lazy" decoding="async">`);
    return;
  }
  const { ancho, alto } = compo;
  root.append(html`
    <div class="lienzo" part="imagen" role=${props.alt ? 'img' : null} aria-label=${props.alt || null} aria-hidden=${props.alt ? 'false' : 'true'} style=${`aspect-ratio:${ancho} / ${alto}`}>
      ${compo.piezas.map((p) => 'elipse' in p
        ? html`<span class="pieza sombra" style=${`left:${pct(p.elipse[0], ancho)};top:${pct(p.elipse[1], alto)};width:${pct(p.elipse[2], ancho)};height:${pct(p.elipse[3], alto)};--prof:${p.prof}`}></span>`
        : html`<img class="pieza" src=${rutaSitio(`assets/ilustraciones/${props.nombre}/${p.src}`)} alt="" loading="lazy" decoding="async"
            style=${`left:${pct(p.x, ancho)};top:${pct(p.y, alto)};width:${pct(p.w * p.escala, ancho)};--prof:${p.prof};--giro:${p.giro ?? 0}deg;opacity:${p.opacidad ?? 1}`}>`)}
    </div>
  `);
});

define('ja-ilustracion', JaIlustracion);
