/**
 * <ja-link> — enlace a una página SPA calculado desde su estado `?s=` (contrato de `createSpaState`
 * del kit). General: nada aquí es del portafolio (`rutas.ts` solo lo alimenta con `estadoSpa`). Es el
 * candidato a subir al kit como `iswc-link` sin cambiar el contrato.
 *
 *   destino: `href` literal, o `state` (objeto; como atributo, JSON) → `<base>?<param>=<b64url(JSON)>`.
 *            `base`: página SPA (relativa, contra `document.baseURI`); por defecto `<html data-spa-base>`
 *            o la página actual sin query ni hash. `merge` combina `state` con el estado actual.
 *   navegación: sin lógica propia. Dentro de la SPA el interceptor de enlaces navega sin recargar;
 *            desde otra página (`blog/<slug>/`) el href absoluto a la base es navegación normal.
 *            `target`/`rel` (con `_blank`, `noopener` garantizado), `download`, `data-spa="off"` pasan al `<a>`.
 *            `aria-current="page"` + atributo `current` cuando el href coincide con la URL actual.
 *   presentación: `variant` plain | button (`iswc-button` con `color`/`size`/`shape`) | nav; `icon`;
 *            slots `start` / default / `end`; `disabled`. Parts `anchor`, `start`, `label`, `end`.
 *   API: propiedad `href` (calculado) y método `resolve()`.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import { esActual, hrefEnlace, relAuto } from '../../base/enlaces.js';
import type { EstadoEnlace } from '../../base/enlaces.js';
import type { JaLinkProps } from '../../consts/schemas/componentes.schemas.js';

type Host = HTMLElement & { props: JaLinkProps; resolve?: () => string };

const INICIAL: JaLinkProps = { href: '', state: null, param: 's', base: '', merge: false, variant: 'plain', icon: '', label: '', target: '', rel: '', download: '', disabled: false, color: '', size: '', shape: '' };

const CON_API = new WeakSet<HTMLElement>();

/** `state` como atributo llega en JSON; como prop ya es objeto. */
function estadoDe(valor: JaLinkProps['state']): EstadoEnlace | null {
  if (typeof valor !== 'string') return valor;
  try {
    const e: unknown = JSON.parse(valor);
    return typeof e === 'object' && e !== null && !Array.isArray(e) ? (e as EstadoEnlace) : null;
  } catch {
    return null;
  }
}

function resolver(props: JaLinkProps): string {
  return hrefEnlace({
    href: props.href,
    state: estadoDe(props.state),
    param: props.param,
    base: props.base,
    spaBase: document.documentElement.dataset.spaBase ?? '',
    merge: props.merge,
    actual: new URL(location.href),
    baseDoc: document.baseURI,
  });
}

const JaLink = crearComponente<JaLinkProps>(import.meta.url, 'ja-link', INICIAL, (root, props, host) => {
  const href = resolver(props);
  const actual = esActual(href, new URL(location.href), props.param);
  const rel = relAuto(props.target, props.rel);
  host.toggleAttribute('current', actual);
  host.toggleAttribute('disabled', props.disabled);
  host.dataset.variant = props.variant;
  if (!CON_API.has(host)) {
    CON_API.add(host);
    (host as Host).resolve = () => resolver((host as Host).props);
    Object.defineProperty(host, 'href', { get: () => resolver((host as Host).props), configurable: true });
  }
  const spaOff = host.getAttribute('data-spa') === 'off';
  const dentro = html`
    ${props.icon ? html`<iswc-icon class="icono" part="start" icon=${props.icon} aria-hidden="true"></iswc-icon>` : html`<slot name="start" part="start"></slot>`}
    <span class="label" part="label"><slot>${props.label}</slot></span>
    <slot name="end" part="end"></slot>
  `;
  const comunes = { href: props.disabled ? null : href, target: props.target || null, rel: rel || null, download: props.download || null, 'aria-current': actual ? 'page' : null, 'data-spa': spaOff ? 'off' : null, 'aria-disabled': props.disabled ? 'true' : null };
  const a = document.createElement(props.variant === 'button' ? 'iswc-button' : 'a');
  a.className = `anchor ${props.variant}`;
  a.setAttribute('part', 'anchor');
  for (const [k, v] of Object.entries(comunes)) if (v != null) a.setAttribute(k, v);
  if (props.variant === 'button') {
    a.setAttribute('variant', 'ghost');
    for (const [k, v] of [['color', props.color], ['size', props.size], ['shape', props.shape]] as const) if (v) a.setAttribute(k, v);
    if (props.disabled) a.setAttribute('disabled', '');
  }
  a.append(dentro);
  root.append(a);
}, undefined, ['href', 'state', 'param', 'base', 'variant', 'icon', 'label', 'target', 'rel', 'download', 'color', 'size', 'shape']);

define('ja-link', JaLink);
