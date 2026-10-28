/**
 * gestos.ts — gestos táctiles comunes.
 *
 *   deslizar(el, ir)  un deslizamiento horizontal con el dedo sobre `el` llama `ir(1)` (hacia la
 *                     izquierda: siguiente) o `ir(-1)` (hacia la derecha: anterior).
 *
 * Solo cuenta el tacto (no el ratón) y solo cuando el gesto es claramente horizontal: el desplazamiento
 * vertical sigue siendo del navegador (`el` debe llevar `touch-action: pan-y`). Un gesto que empieza
 * dentro de algo que se desplaza en horizontal (una tira de pestañas) se deja a ese elemento.
 */
const UMBRAL = 56;

function enDesplazableX(ev: PointerEvent, el: HTMLElement): boolean {
  for (const n of ev.composedPath()) {
    if (n === el) return false;
    if (n instanceof HTMLElement && n.scrollWidth > n.clientWidth + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowX)) return true;
  }
  return false;
}

export function deslizar(el: HTMLElement, ir: (paso: 1 | -1) => void): void {
  let inicio: { x: number; y: number; id: number } | null = null;
  el.addEventListener('pointerdown', (ev) => {
    inicio = ev.pointerType === 'touch' && !enDesplazableX(ev, el) ? { x: ev.clientX, y: ev.clientY, id: ev.pointerId } : null;
  });
  el.addEventListener('pointercancel', () => (inicio = null));
  el.addEventListener('pointerup', (ev) => {
    if (!inicio || ev.pointerId !== inicio.id) return;
    const dx = ev.clientX - inicio.x;
    const dy = ev.clientY - inicio.y;
    inicio = null;
    if (Math.abs(dx) >= UMBRAL && Math.abs(dx) > Math.abs(dy) * 1.6) ir(dx < 0 ? 1 : -1);
  });
}
