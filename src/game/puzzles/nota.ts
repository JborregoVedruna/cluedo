// Misión 4 · La nota rasgada: reconstruir el orden de cinco fragmentos.

import { barajarDistinto, elegir, type Rng } from '../core/rng.ts';

export interface Fragmento {
  id: string;
  texto: string;
}

export interface PuzleNota {
  fragmentos: Fragmento[];
  orden: string[];
}

const NOTAS: string[][] = [
  ['Si alguien lee esto,', 'es que no llegué', 'a la medianoche.', 'La verdad está escondida', 'entre mis libros.'],
  ['No confíes en', 'quien sonría primero', 'cuando se apaguen las luces.', 'Yo ya sé', 'quién quiere verme muerto.'],
  ['Esta noche', 'pienso contarlo todo', 'delante de los seis.', 'Que tiemble', 'quien tenga algo que ocultar.'],
  ['He cambiado', 'mi testamento', 'a última hora.', 'El sobre lacrado', 'está en la caja de música.'],
];

export function generarNota(rng: Rng): PuzleNota {
  const nota = elegir(rng, NOTAS);
  const fragmentos = nota.map((texto, i) => ({ id: `f${i}`, texto }));
  return {
    orden: fragmentos.map((f) => f.id),
    fragmentos: barajarDistinto(rng, fragmentos),
  };
}
