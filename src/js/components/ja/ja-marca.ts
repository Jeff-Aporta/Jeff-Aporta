/**
 * <ja-marca> — identidad: logo con el avatar ilustrado de Jeffrey (el de sus videos) en su círculo, nombre y subtítulo.
 * El logo gira levemente al pasar el cursor. `compacta` deja solo logo y nombre.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import { contenido, rutaSitio } from '../../contenido/index.js';
import type { JaMarcaProps } from '../../consts/schemas/componentes.schemas.js';

const JaMarca = crearComponente<JaMarcaProps>(import.meta.url, 'ja-marca', { subtitulo: 'Full Stack Developer', compacta: false }, (root, props, host) => {
  host.toggleAttribute('data-compacta', props.compacta);
  const { perfil } = contenido;
  root.append(html`
    <img class="logo" part="logo" src=${rutaSitio(perfil.logo)} alt="" width="44" height="44">
    <span class="textos">
      <strong part="nombre">${perfil.nombreCorto}</strong>
      ${props.subtitulo ? html`<small part="subtitulo">${props.subtitulo}</small>` : null}
    </span>
  `);
});

define('ja-marca', JaMarca);
