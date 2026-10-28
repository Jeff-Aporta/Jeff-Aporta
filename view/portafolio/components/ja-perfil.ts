/**
 * <ja-perfil> — perfil profesional: video de presentación (`<ja-video>`), resumen, la tarjeta «Conoce mi
 * CV actualizado» (ícono con capturas reales del PDF) y los pilares como `<ja-rasgo>`.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import type { SinProps, Tono } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-forma.js';
import '../../../src/js/components/ja/ja-rasgo.js';
import './ja-video.js';

const TONOS: Tono[] = ['marca', 'acento', 'exito', 'peligro'];

const JaPerfil = crearComponente<SinProps>(import.meta.url, 'ja-perfil', {}, (root) => {
  const { perfil } = contenido;
  root.append(html`
    <div class="principal">
      <div class="video">
        ${pieza('ja-forma', { tipo: 'puntos', tono: 'acento', tam: 6, animacion: 'derivar' }, { class: 'deco puntos' })}
        ${pieza('ja-forma', { tipo: 'anillo', tono: 'peligro', tam: 3.5, animacion: 'girar', retraso: 4 }, { class: 'deco anillo' })}
        ${pieza('ja-video', { youtubeId: perfil.video.youtubeId, titulo: perfil.video.titulo })}
      </div>
      <div class="resumen">
        ${perfil.resumen.map((p, i) => html`<p class=${i === 0 ? 'lead' : ''}>${p}</p>`)}
        <iswc-button color="brand" variant="soft" shape="pill" href=${perfil.video.canal} target="_blank" rel="noopener">
          <iswc-icon slot="start" icon="mdi:youtube"></iswc-icon> Canal de YouTube
        </iswc-button>
        <article class="cv" part="cv">
          <a class="portada" href=${rutaSitio(perfil.cv)} target="_blank" rel="noopener" aria-label="Abrir la hoja de vida en PDF">
            <img src=${rutaSitio(perfil.cvTarjeta.icono)} alt="" width="256" height="256" loading="lazy">
          </a>
          <div class="cv-texto">
            <h3>Conoce mi CV actualizado</h3>
            <p>${perfil.cvTarjeta.paginas} ${perfil.cvTarjeta.paginas === 1 ? 'página' : 'páginas'} · PDF · actualizado en ${perfil.cvTarjeta.actualizado}</p>
            <div class="cv-acciones">
              <iswc-button color="brand" variant="filled" shape="pill" href=${rutaSitio(perfil.cv)} target="_blank" rel="noopener">
                <iswc-icon slot="start" icon="mdi:eye-outline"></iswc-icon> Ver
              </iswc-button>
              <iswc-button color="brand" variant="outlined" shape="pill" href=${rutaSitio(perfil.cv)} download="Jeffrey-Agudelo-CV.pdf" target="_blank" rel="noopener">
                <iswc-icon slot="start" icon="mdi:download"></iswc-icon> Descargar
              </iswc-button>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div class="pilares" part="pilares">
      ${perfil.pilares.map((p, i) => pieza('ja-rasgo', { icono: p.icono, titulo: p.titulo, texto: p.texto, tono: TONOS[i % TONOS.length] }))}
    </div>
  `);
});

define('ja-perfil', JaPerfil);
