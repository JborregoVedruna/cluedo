// Misión · La lista de reservados (Abridor de latón): cinco sillones de la zona VIP en fila.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, elegir, type Rng } from '../core/rng.ts';
import { elegirCondiciones, permutaciones, type Condicion } from './logica.ts';
import type { PuzleEmparejar } from './tipos.ts';

const ALERGIAS = ['al pepino del gin tonic', 'a los frutos secos', 'al confeti', 'al reguetón lento'];
const DEUDAS = ['20 €', 'una ronda', 'un favor de hace años', 'la entrada de la boda'];
const BEBIDAS = ['vermut', 'cava', 'un mojito', 'agua con gas'];

export function generarReservados(rng: Rng): PuzleEmparejar {
  const n = 5;
  for (let intento = 0; intento < 200; intento++) {
    const personas = barajar(rng, SOSPECHOSOS).slice(0, n);
    const solucion = barajar(rng, [0, 1, 2, 3, 4]); // persona i → sillón solucion[i] (0 = izquierda)
    const pool: Condicion<number[]>[] = [];
    personas.forEach((a, i) => {
      for (let s = 0; s < n; s++) {
        pool.push({
          texto: `${a.nombre} tiene alergia ${elegir(rng, ALERGIAS)} y evitó el sillón ${s + 1}, que estaba al lado del cuenco.`,
          cumple: (p) => p[i] !== s,
        });
      }
      pool.push({
        texto: `${a.nombre} no quiso un extremo: «desde ahí no se ve la Gran Vía».`,
        cumple: (p) => p[i] !== 0 && p[i] !== n - 1,
      });
      pool.push({
        texto: `${a.nombre} se sentó en un extremo para poder escaparse a la barra.`,
        cumple: (p) => p[i] === 0 || p[i] === n - 1,
      });
      personas.forEach((b, j) => {
        if (i === j) return;
        pool.push({
          texto: `${a.nombre} pidió ${elegir(rng, BEBIDAS)} y se lo dejaron justo a la izquierda de ${b.nombre}.`,
          cumple: (p) => p[i] === p[j] - 1,
        });
        if (i < j) {
          pool.push({
            texto: `${a.nombre} le debe ${elegir(rng, DEUDAS)} a ${b.nombre}, así que no se sentaron juntos.`,
            cumple: (p) => Math.abs(p[i] - p[j]) !== 1,
          });
        }
        pool.push({ texto: `${a.nombre} estaba más a la derecha que ${b.nombre}.`, cumple: (p) => p[i] > p[j] });
      });
    });
    const pistas = elegirCondiciones(rng, permutaciones(n), (p) => p.every((v, i) => v === solucion[i]), pool, 25);
    if (!pistas || pistas.length > 7) continue;

    const correcto: Record<string, string> = {};
    personas.forEach((p, i) => (correcto[p.id] = `s${solucion[i]}`));
    return {
      izquierda: personas.map((p) => ({ id: p.id, nombre: p.nombre })),
      derecha: Array.from({ length: n }, (_, s) => ({
        id: `s${s}`,
        nombre: `Sillón ${s + 1}`,
        detalle: s === 0 ? 'extremo izquierdo' : s === n - 1 ? 'extremo derecho' : undefined,
      })),
      correcto,
      pistas,
      tituloIzq: 'Invitados',
      tituloDer: 'Sillones (de izquierda a derecha)',
      tituloPistas: 'Notas de la encargada VIP',
    };
  }
  throw new Error('No se pudo generar la lista de reservados');
}
