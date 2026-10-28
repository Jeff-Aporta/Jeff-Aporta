/**
 * <ja-forma> — figura memphis decorativa (círculo, anillo, triángulo, onda, zigzag, puntos…) con una
 * animación suave en loop (girar, flotar, latir, derivar). Siempre decorativa (`aria-hidden`); el
 * contenedor la posiciona. Respeta `prefers-reduced-motion`.
 */
import { crearComponente, define } from '../../base/componente.js';
import type { JaFormaProps } from '../../consts/schemas/componentes.schemas.js';

const DIBUJOS: Record<JaFormaProps['tipo'], string> = {
  circulo: '<circle cx="50" cy="50" r="46" fill="currentColor"/>',
  anillo: '<circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="14"/>',
  semicirculo: '<path d="M4 72a46 46 0 0 1 92 0Z" fill="currentColor"/>',
  triangulo: '<path d="M50 8 94 88H6Z" fill="currentColor"/>',
  cruz: '<path d="M50 12v76M12 50h76" stroke="currentColor" stroke-width="16" stroke-linecap="round"/>',
  onda: '<path d="M6 50c11-18 22-18 33 0s22 18 33 0 22-18 22-18" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>',
  zigzag: '<path d="M6 62 24 38l18 24 18-24 18 24 16-22" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>',
  puntos: [0, 1, 2, 3].flatMap((f) => [0, 1, 2, 3].map((c) => `<circle cx="${14 + c * 24}" cy="${14 + f * 24}" r="6" fill="currentColor"/>`)).join(''),
};

const JaForma = crearComponente<JaFormaProps>(
  import.meta.url,
  'ja-forma',
  { tipo: 'circulo', tono: 'marca', tam: 3, animacion: 'flotar', retraso: 0 },
  (root, props, host) => {
    host.setAttribute('aria-hidden', 'true');
    host.dataset.tono = props.tono;
    host.dataset.animacion = props.animacion;
    host.style.setProperty('--tam', `${props.tam}rem`);
    host.style.setProperty('--retraso', `${props.retraso}s`);
    // Profundidad del parallax con el cursor: las formas grandes parecen más cerca y se mueven más.
    host.style.setProperty('--prof', String(Math.min(1.4, 0.45 + props.tam * 0.12).toFixed(2)));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('part', 'figura');
    svg.innerHTML = DIBUJOS[props.tipo]; // dibujos constantes de este módulo, nunca datos externos
    root.append(svg);
  },
);

define('ja-forma', JaForma);
