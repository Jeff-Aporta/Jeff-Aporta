/**
 * <ja-app> — shell de la SPA: barra fija (marca, pestañas de `iswc-app-nav` y tema), la vista
 * activa y el pie.
 *
 * Rutas en `?s=` con el `createSpaState` del kit (ver `base/rutas.ts`): sin estado o `{ sec }` muestran
 * el portafolio, `{ v: 'blog' }` la lista y `{ v: 'post', p }` una publicación. La fila principal elige la
 * vista; la secundaria (solo en el portafolio) es una franja propia a todo el ancho, en el tono
 * secundario, que lleva a cada sección y se marca sola al hacer scroll (`ja-seccion-visible`): la URL
 * queda al día sin crear historial.
 *
 * Carga perezosa: cada vista pide sus componentes al loader del kit (`tagsVista`) la primera vez que se
 * abre; el elemento se monta enseguida y se actualiza al definirse. `vistaLista` es la promesa de la vista
 * inicial: el arranque la espera antes de revelar la página.
 */
import { crearComponente, define, html, pieza } from '../../base/componente.js';
import { iniciarParalaje } from '../../base/paralaje.js';
import { alCambiarRuta, hrefDe, leerRuta, navegar } from '../../base/rutas.js';
import { contenido } from '../../contenido/index.js';
import { tagsVista, type Vista } from '../../kit-tags.js';
import { LoaderAppSchema } from '../../consts/schemas/loader.schemas.js';
import type { JaAppProps, RutaSpa } from '../../consts/schemas/componentes.schemas.js';
import './ja-marca.js';

type Nav = HTMLElement & { rows: unknown[] };
type Portafolio = HTMLElement & { irA?(id: string, suave?: boolean): void };

const ESCUCHANDO = new WeakSet<HTMLElement>();
const CARGAS = new Map<Vista, Promise<unknown>>();

/** Pide al loader del kit los tags de una vista (una vez por vista); sin loader no hace nada. */
function cargarVista(vista: Vista): Promise<unknown> {
  const loader = LoaderAppSchema.safeParse((globalThis as { iswcLoader?: unknown }).iswcLoader);
  if (!loader.success) return Promise.resolve();
  if (!CARGAS.has(vista)) CARGAS.set(vista, loader.data.load(...tagsVista(vista)).catch((e) => console.warn(`[ja] vista ${vista}`, e)));
  return CARGAS.get(vista)!;
}

function filas(ruta: RutaSpa, seccion: string) {
  const { sitio } = contenido;
  return [
    {
      id: 'vista',
      label: 'Vistas',
      value: ruta.vista === 'portafolio' ? 'portafolio' : 'blog',
      tabs: [
        { id: 'portafolio', label: 'Yo', icon: 'mdi:account-tie-outline', href: hrefDe({ vista: 'portafolio', seccion: 'inicio' }) },
        { id: 'blog', label: 'Blog', icon: 'mdi:post-outline', href: hrefDe({ vista: 'blog' }) },
      ],
    },
    {
      id: 'seccion',
      label: 'Secciones de Yo',
      parent: 'portafolio',
      value: seccion,
      tabs: sitio.secciones.map((s) => ({ id: s.id, label: s.titulo, href: hrefDe({ vista: 'portafolio', seccion: s.id }) })),
    },
  ];
}

function titulo(ruta: RutaSpa): string {
  const { sitio, blog, perfil } = contenido;
  if (ruta.vista === 'blog') return `Blog · ${perfil.nombreCorto}`;
  if (ruta.vista === 'post') return `${blog.find((p) => p.slug === ruta.slug)?.titulo ?? 'Publicación'} · ${perfil.nombreCorto}`;
  return sitio.titulo;
}

