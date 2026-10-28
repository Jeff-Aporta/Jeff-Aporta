// contenido.test.ts — contenido central y sus derivados (sin navegador).
//
//   W-CON-01  el contenido cumple ContenidoSchema (falla el gate, no la página publicada)
//   W-CON-02  las duraciones son meses enteros redondeados hacia arriba, sin días
//   W-CON-03  el total de experiencia cuenta cada mes del calendario una sola vez
//   W-CON-04  ninguna tecnología acumula más tiempo que la experiencia total
//   W-CON-05  todo archivo local que el contenido referencia existe en el repo
//   W-CON-06  la trayectoria es un grafo de ramas de la experiencia: actualidad arriba, un inicio y un fin por periodo
//             y una fila por inicio de subproyecto
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { definirPruebas } from '@iswc/testing/pruebas.ts';
import { ContenidoSchema } from '../../src/js/consts/schemas/contenido.schemas.ts';
import { contenido } from '../../src/js/contenido/index.ts';
import { duracion, grafoTrayectoria, mesesCalendario, mesesEmpleo, usoTecnologias } from '../../src/js/contenido/derivados.ts';

const RAIZ = Deno.cwd();
const porId = (id: string) => contenido.experiencia.find((e) => e.id === id)!;

export default definirPruebas([
  {
    nombre: 'contenido W-CON-01 cumple el schema',
    categoria: 'what',
    correr({ expect }) {
      const r = ContenidoSchema.safeParse(contenido);
      expect('válido', r.success, r.success ? '' : JSON.stringify(r.error.issues.slice(0, 3)));
      expect('secciones únicas', new Set(contenido.sitio.secciones.map((s) => s.id)).size === contenido.sitio.secciones.length);
      expect('ids de empleo únicos', new Set(contenido.experiencia.map((e) => e.id)).size === contenido.experiencia.length);
      expect('ids de proyecto únicos', new Set(contenido.proyectos.map((p) => p.id)).size === contenido.proyectos.length);
    },
  },
  {
    nombre: 'contenido W-CON-02 duraciones en meses enteros hacia arriba',
    categoria: 'what',
    correr({ eq }) {
      eq('InSoft 01/09/2025–14/10/2026', mesesEmpleo(porId('insoft')), 14);
      eq('COREMSA 15/01/2023–15/01/2026', mesesEmpleo(porId('coremsa')), 36);
      eq('Gloria’s tres periodos', mesesEmpleo(porId('glorias')), 25);
      eq('Ferremateriales jun 2018–jul 2020', mesesEmpleo(porId('ferremateriales')), 26);
      eq('texto', duracion(14), '1 año y 2 meses');
      eq('texto exacto', duracion(36), '3 años');
      eq('texto meses', duracion(5), '5 meses');
    },
  },
  {
    nombre: 'contenido W-CON-03 total sin doble conteo',
    categoria: 'what',
    correr({ eq, expect }) {
      const total = mesesCalendario(contenido.experiencia);
      const suma = contenido.experiencia.reduce((s, e) => s + mesesEmpleo(e), 0);
      eq('meses de calendario', total, 105);
      expect('menor que la suma bruta (hay contratos simultáneos)', total < suma, `${total} vs ${suma}`);
    },
  },
  {
    nombre: 'contenido W-CON-04 ninguna tecnología supera la experiencia total',
    categoria: 'what',
    correr({ expect }) {
      const total = mesesCalendario(contenido.experiencia);
      for (const u of usoTecnologias(contenido.experiencia, 99)) expect(`${u.nombre} ≤ total`, u.meses <= total, `${u.meses} > ${total}`);
    },
  },
  {
    nombre: 'contenido W-CON-05 archivos locales referenciados existen',
    categoria: 'what',
    correr({ expect }) {
      const rutas = [
        contenido.perfil.foto.src,
        contenido.perfil.cv,
        contenido.sitio.imagenOg.src,
        ...contenido.experiencia.flatMap((e) => [e.logo, ...e.galeria.map((g) => g.src)]),
        ...contenido.proyectos.flatMap((p) => [p.imagen, p.logo]),
        // Cada ilustración es un SVG o una composición por piezas (todas sus piezas deben existir).
        ...['hero', 'trayectoria', 'proyectos', 'habilidades', 'contacto'].flatMap((n) => {
          const compo = contenido.ilustraciones[n];
          return compo ? compo.piezas.flatMap((p) => ('src' in p ? [`assets/ilustraciones/${n}/${p.src}`] : [])) : [`assets/ilustraciones/${n}.svg`];
        }),
      ].filter((r): r is string => typeof r === 'string' && !/^https?:/.test(r));
      for (const r of rutas) expect(r, existsSync(join(RAIZ, r)));
    },
  },
  {
    nombre: 'contenido W-CON-06 grafo de ramas de la experiencia',
    categoria: 'what',
    correr({ eq, expect }) {
      const g = grafoTrayectoria(contenido.experiencia, '2026-10-27');
      const periodos = contenido.experiencia.reduce((s, e) => s + e.periodos.length, 0);
      eq('primera fila', g[0]!.tipo, 'actual');
      const consolidados = g.filter((e) => e.tipo === 'periodo' || e.tipo === 'cambio').length;
      eq('un inicio por periodo', g.filter((e) => e.tipo === 'inicio').length + consolidados, periodos);
      eq('un fin por periodo cerrado', g.filter((e) => e.tipo === 'fin').length + consolidados, periodos);
      expect('fin e inicio contiguos del mismo periodo se consolidan', g.every((e, i) => !(e.tipo === 'fin' && g[i + 1]?.tipo === 'inicio' && g[i + 1]!.clave.replace(/-inicio$/, '') === e.clave.replace(/-fin$/, ''))));
      expect('de la actualidad hacia atrás', g.slice(1).every((e, i, l) => i === 0 || l[i - 1]!.fecha.slice(0, 7) >= e.fecha.slice(0, 7)));
      expect('solo la última fila cierra el tronco', g.filter((e) => e.ultimo).length === 1 && g[g.length - 1]!.ultimo);
      const subs = g.filter((e) => e.tipo === 'sub');
      eq('el inicio de cada subproyecto es una fila sobre su empresa', subs.map((e) => [e.sub, e.empleoId]), [['fyxtoken', 'coremsa']]);
      expect('ramas fuera del tronco', g.slice(1).every((e) => e.carril > 0 && !e.pasantes.includes(e.carril)));
      eq('la primera vinculación abre la carrera', g[g.length - 1]!.empleoId, 'lava-en-casa');
    },
  },
]);
