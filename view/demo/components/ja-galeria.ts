/**
 * Galería de componentes `ja-*` (estándar iswc-foundation).
 *
 * Lee `view/demo/manifest.json` ({tag, file} → definición `iswc-preview/v1`), VALIDA cada definición
 * con Zod (lo que no cumple se avisa y no se muestra), pinta el índice y monta la elegida en
 * `<iswc-preview-component>` del kit. Por cada bloque `demo`:
 *   - `props` del JSON se asignan a `target.props` al montar;
 *   - `controls` se pintan con `<iswc-preview-controls>`; `attr:x` escribe el atributo, `prop:x` la
 *     propiedad JS y `props:x` mezcla `{ x }` en `.props` (componentes con props).
 * Un componente nuevo entra a la galería solo con su línea en `manifest.json`.
 *
 * ORDEN (lo que la deja en blanco cuando algo falla): el LISTADO se pinta PRIMERO, con los datos de
 * la app (mismo origen: manifest y definiciones). El preview del kit llega después: sus módulos
 * vienen del LOTE local de la app (`jaLoteGaleria.min.mjs`, armado desde el mismo pin), no de un
 * `import()` al CDN en caliente. Antes era un solo `await Promise.all([...])` con dos imports
 * dinámicos al CDN: si el CDN tardaba o fallaba, el módulo moría antes de pintar nada (nav vacío,
 * sin `data-app-ready`) y la página se quedaba en blanco. Ahora la lista se ve siempre, el preview
 * se monta cuando llega y, si no llega, se avisa en el panel.
 */
import { todosLosTags } from '../../../src/js/kit-tags.js';
import {
  type ConProps, type ControlDemo, type DefinicionDemo, DefinicionDemoSchema, type LoaderGaleria, ManifestDemoSchema,
} from '../../../src/js/consts/schemas/demo.schemas.js';

const nav = document.getElementById('nav')!;
const preview = document.getElementById('preview') as HTMLElement & { preview?: unknown };

/** ¿El preview del kit ya está definido? (hasta entonces no se le puede escribir `preview`.) */
let listo = false;

function aplicar(host: Element, c: ControlDemo, valor: unknown): void {
  const [modo, nombre] = c.prop.includes(':') ? (c.prop.split(':', 2) as [string, string]) : ['attr', c.prop];
  if (modo === 'props') (host as ConProps).props = { [nombre]: c.control === 'number' ? Number(valor) : valor };
  else if (modo === 'prop') Reflect.set(host, nombre, valor);
  else if (valor === false || valor == null || valor === '') host.removeAttribute(nombre);
  else host.setAttribute(nombre, valor === true ? '' : String(valor));
}

function montarBloques(def: DefinicionDemo, main: ParentNode): void {
  for (const seccion of def.sections) {
    const caja = main.querySelector<HTMLElement>(`#${CSS.escape(seccion.id)}`);
    if (!caja) continue;
    const demos = [...caja.querySelectorAll<HTMLElement>('.demo-block')];
    let n = 0;
    for (const b of seccion.blocks) {
      if (b.kind && b.kind !== 'demo') continue;
      const zona = demos[n++] ?? caja;
      const host = b.target ? zona.querySelector(b.target) : null;
      if (!host) continue;
      if (b.props) (host as ConProps).props = { ...b.props };
      if (!b.controls?.length) continue;
      const panel = document.createElement('iswc-preview-controls') as HTMLElement & { spec: unknown[] };
      panel.setAttribute('label', 'Controles');
      panel.spec = b.controls.map((c) => ({ ...c, value: c.default ?? null }));
      panel.addEventListener('iswc-controls-change', (e) => {
        const d = (e as CustomEvent<{ def: ControlDemo; valor: unknown }>).detail;
        if (d?.def) aplicar(host, d.def, d.valor);
      });
      zona.append(panel);
    }
  }
}

/** El preview del kit se pinta con la definición elegida. */
function pintarPreview(def: DefinicionDemo): void {
  preview.preview = { definition: def, mount: (ctx: { main?: ParentNode }) => ctx.main && montarBloques(def, ctx.main) };
}

/** Aviso en el panel del preview (la lista sigue viva). */
function avisar(texto: string): void {
  const p = document.createElement('p');
  p.className = 'aviso';
  p.textContent = texto;
  preview.replaceChildren(p);
}

const defs: DefinicionDemo[] = [];
let elegida: DefinicionDemo | null = null;

function elegir(def: DefinicionDemo): void {
  elegida = def;
  for (const b of nav.querySelectorAll('iswc-button')) b.toggleAttribute('aria-current', b.getAttribute('data-tag') === def.tag);
  if (listo) pintarPreview(def);
  history.replaceState(null, '', `#${def.tag}`);
}

/* 1) EL LISTADO: manifest y definiciones son de la app (mismo origen), así que la galería se ve
   sin el kit. Va antes que nada: es lo que garantiza que la página no se queda en blanco. */
const base = new URL('./', location.href); // view/demo/
const indice = ManifestDemoSchema.parse(await fetch(new URL('manifest.json', base)).then((r) => r.json()));
for (const item of indice) {
  const r = DefinicionDemoSchema.safeParse(await fetch(new URL(item.file, base)).then((x) => x.json()));
  if (r.success) defs.push(r.data);
  else console.warn(`[galería] ${item.file} no cumple iswc-preview/v1:`, r.error.issues);
}

for (const def of defs) {
  const b = document.createElement('iswc-button');
  b.setAttribute('variant', 'plain');
  b.setAttribute('data-tag', def.tag);
  b.textContent = def.navTitle;
  b.addEventListener('iswc-click', () => elegir(def));
  nav.append(b);
}
const inicial = defs.find((d) => `#${d.tag}` === location.hash) ?? defs[0];
if (inicial) elegir(inicial);
// El listado ya está pintado: la página se revela (no se espera al kit).
document.documentElement.setAttribute('data-app-ready', '');

/* 2) EL PREVIEW del kit: el loader pide sus tags (el LOTE local de la app los trae del mismo pin).
   Si el kit no llega, la lista sigue y se avisa: la página nunca se queda en blanco. */
const L = (globalThis as { iswcLoader?: LoaderGaleria }).iswcLoader;
if (!L) avisar('No se pudo cargar el kit (el loader del CDN no llegó): la lista está, el preview no.');
else {
  try {
    await L.load('iswc-preview-component', 'iswc-preview-controls', 'iswc-callout', ...todosLosTags());
    await customElements.whenDefined('iswc-preview-component');
    listo = true;
    if (elegida) pintarPreview(elegida);
  } catch (e) {
    console.warn('[galería] el preview del kit no llegó', e);
    avisar('No se pudo montar el preview del kit (mira la consola): la lista está completa.');
  }
}
