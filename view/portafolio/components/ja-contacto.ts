/**
 * <ja-contacto> — canales de contacto (`<ja-canal>`, correo y teléfono con copia) y una tarjeta del
 * kit (`iswc-card`) con la ilustración y los llamados a la acción.
 */
import { crearComponente, define, html, pieza } from '../../../src/js/base/componente.js';
import { contenido, rutaSitio } from '../../../src/js/contenido/index.js';
import type { SinProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import '../../../src/js/components/ja/ja-ilustracion.js';
import './ja-canal.js';

const JaContacto = crearComponente<SinProps>(import.meta.url, 'ja-contacto', {}, (root) => {
  const { perfil } = contenido;
  const c = perfil.contacto;
  const canales = [
    { icono: 'mdi:email-outline', titulo: 'Correo', valor: c.email, url: `mailto:${c.email}`, copiar: c.email },
    { icono: 'mdi:phone-outline', titulo: 'Teléfono', valor: c.telefono, url: `tel:${c.telefono.replace(/\s/g, '')}`, copiar: c.telefono },
    { icono: 'mdi:whatsapp', titulo: 'WhatsApp', valor: 'Escríbeme directo', url: c.whatsapp, copiar: '' },
    { icono: 'mdi:github', titulo: 'GitHub', valor: 'github.com/Jeff-Aporta', url: c.github, copiar: '' },
    { icono: 'mdi:youtube', titulo: 'YouTube', valor: '@JeffAporta', url: c.youtube, copiar: '' },
  ];
  root.append(html`
    <div class="rejilla">
      <div class="canales" part="canales">${canales.map((k) => pieza('ja-canal', k))}</div>
      <iswc-card class="cta" part="cta" variant="outlined">
        ${pieza('ja-ilustracion', { nombre: 'contacto' }, { class: 'figura' })}
        <h3>¿Conversamos?</h3>
        <p>Hablemos de arquitectura, producto, IA aplicada o de tu próximo reto técnico. Trabajo en remoto o híbrido con equipos de Colombia y del exterior.</p>
        <div class="acciones">
          <iswc-button color="success" variant="soft" shape="pill" href=${c.whatsapp} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:whatsapp"></iswc-icon> WhatsApp
          </iswc-button>
          <iswc-button color="brand" variant="outlined" shape="pill" href=${rutaSitio(perfil.cv)} target="_blank" rel="noopener">
            <iswc-icon slot="start" icon="mdi:file-eye-outline"></iswc-icon> Hoja de vida
          </iswc-button>
        </div>
      </iswc-card>
    </div>
  `);
});

define('ja-contacto', JaContacto);
