// Misión · El ticket de la barra (Botella de ginebra premium): reconstruir una cuenta borrada.
// Para resolverlo hay que: quitar el 10 % de servicio del total, aplicar el 2×1 de la promoción,
// multiplicar las rondas que admiten los invitados y despejar cuántas copas tiene la línea borrada.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, entero, type Rng } from '../core/rng.ts';
import type { PuzleDiales } from './tipos.ts';

const CARTA = [
  { nombre: 'Gin tonic premium', plural: 'gin tonics premium', uno: 'un gin tonic premium', precio: 14 },
  { nombre: 'Caña', plural: 'cañas', uno: 'una caña', precio: 4 },
  { nombre: 'Vermut', plural: 'vermuts', uno: 'un vermut', precio: 6 },
  { nombre: 'Chupito', plural: 'chupitos', uno: 'un chupito', precio: 3 },
  { nombre: 'Mojito', plural: 'mojitos', uno: 'un mojito', precio: 11 },
  { nombre: 'Copa de cava', plural: 'copas de cava', uno: 'una copa de cava', precio: 7 },
];

const SERVICIO = 10; // %

function linea(izq: string, der: string): string {
  const puntos = '.'.repeat(Math.max(2, 30 - izq.length - der.length));
  return `${izq} ${puntos} ${der}`;
}

/** Con el 2×1 se paga la mitad de las unidades, redondeando hacia arriba. */
export function unidadesConPromo(q: number): number {
  return Math.ceil(q / 2);
}

export function generarTicket(rng: Rng): PuzleDiales {
  for (let intento = 0; intento < 2000; intento++) {
    const [visible, promo, t2, borrada] = barajar(rng, CARTA).slice(0, 4);
    const qVisible = entero(rng, 1, 3);
    const r1 = entero(rng, 2, 3);
    const k1 = entero(rng, 2, 3);
    const r2 = entero(rng, 2, 3);
    const k2 = entero(rng, 1, 3);
    const qBorrada = entero(rng, 2, 7);

    const importeVisible = qVisible * visible.precio;
    const importePromo = unidadesConPromo(r1 * k1) * promo.precio;
    const importe2 = r2 * k2 * t2.precio;
    const importeBorrada = qBorrada * borrada.precio;
    const subtotal = importeVisible + importePromo + importe2 + importeBorrada;
    if (subtotal % 10 !== 0) continue; // el total con el 10 % debe ser exacto
    const total = (subtotal * (100 + SERVICIO)) / 100;
    const [p1, p2] = barajar(rng, SOSPECHOSOS).slice(0, 2);

    return {
      tituloTarjeta: 'TICKET MESA 27 · PRE BODA',
      lineas: [
        'CARTA: ' + CARTA.map((c) => `${c.nombre} ${c.precio} €`).join(' · '),
        `PROMO: 2×1 en ${promo.plural} (se paga la mitad, redondeando hacia arriba).`,
        '',
        linea(`${qVisible} × ${visible.nombre}`, `${importeVisible} €`),
        linea(`? × ${promo.nombre} (2×1)`, '?? €'),
        linea(`? × ${t2.nombre}`, '?? €'),
        linea(`▒ × ${borrada.nombre}`, '▒▒ €'),
        linea(`Servicio ${SERVICIO} %`, 'incluido'),
        linea('TOTAL', `${total} €`),
        '',
        `${p1.nombre}: «Pedí ${r1} rondas de ${k1} ${promo.plural}.»`,
        `${p2.nombre}: «Yo, ${r2} rondas de ${k2 === 1 ? t2.uno : `${k2} ${t2.plural}`}.»`,
        '',
        `¿Cuántos ${borrada.plural} hay en la línea borrada?`,
      ],
      diales: ['Cantidad'],
      solucion: [qBorrada],
      ayuda: `Ayuda: sin el servicio, la cuenta era de ${subtotal} €. Con el 2×1, de ${r1 * k1} ${promo.plural} solo se pagan ${unidadesConPromo(r1 * k1)}.`,
    };
  }
  throw new Error('No se pudo generar el ticket');
}
