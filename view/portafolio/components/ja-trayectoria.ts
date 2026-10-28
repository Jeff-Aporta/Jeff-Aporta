/**
 * <ja-trayectoria> — la experiencia como gráfico de ramas (al estilo del grafo de commits de GitHub):
 * un tronco que llega a la actualidad y una rama por vinculación, que nace en su inicio y vuelve al
 * tronco en su fin. Las vinculaciones simultáneas corren en ramas paralelas. Cada fila es un `<ja-hito>`.
 *
 * Es la única sección de experiencia: cada fila de una empresa (inicio, fin, periodo y cambio de contrato)
 * lleva su certificado y «Ver detalle», que abre un `iswc-dialog` con la ficha completa (`<ja-empleo>`
 * abierto, con el sitio web de la empresa). La del subproyecto lleva su propio botón.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import { eventos, totalCarriles } from '../utils/trayectoria.js';
import './ja-empleo.js';
import './ja-hito.js';

const JaTrayectoria = crearComponente<SinProps>(import.meta.url, 'ja-trayectoria', {}, (root) => {
  const lista = eventos();
  const carriles = totalCarriles(lista);
  root.append(html`
    <ol class="grafo" part="grafo" aria-label="Trayectoria laboral">${lista.map((evento) => html`<li>${pieza('ja-hito', { evento, carriles, acciones: !!evento.empleoId && evento.tipo !== 'sub' })}</li>`)}</ol>
    <iswc-dialog class="modal" light-dismiss backdrop-variant="basic"><div class="ficha"></div></iswc-dialog>
  `);
  root.addEventListener('ja-hito-detalle', (ev) => {
    const id = (ev as CustomEvent<{ id: string }>).detail.id;
    const empleo = contenido.experiencia.find((x) => x.id === id);
    const dialogo = root.querySelector('iswc-dialog') as HTMLElement & { label: string; open: boolean };
    dialogo.label = empleo ? `${empleo.cargo} · ${empleo.empresa}` : '';
    dialogo.querySelector('.ficha')!.replaceChildren(pieza('ja-empleo', { id, abierto: true }));
    dialogo.open = true;
  });
});

define('ja-trayectoria', JaTrayectoria);
