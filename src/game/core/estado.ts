// Estado de la partida: solución secreta, misiones, descartes y notas del cuaderno.
// Es la única fuente de verdad; Phaser y los paneles DOM se suscriben a sus cambios.

import { CATEGORIAS, ELEMENTOS, type Categoria } from '../../data/caso.ts';
import { Emisor } from './eventos.ts';
import { candidatosDe, generarPistaCondicional, generarPistaDescarte } from './pistas.ts';
import { crearRng, derivar, elegir, semillaAleatoria } from './rng.ts';
import type { Marca, Partida, Pista, Seleccion } from './tipos.ts';

export const TOTAL_MISIONES = 5;
/**
 * Misiones que exigen descartar 1 elemento por categoría.
 * Con 4 quedan 2 candidatos por categoría para la acusación final.
 * Con 5 quedaría 1 solo candidato (la acusación sería automática).
 */
export const MISIONES_CON_DESCARTE = 4;

const CLAVE = 'puyana:partida:v1';

export const eventos = new Emisor<{
  cambio: Partida;
  pista: { mision: number; pista: Pista };
}>();

let partida: Partida | null = null;

export function requiereDescarte(mision: number): boolean {
  return mision < MISIONES_CON_DESCARTE;
}

export function nuevaPartida(semilla: number = semillaAleatoria()): Partida {
  const rng = crearRng(semilla);
  partida = {
    version: 1,
    semilla,
    solucion: {
      sospechoso: elegir(rng, ELEMENTOS.sospechoso).id,
      arma: elegir(rng, ELEMENTOS.arma).id,
      lugar: elegir(rng, ELEMENTOS.lugar).id,
    },
    descartados: { sospechoso: [], arma: [], lugar: [] },
    misiones: Array.from({ length: TOTAL_MISIONES }, (_, i) => ({
      estado: i === 0 ? 'disponible' : 'bloqueada',
      fallos: 0,
    })),
    marcas: {},
    notasLibres: '',
    acusaciones: 0,
    resuelta: false,
  };
  guardar();
  eventos.emit('cambio', partida);
  return partida;
}

function esValida(p: unknown): p is Partida {
  const x = p as Partida;
  return (
    !!x &&
    x.version === 1 &&
    typeof x.semilla === 'number' &&
    Array.isArray(x.misiones) &&
    x.misiones.length === TOTAL_MISIONES &&
    CATEGORIAS.every((c) => typeof x.solucion?.[c] === 'string' && Array.isArray(x.descartados?.[c]))
  );
}

export function cargarOCrear(): Partida {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) {
      const p = JSON.parse(crudo);
      if (esValida(p)) {
        partida = p;
        return p;
      }
    }
  } catch {
    /* almacenamiento no disponible: partida en memoria */
  }
  return nuevaPartida();
}

function guardar(): void {
  if (!partida) return;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(partida));
  } catch {
    /* sin persistencia */
  }
}

function cambio(): void {
  guardar();
  if (partida) eventos.emit('cambio', partida);
}

export function obtener(): Partida {
  return partida ?? cargarOCrear();
}

export function candidatos(cat: Categoria): string[] {
  return candidatosDe(cat, obtener().descartados);
}

function desbloquear(i: number): void {
  const p = obtener();
  if (i < TOTAL_MISIONES && p.misiones[i].estado === 'bloqueada') p.misiones[i].estado = 'disponible';
}

/** El jugador ha resuelto el puzle de la misión: se genera y entrega su pista. */
export function resolverPuzle(i: number): Pista | undefined {
  const p = obtener();
  const m = p.misiones[i];
  if (m.estado !== 'disponible') return m.pista;

  const rng = crearRng(derivar(p.semilla, 100 + i));
  const pista =
    i === TOTAL_MISIONES - 1
      ? generarPistaCondicional(i, p.solucion, p.descartados, rng)
      : generarPistaDescarte(i, p.solucion, p.descartados, rng);

  m.pista = pista;
  if (requiereDescarte(i)) {
    m.estado = 'descarte';
  } else {
    m.estado = 'completada';
    desbloquear(i + 1);
  }
  cambio();
  eventos.emit('pista', { mision: i, pista });
  return pista;
}

export function registrarFallo(i: number): number {
  const p = obtener();
  p.misiones[i].fallos += 1;
  guardar();
  return p.misiones[i].fallos;
}

export type ResultadoDescarte =
  | { ok: true }
  | { ok: false; motivo: 'estado' | 'incompleto' | 'repetido' }
  | { ok: false; motivo: 'contradice'; conflictos: Categoria[] };

export function intentarDescarte(i: number, sel: Partial<Seleccion>): ResultadoDescarte {
  const p = obtener();
  const m = p.misiones[i];
  if (m.estado !== 'descarte') return { ok: false, motivo: 'estado' };
  for (const cat of CATEGORIAS) {
    const id = sel[cat];
    if (!id) return { ok: false, motivo: 'incompleto' };
    if (p.descartados[cat].includes(id)) return { ok: false, motivo: 'repetido' };
  }
  const conflictos = CATEGORIAS.filter((cat) => sel[cat] === p.solucion[cat]);
  if (conflictos.length > 0) return { ok: false, motivo: 'contradice', conflictos };

  const completa = sel as Seleccion;
  for (const cat of CATEGORIAS) p.descartados[cat].push(completa[cat]);
  m.descarte = { ...completa };
  m.estado = 'completada';
  desbloquear(i + 1);
  cambio();
  return { ok: true };
}

export function puedeAcusar(): boolean {
  const p = obtener();
  return !p.resuelta && p.misiones.every((m) => m.estado === 'completada');
}

export function acusar(sel: Seleccion): { correcto: boolean; fallos: Categoria[] } {
  const p = obtener();
  const fallos = CATEGORIAS.filter((c) => sel[c] !== p.solucion[c]);
  p.acusaciones += 1;
  if (fallos.length === 0) p.resuelta = true;
  cambio();
  return { correcto: fallos.length === 0, fallos };
}

const CICLO: Marca[] = ['ninguna', 'sospecha', 'principal'];

export function alternarMarca(id: string): Marca {
  const p = obtener();
  const actual = p.marcas[id] ?? 'ninguna';
  const siguiente = CICLO[(CICLO.indexOf(actual) + 1) % CICLO.length];
  p.marcas[id] = siguiente;
  cambio();
  return siguiente;
}

/** Las notas libres se guardan sin emitir cambio (evita repintar mientras se escribe). */
export function guardarNotas(texto: string): void {
  obtener().notasLibres = texto;
  guardar();
}
