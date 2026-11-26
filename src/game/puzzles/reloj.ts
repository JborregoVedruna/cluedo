// Misión 1 · El reloj roto: ordenar cuatro sucesos a partir de testimonios con horas
// expresadas de formas distintas (digital, en palabras, relativa al reloj o a otro suceso).

import { barajar, barajarDistinto, capitalizar, entero, type Rng } from '../core/rng.ts';

export interface TarjetaReloj {
  id: string;
  testigo: string;
  texto: string;
  minuto: number;
}

export interface PuzleReloj {
  /** Minuto del día en que se detuvo el reloj. */
  parada: number;
  /** En el orden en que se muestran (barajadas). */
  tarjetas: TarjetaReloj[];
  /** Ids en orden cronológico. */
  orden: string[];
}

const SUCESOS = [
  'Puyana cerró con llave la puerta del Despacho',
  'se oyó un portazo en el ala este',
  'la orquesta tocó el último vals',
  'Puyana pidió que le subieran una botella de su reserva',
  'las luces parpadearon por primera vez',
  'alguien cruzó el jardín bajo la lluvia',
  'Puyana discutió a gritos por teléfono',
  'el mayordomo sirvió el café en el salón',
];

const TESTIGOS = [
  'Lady Clara',
  'El mayordomo',
  'Dr. Vance',
  'La doncella',
  'Capitán Sterling',
  'Condesa Elena',
  'Chef Mateo',
  'Inspector Moreau',
];

const NUMEROS = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
const MINUTOS: Record<number, string> = {
  5: 'cinco',
  10: 'diez',
  15: 'cuarto',
  20: 'veinte',
  25: 'veinticinco',
  30: 'media',
};

export function hhmm(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** 23:45 → "las doce menos cuarto" */
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

const DECENAS: Record<number, string> = {
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
  if (min <= 60) return DECENAS[min];
  const resto = min - 60;
  return `una hora y ${DECENAS[resto].replace('un cuarto de hora', 'cuarto').replace('media hora', 'media')}`;
}

type Formato = 'digital' | 'palabras' | 'reloj' | 'relativo';

export function generarReloj(rng: Rng): PuzleReloj {
  const parada = 23 * 60 + 5 * entero(rng, 6, 10); // 23:30 – 23:50
  const tiempos: number[] = [parada - 5 * entero(rng, 2, 4)];
  for (let i = 0; i < 3; i++) tiempos.unshift(tiempos[0] - 5 * entero(rng, 2, 6));

  const sucesos = barajar(rng, SUCESOS).slice(0, 4);
  const testigos = barajar(rng, TESTIGOS).slice(0, 4);
  const formatos = barajar<Formato>(rng, ['digital', 'palabras', 'reloj', 'relativo']);
  const iRelativo = formatos.indexOf('relativo');
  const anclas = [0, 1, 2, 3].filter((i) => i !== iRelativo);
  const ancla = anclas[entero(rng, 0, anclas.length - 1)];

  const tarjetas: TarjetaReloj[] = tiempos.map((minuto, i) => {
    const suceso = capitalizar(sucesos[i]);
    let texto: string;
    switch (formatos[i]) {
      case 'digital':
        texto = `${suceso} a las ${hhmm(minuto)}.`;
        break;
      case 'palabras':
        texto = `${suceso} cuando el reloj del pasillo daba ${enPalabras(minuto)}.`;
        break;
      case 'reloj':
        texto = `${suceso} ${duracion(parada - minuto)} antes de que se parara el reloj de Puyana.`;
        break;
      default: {
        const dif = minuto - tiempos[ancla];
        const referencia = `del momento en que ${sucesos[ancla]}`;
        texto =
          dif > 0
            ? `${suceso} ${duracion(dif)} después ${referencia}.`
            : `${suceso} ${duracion(-dif)} antes ${referencia}.`;
      }
    }
    return { id: `e${i}`, testigo: testigos[i], texto, minuto };
  });

  return {
    parada,
    orden: tarjetas.map((t) => t.id),
    tarjetas: barajarDistinto(rng, tarjetas),
  };
}
