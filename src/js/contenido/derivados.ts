/**
 * derivados.ts — lo que se CALCULA del contenido (sin DOM): duraciones, trayectoria, cifras y stack.
 *
 * Convención de duraciones: meses enteros redondeados hacia arriba. Una fecha `AAAA-MM` cuenta el
 * mes completo; una `AAAA-MM-DD` cuenta hasta ese día. El total de experiencia cuenta cada mes del
 * calendario UNA vez (los contratos simultáneos no se suman dos veces).
 */
import type { Empleo, EventoGrafo, Fecha, Periodo, Publicacion, UsoTecnologia } from '../consts/schemas/contenido.schemas.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

type Dia = { a: number; m: number; d: number };

const partes = (f: Fecha): Dia => {
  const [a, m, d] = f.split('-').map(Number) as [number, number, number?];
  return { a, m, d: d ?? 1 };
};

const hoy = (): Fecha => new Date().toISOString().slice(0, 10);

/** Fin exclusivo: un mes completo termina el día 1 del mes siguiente; un día exacto, ese día. */
function finExclusivo(f: Fecha): Dia {
  const p = partes(f);
  if (f.length > 7) return p;
  return p.m === 12 ? { a: p.a + 1, m: 1, d: 1 } : { a: p.a, m: p.m + 1, d: 1 };
}

/** Meses de un periodo, redondeados hacia arriba. */
export function mesesPeriodo(p: Periodo, referencia: Fecha = hoy()): number {
  const i = partes(p.desde);
  const f = finExclusivo(p.hasta ?? referencia);
  let meses = (f.a - i.a) * 12 + (f.m - i.m);
  let resto = f.d - i.d;
  if (resto < 0) {
    meses -= 1;
    resto = 1;
  }
  return Math.max(1, meses + (resto > 0 ? 1 : 0));
}

/** Meses de un empleo: suma de sus periodos. */
export const mesesEmpleo = (e: Empleo, referencia?: Fecha): number => e.periodos.reduce((s, p) => s + mesesPeriodo(p, referencia), 0);

/** Meses del calendario (clave año*12+mes) que cubre un empleo. */
function mesesMarcados(e: Empleo, referencia: Fecha): Set<number> {
  const marcados = new Set<number>();
  for (const p of e.periodos) {
    const i = partes(p.desde);
    const f = partes(p.hasta ?? referencia);
    for (let k = i.a * 12 + i.m; k <= f.a * 12 + f.m; k++) marcados.add(k);
  }
  return marcados;
}

/** Meses del calendario con al menos un empleo activo (sin doble conteo). */
export function mesesCalendario(empleos: Empleo[], referencia: Fecha = hoy()): number {
  return new Set(empleos.flatMap((e) => [...mesesMarcados(e, referencia)])).size;
}

/** «2 años y 3 meses», «1 año», «5 meses». */
export function duracion(meses: number): string {
  const a = Math.floor(meses / 12);
  const m = meses % 12;
  const ta = a === 0 ? '' : `${a} ${a === 1 ? 'año' : 'años'}`;
  const tm = m === 0 ? '' : `${m} ${m === 1 ? 'mes' : 'meses'}`;
  return [ta, tm].filter(Boolean).join(' y ') || '1 mes';
}

/** «Sep 2025»; `null` es «Actualidad». */
export function fechaCorta(f: Fecha | null): string {
  if (f === null) return 'Actualidad';
  const p = partes(f);
  return `${MESES[p.m - 1]} ${p.a}`;
}

export const rangoPeriodo = (p: Periodo): string => `${fechaCorta(p.desde)} – ${fechaCorta(p.hasta)}`;

const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** «27 de octubre de 2026». */
export function fechaLarga(f: Fecha): string {
  const p = partes(f);
  return `${f.length > 7 ? `${p.d} de ` : ''}${MESES_LARGOS[p.m - 1]} de ${p.a}`;
}

/** Ruta del audio narrado de un paso: `assets/blog/<slug>/voz/<NN>.mp3`. */
export function audioPaso(pub: Publicacion, i: number): string {
  return `assets/blog/${pub.slug}/voz/${String(i).padStart(2, '0')}.mp3`;
}

/** Rango total de un empleo: del primer inicio al último fin. */
export function rangoEmpleo(e: Empleo): string {
  const primero = e.periodos[0]!;
  const ultimo = e.periodos[e.periodos.length - 1]!;
  return `${fechaCorta(primero.desde)} – ${fechaCorta(ultimo.hasta)}`;
}

