// Misión · La sesión del DJ (Cable XLR de sonido): ordenar canciones por duración y testimonios.
// La sesión termina exactamente a las 3:30:00, cuando se va la luz.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, barajarDistinto, elegir, entero, type Rng } from '../core/rng.ts';
import { elegirCondiciones, permutaciones, type Condicion } from './logica.ts';
import type { PuzleOrden } from './tipos.ts';

const CANCIONES = [
  'Paquito el chocolatero',
  'Mayonesa',
  'La bomba',
  'Danza Kuduro',
  'Sarandonga',
  'Corazón contento',
  'Gasolina',
  'Despechá',
];

const FIN = 3 * 3600 + 30 * 60;

export function mmss(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function hora(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function inicios(orden: number[], duraciones: number[]): number[] {
  const res: number[] = new Array(orden.length);
  let t = FIN;
  for (let k = orden.length - 1; k >= 0; k--) {
    t -= duraciones[orden[k]];
    res[orden[k]] = t;
  }
  return res;
}

export function generarDj(rng: Rng): PuzleOrden {
  for (let intento = 0; intento < 200; intento++) {
    const n = 4;
    const titulos = barajar(rng, CANCIONES).slice(0, n);
    const duraciones = titulos.map(() => 150 + 15 * entero(rng, 0, 8));
    if (new Set(duraciones).size < n) continue;
    const solucion = barajar(rng, [0, 1, 2, 3]); // orden de reproducción (índices de canción)
    const inicioReal = inicios(solucion, duraciones);
    const pos = (orden: number[], c: number) => orden.indexOf(c);
    const personas = barajar(rng, SOSPECHOSOS);

    const pool: Condicion<number[]>[] = [];
    titulos.forEach((t, c) => {
      const p = personas[c % personas.length].nombre;
      pool.push({
        texto: `${p}: «${elegir(rng, ['Estaba bailando', 'Estaba discutiendo', 'Estaba en la barra'])} cuando empezó «${t}»: eran las ${hora(inicioReal[c])}.»`,
        cumple: (o) => inicios(o, duraciones)[c] === inicioReal[c],
      });
      titulos.forEach((u, d) => {
        if (c === d) return;
        pool.push({ texto: `«${t}» sonó antes que «${u}».`, cumple: (o) => pos(o, c) < pos(o, d) });
        pool.push({ texto: `Justo después de «${t}» sonó «${u}».`, cumple: (o) => pos(o, d) === pos(o, c) + 1 });
      });
    });
    const universo = permutaciones(n);
    const esSol = (o: number[]) => o.every((v, i) => v === solucion[i]);
    // Siempre al menos un testimonio con hora (obliga a usar las duraciones).
    const conHora = pool.filter((c, i) => i % (1 + 2 * (n - 1)) === 0 && c.cumple(solucion));
    const ancla = conHora.find((c) => !c.texto.includes(hora(FIN - duraciones[solucion[n - 1]])));
    const pistas = elegirCondiciones(rng, universo, esSol, pool.filter((c) => !c.texto.includes('Justo después') || rng() < 0.4), 12, ancla ? [ancla] : []);
    if (!pistas || pistas.length > 4) continue;

    const tarjetas = titulos.map((t, c) => ({ id: `s${c}`, etiqueta: `Duración ${mmss(duraciones[c])}`, texto: `«${t}»` }));
    return {
      tarjetas: barajarDistinto(rng, tarjetas),
      orden: solucion.map((c) => `s${c}`),
      pistas,
      destacado: { etiqueta: 'La sesión terminó a las', valor: '3:30:00' },
      ayuda: `Ayuda: la última canción empezó a las ${hora(FIN - duraciones[solucion[n - 1]])}. Desde ahí, ve restando duraciones hacia atrás.`,
    };
  }
  throw new Error('No se pudo generar la sesión del DJ');
}
