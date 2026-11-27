// Misión · El ticket de la barra (Botella de ginebra premium): reconstruir una cuenta borrada.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, entero, type Rng } from '../core/rng.ts';
import type { PuzleDiales } from './tipos.ts';

const CARTA = [
  { nombre: 'Gin tonic premium', plural: 'gin tonics premium', precio: 14 },
  { nombre: 'Caña', plural: 'cañas', precio: 4 },
  { nombre: 'Vermut', plural: 'vermuts', precio: 6 },
  { nombre: 'Chupito', plural: 'chupitos', precio: 3 },
  { nombre: 'Mojito', plural: 'mojitos', precio: 11 },
  { nombre: 'Copa de cava', plural: 'copas de cava', precio: 7 },
];

function linea(izq: string, der: string): string {
  const puntos = '.'.repeat(Math.max(2, 30 - izq.length - der.length));
  return `${izq} ${puntos} ${der}`;
}

export function generarTicket(rng: Rng): PuzleDiales {
  for (let intento = 0; intento < 500; intento++) {
    const bebidas = barajar(rng, CARTA).slice(0, 4);
    const [visible, t1, t2, borrada] = bebidas;
    const qVisible = entero(rng, 1, 4);
    const r1 = entero(rng, 2, 3);
    const k1 = entero(rng, 1, 3);
    const r2 = entero(rng, 1, 3);
    const k2 = entero(rng, 2, 3);
    const qBorrada = entero(rng, 1, 6);
    const importeBorrada = qBorrada * borrada.precio;
    if (importeBorrada < 10 || importeBorrada > 99) continue;
    const total = qVisible * visible.precio + r1 * k1 * t1.precio + r2 * k2 * t2.precio + importeBorrada;
    const [p1, p2] = barajar(rng, SOSPECHOSOS).slice(0, 2);

    const decenas = Math.floor(importeBorrada / 10);
    return {
      tituloTarjeta: 'TICKET MESA 27 · PRE BODA',
      lineas: [
        'CARTA: ' + CARTA.map((c) => `${c.nombre} ${c.precio} €`).join(' · '),
        '',
        linea(`${qVisible} × ${visible.nombre}`, `${qVisible * visible.precio} €`),
        linea(`? × ${t1.nombre}`, '?? €'),
        linea(`? × ${t2.nombre}`, '?? €'),
        linea('▒▒▒▒▒▒▒▒▒▒', '▒▒ €'),
        linea('TOTAL', `${total} €`),
        '',
        `${p1.nombre}: «Pedí ${r1} rondas de ${k1 === 1 ? 'un' : k1} ${k1 === 1 ? t1.nombre.toLowerCase() : t1.plural}.»`,
        `${p2.nombre}: «Yo, ${r2} ${r2 === 1 ? 'ronda' : 'rondas'} de ${k2} ${t2.plural}.»`,
      ],
      diales: ['Decenas', 'Unidades'],
      solucion: [decenas, importeBorrada % 10],
      ayuda: `Ayuda: ${t1.nombre} = ${r1 * k1} × ${t1.precio} € y ${t2.nombre} = ${r2 * k2} × ${t2.precio} €. Réstalo todo del total.`,
    };
  }
  throw new Error('No se pudo generar el ticket');
}
