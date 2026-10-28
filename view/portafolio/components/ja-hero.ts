/**
 * <ja-hero> — portada: ubicación, nombre, titular, propuesta, roles (`<ja-lista>`), llamados a la
 * acción, retrato sobre la ilustración memphis con `<ja-insignia>` y `<ja-forma>` animadas, y las
 * cifras (`iswc-stat` del kit) calculadas desde la trayectoria. Cada cifra abre un `iswc-dialog` a todo
 * el ancho con la lista completa de lo que cuenta (empleos, empresas, proyectos o tecnologías).
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import { cifras, duracion, mesesEmpleo, rangoEmpleo } from '../../../src/js/contenido/derivados.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-forma.js';
import '../../../src/js/components/ja/ja-ilustracion.js';
import '../../../src/js/components/ja/ja-insignia.js';
import '../../../src/js/components/ja/ja-lista.js';

const totalTecnologias = () => new Set(contenido.habilidades.flatMap((g) => g.items)).size;

/** Contenido del modal de cada cifra: lo que esa cifra cuenta, completo. */
function detalle(clave: string) {
  const { experiencia, proyectos, habilidades } = contenido;
  const marca = (e: (typeof experiencia)[number]) => e.logo
    ? html`<img class="marca" src=${rutaSitio(e.logo)} alt="" loading="lazy">`
    : html`<span class="marca icono"><iswc-icon icon=${e.icono ?? 'mdi:domain'}></iswc-icon></span>`;
  if (clave === 'experiencia') {
    return html`<ol class="lista">${experiencia.map((e) => html`
      <li>${marca(e)}<div><strong>${e.cargo}</strong><span>${e.empresa} · ${rangoEmpleo(e)}</span></div><em>${duracion(mesesEmpleo(e))}</em></li>`)}</ol>
      <p class="nota">Los trabajos al mismo tiempo cuentan una sola vez en el total.</p>`;
  }
  if (clave === 'empresas') {
    const unicas = experiencia.filter((e, i) => experiencia.findIndex((x) => x.empresa === e.empresa) === i);
    return html`<ul class="lista">${unicas.map((e) => html`
      <li>${marca(e)}<div><strong>${e.empresa}</strong><span>${e.sector}</span></div><em>${e.ubicacion}</em></li>`)}</ul>`;
  }
  if (clave === 'proyectos') {
    const tipos = [...new Set(proyectos.map((p) => p.tipo))];
    return html`${tipos.map((tipo) => html`
      <h3>${tipo === 'Producto' ? 'Maquetas' : tipo}</h3>
      <ul class="lista">${proyectos.filter((p) => p.tipo === tipo).map((p) => html`
        <li><span class="marca icono"><iswc-icon icon="mdi:rocket-launch-outline"></iswc-icon></span><div><strong>${p.titulo}</strong><span>${p.categoria}</span></div>
          <a href=${p.demo ?? p.codigo} target="_blank" rel="noopener" aria-label=${`Abrir ${p.titulo}`}><iswc-icon icon="mdi:arrow-top-right"></iswc-icon></a></li>`)}</ul>`)}`;
  }
  return html`${habilidades.map((g) => html`
    <h3><iswc-icon icon=${g.icono}></iswc-icon>${g.titulo} <small>${g.items.length}</small></h3>
    <div class="tags">${g.items.map((t) => html`<iswc-tag variant="soft" pill>${t}</iswc-tag>`)}</div>`)}`;
}

const FORMAS = [
  { clase: 'f1', props: { tipo: 'triangulo', tono: 'peligro', tam: 2.2, animacion: 'girar', retraso: 3 } },
  { clase: 'f2', props: { tipo: 'onda', tono: 'marca', tam: 4, animacion: 'derivar', retraso: 1 } },
  { clase: 'f3', props: { tipo: 'cruz', tono: 'lila', tam: 1.6, animacion: 'girar', retraso: 8 } },
  { clase: 'f4', props: { tipo: 'circulo', tono: 'acento', tam: 1.2, animacion: 'latir', retraso: 2 } },
  { clase: 'f5', props: { tipo: 'zigzag', tono: 'exito', tam: 3.2, animacion: 'flotar', retraso: 5 } },
];