/** Contratos distintos de un empleo, en orden de aparición. */
export const contratos = (e: Empleo): string[] => [...new Set(e.periodos.map((p) => p.contrato))];

/** Clave ordenable de una fecha: el inicio cuenta desde el día 1; el fin de un mes completo, hasta el 31. */
const claveFecha = (f: Fecha, comoFin: boolean): string => (f.length > 7 ? f : `${f}-${comoFin ? '31' : '01'}`);

/**
 * Gráfico de ramas de la experiencia, de la actualidad hacia atrás. El tronco (carril 0) es la carrera;
 * cada periodo de cada empleo es una rama que nace del tronco en su inicio y vuelve en su fin. Los
 * periodos simultáneos ocupan carriles paralelos (el menor carril libre; se reusa el del mismo empleo).
 * El inicio de un subproyecto (p. ej. Fyxtoken dentro de COREMSA) es una fila `sub` sobre la rama de su
 * empresa: la rama pasa por ella y el punto marca el arranque.
 */
export function grafoTrayectoria(empleos: Empleo[], referencia: Fecha = hoy()): EventoGrafo[] {
  const periodos = empleos
    .flatMap((e) => e.periodos.map((p, k) => ({ e, p, k, ini: claveFecha(p.desde, false), fin: claveFecha(p.hasta ?? referencia, true) })))
    .sort((a, b) => a.ini.localeCompare(b.ini));
  const finPorCarril: string[] = [];
  const carrilPorEmpleo = new Map<string, number>();
  const carriles = periodos.map((x) => {
    const libre = (c: number) => (finPorCarril[c] ?? '') < x.ini;
    const previo = carrilPorEmpleo.get(x.e.id);
    let c = previo !== undefined && libre(previo) ? previo : finPorCarril.findIndex((_, i) => libre(i));
    if (c < 0) c = finPorCarril.length;
    finPorCarril[c] = x.fin;
    carrilPorEmpleo.set(x.e.id, c);
    return c + 1;
  });
  type Crudo = { tipo: 'inicio' | 'fin' | 'sub'; clave: string; orden: string; fecha: Fecha; i: number; sub?: string };
  const crudos: Crudo[] = periodos.flatMap((x, i) => [
    { tipo: 'inicio' as const, clave: `${x.e.id}-${x.k}-inicio`, orden: x.ini, fecha: x.p.desde, i },
    ...(x.p.hasta ? [{ tipo: 'fin' as const, clave: `${x.e.id}-${x.k}-fin`, orden: x.fin, fecha: x.p.hasta, i }] : []),
    // Subproyectos que arrancan dentro de este periodo (estrictamente después de su inicio).
    ...x.e.subproyectos
      .filter((s) => claveFecha(s.desde, false) > x.ini && claveFecha(s.desde, false) <= x.fin)
      .map((s) => ({ tipo: 'sub' as const, clave: `${x.e.id}-${s.id}-sub`, orden: claveFecha(s.desde, false), fecha: s.desde, i, sub: s.id })),
  ]);
  // Más reciente arriba; en empate, el fin va arriba del inicio (la rama cierra después de abrir).
  crudos.sort((a, b) => b.orden.localeCompare(a.orden) || (a.tipo === b.tipo ? 0 : a.tipo === 'fin' ? -1 : 1));
  // Fin e inicio del mismo periodo en filas contiguas → una sola fila `periodo`.
  type Fila = { tipo: 'actual' | 'inicio' | 'fin' | 'periodo' | 'cambio' | 'sub'; clave: string; fecha: Fecha; desde: Fecha | null; i: number; previo: number; sub?: string };
  const filas: Fila[] = [{ tipo: 'actual', clave: 'actual', fecha: referencia, desde: null, i: -1, previo: -1 }];
  for (let k = 0; k < crudos.length; k++) {
    const c = crudos[k]!;
    const sig = crudos[k + 1];
    if (c.tipo === 'fin' && sig?.tipo === 'inicio' && sig.i === c.i) {
      filas.push({ tipo: 'periodo', clave: c.clave.replace(/-fin$/, ''), fecha: c.fecha, desde: sig.fecha, i: c.i, previo: -1 });
      k++;
      continue;
    }
    // Inicio de un periodo justo encima del fin del anterior en la misma empresa y carril → cambio de contrato.
    if (c.tipo === 'inicio' && sig?.tipo === 'fin' && periodos[sig.i]!.e.id === periodos[c.i]!.e.id && carriles[sig.i] === carriles[c.i]) {
      filas.push({ tipo: 'cambio', clave: `${c.clave.replace(/-inicio$/, '')}-cambio`, fecha: c.fecha, desde: null, i: c.i, previo: sig.i });
      k++;
      continue;
    }
    filas.push({ tipo: c.tipo, clave: c.clave, fecha: c.fecha, desde: null, i: c.i, previo: -1, sub: c.sub });
  }
  const filaFin = new Map<number, number>();
  const filaIni = new Map<number, number>();
  filas.forEach((f, r) => {
    if (f.tipo === 'fin' || f.tipo === 'periodo') filaFin.set(f.i, r);
    if (f.tipo === 'inicio' || f.tipo === 'periodo') filaIni.set(f.i, r);
    if (f.tipo === 'cambio') {
      filaIni.set(f.i, r);
      filaFin.set(f.previo, r);
    }
  });
  return filas.map((f, r) => ({
    clave: f.clave,
    tipo: f.tipo,
    fecha: f.fecha,
    desde: f.desde,
    carril: f.i < 0 ? 0 : carriles[f.i]!,
    // La rama propia de una fila `sub` no es «pasante»: la dibuja la fila (con su punto).
    pasantes: periodos.flatMap((_, i) => ((filaFin.get(i) ?? 0) < r && (filaIni.get(i) ?? 0) > r && !(f.tipo === 'sub' && i === f.i) ? [carriles[i]!] : [])),
    empleoId: f.i < 0 ? null : periodos[f.i]!.e.id,
    sub: f.sub ?? null,
    periodo: f.i < 0 ? 0 : periodos[f.i]!.k,
    ultimo: r === filas.length - 1,
  }));
}

