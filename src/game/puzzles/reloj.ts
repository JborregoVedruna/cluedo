// Testimonio de los invitados · El reloj de Puyana: ordenar cuatro sucesos a partir de
// testimonios con la hora expresada de formas distintas. El reloj se paró a las 3:50.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, barajarDistinto, capitalizar, entero, type Rng } from '../core/rng.ts';
import type { PuzleOrden } from './tipos.ts';

export const PARADA = 3 * 60 + 50;

const SUCESOS = [
  'Puyana pidió una ronda de chupitos en la barra',
  'el DJ puso la canción favorita de los novios',
  'alguien gritó «¡que vivan los novios!» desde la pasarela',
  'Puyana subió en el ascensor panorámico grabando vídeos',
  'Puyana se hizo una foto en la pasarela de cristal',
  'Puyana mandó un audio al grupo de la boda',
  'empezó a llover sobre la terraza',
  'Juanky y Puyana se abrazaron en mitad de la pista',
];

const NUMEROS = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
const MINUTOS: Record<number, string> = { 5: 'cinco', 10: 'diez', 15: 'cuarto', 20: 'veinte', 25: 'veinticinco', 30: 'media' };

export function hhmm(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** 2:45 → "las tres menos cuarto" */
export function enPalabras(min: number): string {
  let h = Math.floor(min / 60);
  const m = min % 60;
  let resto: string;
  if (m === 0) resto = ' en punto';
  else if (m <= 30) resto = ` y ${MINUTOS[m]}`;
  else {
    h += 1;
    resto = ` menos ${MINUTOS[60 - m]}`;
  }
  const h12 = h % 12 || 12;
  return `${h12 === 1 ? 'la' : 'las'} ${NUMEROS[h12]}${resto}`;
}

const DURACION: Record<number, string> = {
  5: 'cinco minutos',
  10: 'diez minutos',
  15: 'un cuarto de hora',
  20: 'veinte minutos',
  25: 'veinticinco minutos',
  30: 'media hora',
  35: 'treinta y cinco minutos',
  40: 'cuarenta minutos',
  45: 'tres cuartos de hora',
  50: 'cincuenta minutos',
  55: 'cincuenta y cinco minutos',
  60: 'una hora',
};

export function duracion(min: number): string {
  if (min <= 60) return DURACION[min];
  const resto = DURACION[min - 60].replace('un cuarto de hora', 'cuarto').replace('media hora', 'media');
  return `una hora y ${resto}`;
}

type Formato = 'digital' | 'palabras' | 'reloj' | 'relativo';

export function generarReloj(rng: Rng): PuzleOrden {
  const tiempos: number[] = [3 * 60 + 25 - 5 * entero(rng, 0, 2)]; // último suceso: 3:15–3:25
  for (let i = 0; i < 3; i++) tiempos.unshift(tiempos[0] - 5 * entero(rng, 2, 5));

  const sucesos = barajar(rng, SUCESOS).slice(0, 4);
  const testigos = barajar(rng, SOSPECHOSOS).slice(0, 4).map((s) => s.nombre);
  const formatos = barajar<Formato>(rng, ['digital', 'palabras', 'reloj', 'relativo']);
  const iRelativo = formatos.indexOf('relativo');
  const anclas = [0, 1, 2, 3].filter((i) => i !== iRelativo);
  const ancla = anclas[entero(rng, 0, anclas.length - 1)];

  const tarjetas = tiempos.map((minuto, i) => {
    const suceso = capitalizar(sucesos[i]);
    let texto: string;
    switch (formatos[i]) {
      case 'digital':
        texto = `${suceso} a las ${hhmm(minuto)}.`;
        break;
      case 'palabras':
        texto = `${suceso} cuando eran ${enPalabras(minuto)}.`;
        break;
      case 'reloj':
        texto = `${suceso} ${duracion(PARADA - minuto)} antes de que se parara el reloj de Puyana.`;
        break;
      default: {
        const dif = minuto - tiempos[ancla];
        const referencia = `del momento en que ${sucesos[ancla]}`;
        texto = dif > 0 ? `${suceso} ${duracion(dif)} después ${referencia}.` : `${suceso} ${duracion(-dif)} antes ${referencia}.`;
      }
    }
    return { id: `e${i}`, etiqueta: testigos[i], texto: `«${texto}»` };
  });

  const primero = tarjetas[0];
  return {
    orden: tarjetas.map((t) => t.id),
    tarjetas: barajarDistinto(rng, tarjetas),
    destacado: { etiqueta: 'El reloj de Puyana se paró a las', valor: hhmm(PARADA) },
    reloj: PARADA,
    ayuda: `Ayuda: el primer suceso es el que cuenta ${primero.etiqueta}.`,
  };
}
