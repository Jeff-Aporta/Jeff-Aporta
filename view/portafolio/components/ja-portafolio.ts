/**
 * <ja-portafolio> — shell de la vista `portafolio`: todas las secciones en orden.
 *
 * Cada sección es un `<ja-seccion>` con su id (el de `contenido.sitio.secciones`). Expone `irA(id)`
 * para que el shell navegue, y emite `ja-seccion-visible { id }` cuando una sección ocupa la vista.
 */
import { crearComponente, define, emitir, html, pieza } from '../../../src/js/base/componente.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import { SECCIONES } from '../utils/secciones.js';
import '../../../src/js/components/ja/ja-seccion.js';
import './ja-hero.js';
import './ja-perfil.js';
import './ja-trayectoria.js';
import './ja-proyectos.js';
import './ja-habilidades.js';
import './ja-educacion.js';
import './ja-contacto.js';

const OBSERVADORES = new WeakMap<HTMLElement, IntersectionObserver>();

const JaPortafolio = crearComponente<SinProps>(import.meta.url, 'ja-portafolio', {}, (root, _props, host) => {
  root.append(html`
    <ja-hero id="inicio"></ja-hero>
    ${SECCIONES.map((s) => pieza('ja-seccion', s.props, { id: s.id }, document.createElement(s.tag)))}
  `);
  OBSERVADORES.get(host)?.disconnect();
  const observador = new IntersectionObserver((entradas) => {
    const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) emitir(host, 'ja-seccion-visible', { id: visible.target.id });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] });
  for (const el of root.querySelectorAll('[id]')) observador.observe(el);
  OBSERVADORES.set(host, observador);
});

// `suave` = false al entrar por un enlace directo: salto inmediato y se re-alinea mientras la página
// termina de montar (secciones e imágenes cambian de alto); si el visitante desplaza, se deja de corregir.
Object.defineProperty(JaPortafolio.prototype, 'irA', {
  value(this: HTMLElement, id: string, suave = true) {
    const destino = this.shadowRoot?.getElementById(id);
    if (!destino) return;
    if (suave) {
      destino.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    let tocado = false;
    const soltar = () => (tocado = true);
    for (const ev of ['wheel', 'touchstart', 'keydown']) addEventListener(ev, soltar, { once: true, passive: true });
    // 'instant': el html tiene scroll-behavior: smooth y con 'auto' el salto también se animaría.
    const alinear = () => tocado || destino.scrollIntoView({ behavior: 'instant', block: 'start' });
    alinear();
    for (const ms of [150, 500, 1200, 2500]) setTimeout(alinear, ms);
  },
});

define('ja-portafolio', JaPortafolio);
