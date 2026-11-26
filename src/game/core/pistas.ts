// Generación de pistas. Todas se construyen a partir de la solución secreta,
// así que nunca pueden contradecirla.

import { CATEGORIAS, ELEMENTOS, conTratamiento, porId, type Arma, type Categoria, type Lugar } from '../../data/caso.ts';
import { MISIONES } from '../misiones.ts';
import { capitalizar, elegir, type Rng } from './rng.ts';
import type { Pista, Seleccion } from './tipos.ts';

export function candidatosDe(cat: Categoria, descartados: Record<Categoria, string[]>): string[] {
  return ELEMENTOS[cat].map((e) => e.id).filter((id) => !descartados[cat].includes(id));
}

/** Pista de las misiones 1–4: exculpa un sospechoso, un arma y un lugar todavía en juego. */
export function generarPistaDescarte(
  mision: number,
  solucion: Seleccion,
  descartados: Record<Categoria, string[]>,
  rng: Rng,
): Pista {
  const senalados = {} as Seleccion;
  for (const cat of CATEGORIAS) {
    const inocentes = candidatosDe(cat, descartados).filter((id) => id !== solucion[cat]);
    senalados[cat] = elegir(rng, inocentes);
  }
  const info = MISIONES[mision];
  return {
    mision,
    titulo: `Misión ${info.numeral} · ${info.titulo}`,
    parrafos: [
      info.introPista,
      `${capitalizar(porId(senalados.sospechoso).pistaInocente)}.`,
      `${capitalizar(porId(senalados.arma).pistaInocente)}.`,
      `${capitalizar(porId(senalados.lugar).pistaInocente)}.`,
    ],
    senalados,
  };
}

// ---------- Careo final: afirmaciones condicionales ----------

interface Literal {
  cat: Categoria;
  id: string;
  positivo: boolean;
}

interface Afirmacion {
  tipo: 'si' | 'alguna';
  a: Literal;
  b: Literal;
}

type Combinacion = Seleccion;

function cumpleLiteral(l: Literal, c: Combinacion): boolean {
  return (c[l.cat] === l.id) === l.positivo;
}

function cumple(af: Afirmacion, c: Combinacion): boolean {
  const a = cumpleLiteral(af.a, c);
  const b = cumpleLiteral(af.b, c);
  return af.tipo === 'si' ? !a || b : a || b;
}

function textoLiteral(l: Literal): string {
  const e = porId(l.id);
  if (l.cat === 'sospechoso') return l.positivo ? `el culpable es ${conTratamiento(e.nombre)}` : `${conTratamiento(e.nombre)} no es el culpable`;
  if (l.cat === 'arma') {
    const a = e as Arma;
    return l.positivo ? `el arma es ${a.conArticulo}` : `el arma no es ${a.conArticulo}`;
  }
  const lu = e as Lugar;
  return l.positivo ? `el crimen ocurrió ${lu.enLugar}` : `el crimen no ocurrió ${lu.enLugar}`;
}

function textoAfirmacion(af: Afirmacion): string {
  if (af.tipo === 'si') return `Si ${textoLiteral(af.a)}, entonces ${textoLiteral(af.b)}.`;
  return `Al menos una de estas dos cosas es cierta: ${textoLiteral(af.a)}, o ${textoLiteral(af.b)}.`;
}

function combinaciones(listas: Record<Categoria, string[]>): Combinacion[] {
  const res: Combinacion[] = [];
  for (const s of listas.sospechoso)
    for (const a of listas.arma) for (const l of listas.lugar) res.push({ sospechoso: s, arma: a, lugar: l });
  return res;
}

function igual(a: Combinacion, b: Combinacion): boolean {
  return CATEGORIAS.every((c) => a[c] === b[c]);
}

/**
 * Genera afirmaciones condicionales, todas verdaderas para la solución, hasta que
 * entre los candidatos restantes solo quede una combinación posible: la solución.
 */
export function generarAfirmaciones(
  solucion: Seleccion,
  descartados: Record<Categoria, string[]>,
  rng: Rng,
): string[] {
  const listas = {
    sospechoso: candidatosDe('sospechoso', descartados),
    arma: candidatosDe('arma', descartados),
    lugar: candidatosDe('lugar', descartados),
  };
  const abiertas = CATEGORIAS.filter((c) => listas[c].length > 1);
  let vivas = combinaciones(listas).filter((c) => !igual(c, solucion));
  const elegidas: Afirmacion[] = [];

  if (abiertas.length === 0) return [];
  if (abiertas.length === 1) {
    const cat = abiertas[0];
    return [`Está demostrado que ${textoLiteral({ cat, id: solucion[cat], positivo: true })}.`];
  }

  for (let intento = 0; intento < 2000 && vivas.length > 0; intento++) {
    const catA = elegir(rng, abiertas);
    const catB = elegir(rng, abiertas.filter((c) => c !== catA));
    const af: Afirmacion = {
      tipo: rng() < 0.7 ? 'si' : 'alguna',
      a: { cat: catA, id: elegir(rng, listas[catA]), positivo: rng() < 0.6 },
      b: { cat: catB, id: elegir(rng, listas[catB]), positivo: rng() < 0.6 },
    };
    if (!cumple(af, solucion)) continue;
    // Evita frases vacías: la parte "si..." debe poder ser cierta en alguna combinación viva.
    const restantes = vivas.filter((c) => cumple(af, c));
    if (restantes.length === vivas.length) continue;
    elegidas.push(af);
    vivas = restantes;
  }

  // Respaldo determinista (prácticamente nunca necesario).
  for (const c of vivas) {
    const cat = abiertas.find((k) => c[k] !== solucion[k])!;
    const otra = abiertas.find((k) => k !== cat)!;
    elegidas.push({
      tipo: 'si',
      a: { cat: otra, id: solucion[otra], positivo: true },
      b: { cat, id: solucion[cat], positivo: true },
    });
  }

  // Elimina afirmaciones redundantes: deja solo las necesarias para que la solución sea única.
  const todas = combinaciones(listas).filter((c) => !igual(c, solucion));
  const descartaTodas = (lista: Afirmacion[]) => todas.every((c) => lista.some((af) => !cumple(af, c)));
  for (let i = elegidas.length - 1; i >= 0; i--) {
    const sin = elegidas.filter((_, k) => k !== i);
    if (descartaTodas(sin)) elegidas.splice(i, 1);
  }

  return elegidas.map((af) => capitalizar(textoAfirmacion(af)));
}

export function generarPistaCondicional(
  mision: number,
  solucion: Seleccion,
  descartados: Record<Categoria, string[]>,
  rng: Rng,
): Pista {
  const info = MISIONES[mision];
  return {
    mision,
    titulo: `Misión ${info.numeral} · ${info.titulo}`,
    parrafos: [info.introPista],
    condicionales: generarAfirmaciones(solucion, descartados, rng),
  };
}
