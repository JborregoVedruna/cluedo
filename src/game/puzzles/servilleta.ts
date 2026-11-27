// Misión · La servilleta manchada (Barra): cifrado por desplazamiento (César).
// La clave es el número de palabras del lema de uno de los invitados.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { elegir, type Rng } from '../core/rng.ts';

export interface PuzleCifrado {
  cifrado: string;
  claro: string;
  clave: number;
  dueno: string;
  lema: string;
  ayuda: string;
}

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const MENSAJES = [
  'TE ESPERO EN LA PASARELA CUANDO SE VAYA LA LUZ',
  'SI ME PASA ALGO MIRAD EN EL ASCENSOR',
  'ESTA NOCHE LO CUENTO TODO EN EL BRINDIS',
  'QUE NADIE SE ENTERE DE LO DE MAURICIO',
  'A LAS TRES Y MEDIA EN LOS BAÑOS SIN FALTA',
  'NO ME FIO DE NADIE EN ESTA TERRAZA',
];

export function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
}

export function desplazar(texto: string, n: number): string {
  return [...texto]
    .map((ch) => {
      const i = ABC.indexOf(ch);
      return i < 0 ? ch : ABC[(i + n + 26 * 10) % 26];
    })
    .join('');
}

export function contarPalabras(lema: string): number {
  return lema
    .replace(/[«»¿?¡!.,;:]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function generarServilleta(rng: Rng): PuzleCifrado {
  const s = elegir(rng, SOSPECHOSOS);
  const clave = contarPalabras(s.lema);
  // La Ñ no está en el abecedario del cifrado: se deja tal cual.
  const claro = normalizar(elegir(rng, MENSAJES).replace(/Ñ/g, '\u0000')).replace(/\u0000/g, 'Ñ');
  return {
    claro,
    cifrado: desplazar(claro, clave),
    clave,
    dueno: s.nombre,
    lema: s.lema,
    ayuda: `Ayuda: cuenta las palabras de «${s.lema}». Ese es el desplazamiento.`,
  };
}
