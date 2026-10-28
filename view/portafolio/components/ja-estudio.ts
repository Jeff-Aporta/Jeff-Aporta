/**
 * <ja-estudio> — tarjeta de un estudio, por id: sello, nivel y año (o «en curso» con su semestre),
 * título, institución (enlazada a su sitio), lugar, nota de honor y certificado si existen.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { contenido } from '../../../src/js/contenido/index.js';
import type { JaEstudioProps } from '../../../src/js/consts/schemas/componentes.schemas.js';

const JaEstudio = crearComponente<JaEstudioProps>(import.meta.url, 'ja-estudio', { id: '' }, (root, props) => {
  const s = contenido.educacion.find((x) => x.id === props.id);
  if (!s) return;
  root.append(html`
    <article class="tarjeta" part="tarjeta">
      <div class="sello"><iswc-icon icon=${s.icono}></iswc-icon><span>${s.sigla}</span></div>
      <div class="texto">
        <p class="nivel">${s.nivel} · ${s.cursando ?? s.anio}</p>
        <h3>${s.titulo}</h3>
        <p class="institucion">${s.sitio ? html`<a href=${s.sitio} target="_blank" rel="noopener">${s.institucion}</a>` : s.institucion}</p>
        <p class="lugar"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${s.lugar}</p>
        ${s.nota ? html`<p class="nota"><iswc-icon icon="mdi:trophy-outline"></iswc-icon>${s.nota}</p>` : null}
      </div>
      ${s.certificado ? html`<iswc-button class="certificado" color="success" variant="soft" shape="pill" href=${s.certificado} target="_blank" rel="noopener"><iswc-icon slot="start" icon="mdi:file-certificate-outline"></iswc-icon>Certificado</iswc-button>` : null}
    </article>
  `);
});

define('ja-estudio', JaEstudio);