const INSIGNIAS = [
  { clase: 'uno', props: { icono: 'mdi:language-typescript', titulo: 'TypeScript', subtitulo: 'Web Components' } },
  { clase: 'dos', props: { icono: 'mdi:robot-happy-outline', titulo: 'IA aplicada', subtitulo: 'LLM · MCP' } },
  { clase: 'tres', props: { icono: 'mdi:server-network', titulo: 'APIs', subtitulo: 'REST · GraphQL' } },
];

const JaHero = crearComponente<SinProps>(import.meta.url, 'ja-hero', {}, (root) => {
  const { perfil, experiencia, proyectos } = contenido;
  const ir = (id: string) => () => {
    const portafolio = (root.host.getRootNode() as ShadowRoot).host as (HTMLElement & { irA?(id: string): void }) | undefined;
    portafolio?.irA?.(id);
  };
  const lista = cifras(experiencia, proyectos.length, totalTecnologias());
  const abrir = (c: (typeof lista)[number]) => () => {
    const dialogo = root.querySelector('iswc-dialog') as HTMLElement & { label: string; open: boolean };
    const cuerpo = dialogo.querySelector('.detalle')!;
    dialogo.label = `${c.etiqueta} · ${c.valor}`;
    cuerpo.replaceChildren(detalle(c.clave));
    dialogo.open = true;
  };
  root.append(html`
    ${FORMAS.map((f) => pieza('ja-forma', f.props, { class: `forma ${f.clase}` }))}
    <div class="contenedor principal">
      <div class="texto">
        <iswc-tag class="ubicacion" color="brand" variant="soft" pill><iswc-icon slot="start" class="bandera" icon=${perfil.bandera}></iswc-icon>${perfil.ubicacion}</iswc-tag>
        <p class="saludo">Hola, soy</p>
        <h1 class="nombre" part="nombre">${perfil.nombreCorto}</h1>
        <p class="titular">${perfil.titular}</p>
        <p class="propuesta">${perfil.propuesta}</p>
        ${pieza('ja-lista', { items: perfil.roles, variante: 'linea', tono: 'exito' })}
        <div class="acciones">
          <iswc-button color="brand" variant="filled" shape="pill" oniswc-click=${ir('proyectos')}>
            Ver proyectos <iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
          </iswc-button>
          <iswc-button color="brand" variant="outlined" shape="pill" oniswc-click=${ir('trayectoria')}>
            <iswc-icon slot="start" icon="mdi:timeline-outline"></iswc-icon> Trayectoria
          </iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${rutaSitio(perfil.cv)} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:file-eye-outline"></iswc-icon> Hoja de vida
          </iswc-button>
        </div>
      </div>
      <div class="visual">
        ${pieza('ja-ilustracion', { nombre: 'hero' }, { class: 'fondo' })}
        <figure class="retrato">
          <img src=${rutaSitio(perfil.foto.src)} alt=${perfil.foto.alt} width="717" height="694" fetchpriority="high">
        </figure>
        ${INSIGNIAS.map((i, k) => pieza('ja-insignia', i.props, { class: `insignia ${i.clase}`, style: `animation-delay:-${k * 2}s` }))}
      </div>
    </div>
    <div class="contenedor cifras" part="cifras">
      ${lista.map((c) => html`
        <button class="cifra" type="button" aria-haspopup="dialog" onclick=${abrir(c)}>
          <iswc-stat label=${c.etiqueta} value=${c.valor} helper=${c.detalle} icon=${c.icono} color="brand"></iswc-stat>
          <span class="ver">Ver todo <iswc-icon icon="mdi:arrow-expand"></iswc-icon></span>
        </button>`)}
    </div>
    <iswc-dialog class="modal" light-dismiss backdrop-variant="basic"><div class="detalle"></div></iswc-dialog>
  `);
});

define('ja-hero', JaHero);