const JaApp = crearComponente<JaAppProps>(import.meta.url, 'ja-app', { seccion: 'inicio' }, (root, _props, host) => {
  const { perfil } = contenido;
  root.append(html`
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <header class="barra" part="barra">
      <div class="interior">
        <a class="marca" href=${hrefDe({ vista: 'portafolio', seccion: 'inicio' })} aria-label="Ir al inicio">${pieza('ja-marca', { subtitulo: 'Full Stack Developer' })}</a>
        <iswc-app-nav class="pestanas"></iswc-app-nav>
        <div class="acciones">
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </div>
      </div>
      <div class="franja" part="franja">
        <div class="interior"><iswc-app-nav class="secciones"></iswc-app-nav></div>
      </div>
    </header>
    <main id="contenido" class="vista" part="vista"></main>
    <footer class="pie" part="pie">
      <div class="interior">
        ${pieza('ja-marca', { subtitulo: `${perfil.titular} · ${perfil.ubicacion}` }, { class: 'firma' })}
        <div class="redes">
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.github} target="_blank" rel="noopener" title="GitHub"><iswc-icon icon="mdi:github"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.youtube} target="_blank" rel="noopener" title="YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.whatsapp} target="_blank" rel="noopener" title="WhatsApp"><iswc-icon icon="mdi:whatsapp"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${`mailto:${perfil.contacto.email}`} title="Correo"><iswc-icon icon="mdi:email-outline"></iswc-icon></iswc-button>
        </div>
        <p class="legal">© ${new Date().getFullYear()} ${perfil.nombreCorto}</p>
      </div>
    </footer>
  `);
  const nav = root.querySelector('.pestanas') as Nav;
  const secciones = root.querySelector('.secciones') as Nav;
  const franja = root.querySelector('.franja') as HTMLElement;
  const vista = root.querySelector('main')!;
  let actual: RutaSpa | null = null;
  // Sección a la que se está saltando: mientras no llegue, el scroll-spy no reescribe hash ni pestaña
  // (si no, al cargar marcaba «inicio» y el enlace directo se perdía). La suelta cualquier gesto del visitante.
  let pendiente: string | null = null;
  for (const ev of ['wheel', 'touchstart', 'keydown']) addEventListener(ev, () => (pendiente = null), { passive: true });

  const marcar = (ruta: RutaSpa, seccion: string) => {
    const [principal, secundaria] = filas(ruta, seccion);
    nav.rows = [principal];
    secciones.rows = [{ ...secundaria, parent: undefined }];
    franja.hidden = ruta.vista !== 'portafolio';
  };

  const mostrar = () => {
    const ruta = leerRuta();
    const cambioVista = !actual || actual.vista !== ruta.vista || (ruta.vista === 'post' && actual.vista === 'post' && actual.slug !== ruta.slug);
    if (cambioVista) {
      (host as HTMLElement & { vistaLista?: Promise<unknown> }).vistaLista = cargarVista(ruta.vista === 'portafolio' ? 'portafolio' : 'blog');
      vista.replaceChildren(ruta.vista === 'portafolio' ? pieza('ja-portafolio', {}) : ruta.vista === 'blog' ? pieza('ja-blog', {}) : pieza('ja-post', { slug: ruta.slug }));
    }
    document.title = titulo(ruta);
    marcar(ruta, ruta.vista === 'portafolio' ? ruta.seccion : 'inicio');
    if (ruta.vista === 'portafolio' && ruta.seccion !== 'inicio') {
      // Tras montar el portafolio (su definición se carga aparte), la sección pedida se lleva a la vista.
      pendiente = ruta.seccion;
      customElements.whenDefined('ja-portafolio').then(() => requestAnimationFrame(() => requestAnimationFrame(() => (vista.querySelector('ja-portafolio') as Portafolio | null)?.irA?.(ruta.seccion, !cambioVista))));
    } else if (cambioVista || (ruta.vista === 'portafolio' && actual?.vista === 'portafolio')) {
      scrollTo({ top: 0, behavior: cambioVista ? 'auto' : 'smooth' });
    }
    actual = ruta;
  };

  root.addEventListener('iswc-nav-select', (ev) => {
    const d = (ev as CustomEvent<{ row: string; id: string }>).detail;
    if (d.row === 'vista') navegar(d.id === 'blog' ? { vista: 'blog' } : { vista: 'portafolio', seccion: 'inicio' });
    else navegar({ vista: 'portafolio', seccion: d.id });
  });
  root.querySelector('.marca')?.addEventListener('click', (ev) => {
    ev.preventDefault();
    navegar({ vista: 'portafolio', seccion: 'inicio' });
  });
  // La sección visible marca su pestaña y deja la URL al día sin crear historial (ni volver a saltar).
  let silencio = false;
  root.addEventListener('ja-seccion-visible', (ev) => {
    const id = (ev as CustomEvent<{ id: string }>).detail?.id;
    if (!id || actual?.vista !== 'portafolio') return;
    if (pendiente) {
      if (id !== pendiente) return;
      pendiente = null;
    }
    marcar(actual, id);
    actual = { vista: 'portafolio', seccion: id };
    silencio = true;
    navegar(actual, 'replace');
    silencio = false;
  });
  if (!ESCUCHANDO.has(host)) {
    ESCUCHANDO.add(host);
    alCambiarRuta(() => host.isConnected && (host as HTMLElement & { recargarRuta?(): void }).recargarRuta?.());
  }
  (host as HTMLElement & { recargarRuta?(): void }).recargarRuta = () => silencio || mostrar();
  iniciarParalaje();
  mostrar();
});

define('ja-app', JaApp);
