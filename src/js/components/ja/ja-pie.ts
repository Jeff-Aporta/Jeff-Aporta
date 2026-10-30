/**
 * <ja-pie> — pie del sitio: firma (`<ja-marca>` con titular y ubicación), redes de contacto y el
 * aviso legal con el año. Lo comparten el shell de la SPA (`<ja-app>`) y las páginas especializadas
 * (`<ja-pagina>`); el contenido sale de `contenido.perfil`.
 */
import { crearComponente, define, html, pieza } from '../../base/componente.js';
import { contenido } from '../../contenido/index.js';
import type { SinProps } from '../../consts/schemas/componentes.schemas.js';
import './ja-marca.js';

const JaPie = crearComponente<SinProps>(import.meta.url, 'ja-pie', {}, (root) => {
  const { perfil } = contenido;
  root.append(html`
    <footer class="pie" part="pie">
      <div class="interior">
        ${pieza('ja-marca', { subtitulo: `${perfil.titular} · ${perfil.ubicacion}` }, { class: 'firma' })}
        <div class="redes" part="redes">
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.github} target="_blank" rel="noopener" title="GitHub"><iswc-icon icon="mdi:github"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.youtube} target="_blank" rel="noopener" title="YouTube"><iswc-icon icon="mdi:youtube"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${perfil.contacto.whatsapp} target="_blank" rel="noopener" title="WhatsApp"><iswc-icon icon="mdi:whatsapp"></iswc-icon></iswc-button>
          <iswc-button variant="ghost" shape="pill" href=${`mailto:${perfil.contacto.email}`} title="Correo"><iswc-icon icon="mdi:email-outline"></iswc-icon></iswc-button>
        </div>
        <p class="legal" part="legal">© ${new Date().getFullYear()} ${perfil.nombreCorto}</p>
      </div>
    </footer>
  `);
});

define('ja-pie', JaPie);
