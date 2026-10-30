/**
 * props-registro.ts — qué claves de `.props` reconoce cada tag. Lo que no está aquí se avisa.
 *
 * Al crear un componente con `props`: su schema va en `consts/schemas/componentes.schemas.ts` y se
 * registra AQUÍ con una línea. Todo setter de `props` pasa por `revisarProps`.
 */
import { avisarPropsNoIdentificadas, clavesDe, instalarVigilanciaAtributos } from './zod.js';
import { JaAppPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaBloquePropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaLuzDemoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaPostPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaPostTarjetaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaPaginaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaLinkPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaPasoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaBotonIconoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaBarraUsoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaCanalPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaEstudioPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaFormaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaInsigniaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaListaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaMarcaPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaRasgoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaEmpleoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaHitoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaIlustracionPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaProyectoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaProyectosPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaSeccionPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { JaVideoPropsSchema } from '../consts/schemas/componentes.schemas.js';
import { SinPropsSchema } from '../consts/schemas/componentes.schemas.js';

const MAPA = new Map<string, ReadonlySet<string>>();

export function registrarClaves(tag: string, esquema: { shape: object }): void {
  MAPA.set(tag, clavesDe(esquema));
}

registrarClaves('ja-app', JaAppPropsSchema);
registrarClaves('ja-luz-demo', JaLuzDemoPropsSchema);
registrarClaves('ja-post', JaPostPropsSchema);
registrarClaves('ja-post-tarjeta', JaPostTarjetaPropsSchema);
registrarClaves('ja-pagina', JaPaginaPropsSchema);
registrarClaves('ja-link', JaLinkPropsSchema);
registrarClaves('ja-bloque', JaBloquePropsSchema);
registrarClaves('ja-paso', JaPasoPropsSchema);
registrarClaves('ja-boton-icono', JaBotonIconoPropsSchema);
registrarClaves('ja-barra-uso', JaBarraUsoPropsSchema);
registrarClaves('ja-canal', JaCanalPropsSchema);
registrarClaves('ja-estudio', JaEstudioPropsSchema);
registrarClaves('ja-forma', JaFormaPropsSchema);
registrarClaves('ja-insignia', JaInsigniaPropsSchema);
registrarClaves('ja-lista', JaListaPropsSchema);
registrarClaves('ja-marca', JaMarcaPropsSchema);
registrarClaves('ja-rasgo', JaRasgoPropsSchema);
registrarClaves('ja-ilustracion', JaIlustracionPropsSchema);
registrarClaves('ja-seccion', JaSeccionPropsSchema);
registrarClaves('ja-video', JaVideoPropsSchema);
registrarClaves('ja-hito', JaHitoPropsSchema);
registrarClaves('ja-empleo', JaEmpleoPropsSchema);
registrarClaves('ja-proyectos', JaProyectosPropsSchema);
registrarClaves('ja-proyecto', JaProyectoPropsSchema);
for (const tag of ['ja-portafolio', 'ja-pie', 'ja-blog', 'ja-banner-blog', 'ja-trayectoria', 'ja-hero', 'ja-perfil', 'ja-habilidades', 'ja-educacion', 'ja-contacto']) registrarClaves(tag, SinPropsSchema);

export function revisarProps(tag: string, valor: unknown): void {
  if (!valor || typeof valor !== 'object') return;
  const claves = MAPA.get(tag);
  if (claves) avisarPropsNoIdentificadas(tag, claves, valor);
}

if (typeof document !== 'undefined') instalarVigilanciaAtributos('ja');