/** Tecnologías por meses del calendario en que se usaron (sin doble conteo entre empleos simultáneos). */
export function usoTecnologias(empleos: Empleo[], limite = 12, referencia: Fecha = hoy()): UsoTecnologia[] {
  const meses = new Map<string, Set<number>>();
  for (const e of empleos) {
    const marcados = mesesMarcados(e, referencia);
    for (const t of e.tecnologias) meses.set(t, new Set([...(meses.get(t) ?? []), ...marcados]));
  }
  return [...meses.entries()]
    .map(([nombre, m]) => ({ nombre, meses: m.size }))
    .sort((a, b) => b.meses - a.meses || a.nombre.localeCompare(b.nombre))
    .slice(0, limite);
}

/**
 * Uso por área de habilidades: meses del calendario en empleos que usaron al menos una tecnología del
 * área (sin doble conteo). Las áreas sin experiencia laboral registrada no aparecen.
 */
export function usoAreas(empleos: Empleo[], areas: Array<{ titulo: string; items: string[] }>, referencia: Fecha = hoy()): UsoTecnologia[] {
  return areas
    .map((a) => {
      const items = new Set(a.items.map((i) => i.toLowerCase()));
      const con = empleos.filter((e) => e.tecnologias.some((t) => items.has(t.toLowerCase())));
      return { nombre: a.titulo, meses: mesesCalendario(con, referencia), empleos: con.length };
    })
    .filter((u) => u.meses > 0)
    .sort((a, b) => b.meses - a.meses);
}

/** Cifras de portada. */
export function cifras(empleos: Empleo[], proyectos: number, tecnologias: number) {
  const meses = mesesCalendario(empleos);
  return [
    { clave: 'experiencia', valor: `${Math.floor(meses / 12)}+`, etiqueta: 'Años de experiencia', detalle: duracion(meses), icono: 'mdi:calendar-check-outline' },
    { clave: 'empresas', valor: String(new Set(empleos.map((e) => e.empresa)).size), etiqueta: 'Empresas', detalle: 'Tecnología, finanzas, logística y comercio', icono: 'mdi:domain' },
    { clave: 'proyectos', valor: `${proyectos}`, etiqueta: 'Proyectos publicados', detalle: 'Maquetas, open source y laboratorio', icono: 'mdi:rocket-launch-outline' },
    { clave: 'tecnologias', valor: `${tecnologias}+`, etiqueta: 'Tecnologías', detalle: 'Frontend, backend, datos, IA y cloud', icono: 'mdi:code-tags' },
  ];
}
