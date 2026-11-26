// Misión 5 · El careo final: tres testigos, exactamente uno miente.

import { SOSPECHOSOS, conTratamiento } from '../../data/caso.ts';
import { barajar, capitalizar, elegir, entero, type Rng } from '../core/rng.ts';

type Frase =
  | { tipo: 'miente' | 'verdad'; obj: number }
  | { tipo: 'alguno' | 'ambos'; a: number; b: number };

export interface Testigo {
  nombre: string;
  frase: string;
}

export interface PuzleCareo {
  testigos: Testigo[];
  mentiroso: number;
}

function esCierta(f: Frase, mentiroso: number): boolean {
  switch (f.tipo) {
    case 'miente':
      return mentiroso === f.obj;
    case 'verdad':
      return mentiroso !== f.obj;
    case 'alguno':
      return mentiroso === f.a || mentiroso === f.b;
    case 'ambos':
      return mentiroso !== f.a && mentiroso !== f.b;
  }
}

/** Hipótesis de mentiroso compatibles con las frases. */
export function compatibles(frases: Frase[]): number[] {
  return [0, 1, 2].filter((h) => frases.every((f, i) => esCierta(f, h) === (i !== h)));
}

function fraseAleatoria(rng: Rng, hablante: number): Frase {
  const otros = [0, 1, 2].filter((x) => x !== hablante);
  const r = rng();
  if (r < 0.35) return { tipo: 'miente', obj: elegir(rng, otros) };
  if (r < 0.65) return { tipo: 'verdad', obj: elegir(rng, otros) };
  if (r < 0.85) return { tipo: 'alguno', a: otros[0], b: otros[1] };
  return { tipo: 'ambos', a: otros[0], b: otros[1] };
}

function texto(f: Frase, nombres: string[]): string {
  switch (f.tipo) {
    case 'miente':
      return `${nombres[f.obj]} está mintiendo.`;
    case 'verdad':
      return `${nombres[f.obj]} dice la verdad.`;
    case 'alguno':
      return `O ${nombres[f.a]} o ${nombres[f.b]} miente.`;
    case 'ambos':
      return `${nombres[f.a]} y ${nombres[f.b]} dicen la verdad.`;
  }
}

export function generarCareo(rng: Rng): PuzleCareo {
  const nombres = barajar(rng, SOSPECHOSOS)
    .slice(0, 3)
    .map((s) => s.nombre);
  const mentiroso = entero(rng, 0, 2);
  let frases: Frase[] = [];
  for (let intento = 0; intento < 1000; intento++) {
    frases = [0, 1, 2].map((i) => fraseAleatoria(rng, i));
    const sol = compatibles(frases);
    if (sol.length === 1 && sol[0] === mentiroso) break;
  }
  return {
    mentiroso,
    testigos: nombres.map((nombre, i) => ({
      nombre,
      frase: `«${capitalizar(texto(frases[i], nombres.map(conTratamiento)))}»`,
    })),
  };
}
