// Testimonio de seguridad · El contenedor: emparejar 3 restos hallados con el cuerpo con su procedencia.

import { barajar, elegir, type Rng } from '../core/rng.ts';
import { elegirCondiciones, permutaciones, type Condicion } from './logica.ts';
import type { PuzleEmparejar } from './tipos.ts';

const RESTOS = [
  { id: 'confeti', nombre: 'Confeti dorado', conArticulo: 'el confeti dorado' },
  { id: 'pulsera', nombre: 'Pulsera VIP arrancada', conArticulo: 'la pulsera VIP arrancada' },
  { id: 'hielo', nombre: 'Hielo picado a medio derretir', conArticulo: 'el hielo picado' },
  { id: 'purpurina', nombre: 'Purpurina fucsia', conArticulo: 'la purpurina fucsia' },
  { id: 'hebra', nombre: 'Hebra de terciopelo', conArticulo: 'la hebra de terciopelo' },
  { id: 'corcho', nombre: 'Tapón de corcho', conArticulo: 'el tapón de corcho' },
];

const PROCEDENCIAS = [
  { id: 'cubitera', nombre: 'Cubitera de la barra', conArticulo: 'la cubitera de la barra' },
  { id: 'canon', nombre: 'Cañón de confeti de la pista', conArticulo: 'el cañón de confeti de la pista' },
  { id: 'sofa', nombre: 'Sofá de la zona VIP', conArticulo: 'el sofá de la zona VIP' },
  { id: 'lavabo', nombre: 'Lavabo de piedra negra', conArticulo: 'el lavabo de piedra negra' },
  { id: 'suelo', nombre: 'Suelo del ascensor', conArticulo: 'el suelo del ascensor' },
  { id: 'mostrador', nombre: 'Mostrador de recepción', conArticulo: 'el mostrador de recepción' },
];

const FUENTES = [
  'El vigilante de noche asegura que',
  'Según el informe de seguridad,',
  'La cámara del muelle de carga muestra que',
  'El jefe de seguridad insiste en que',
  'El vigilante del parking recuerda que',
];

function de(conArticulo: string): string {
  return conArticulo.replace(/^el /, 'del ').replace(/^la /, 'de la ');
}

export function generarContenedor(rng: Rng): PuzleEmparejar {
  for (let intento = 0; intento < 100; intento++) {
    const restos = barajar(rng, RESTOS);
    const lugares = barajar(rng, PROCEDENCIAS);
    const solucion = barajar(rng, [0, 1, 2, 3, 4, 5]);
    const pool: Condicion<number[]>[] = [];
    // Dos afirmaciones directas como mucho; el resto se deduce por descarte.
    for (const i of barajar(rng, [0, 1, 2, 3, 4, 5]).slice(0, 2)) {
      const r = restos[i];
      pool.push({
        texto: `${elegir(rng, FUENTES)} ${r.conArticulo} salió ${de(lugares[solucion[i]].conArticulo)}.`,
        cumple: (p) => p[i] === solucion[i],
      });
    }
    restos.forEach((r, i) =>
      lugares.forEach((l, j) =>
        pool.push({
          texto: `${elegir(rng, FUENTES)} ${r.conArticulo} no salió ${de(l.conArticulo)}.`,
          cumple: (p) => p[i] !== j,
        }),
      ),
    );
    const pistas = elegirCondiciones(rng, permutaciones(6), (p) => p.every((v, i) => v === solucion[i]), pool, 25);
    if (!pistas || pistas.length > 10) continue;
    const correcto: Record<string, string> = {};
    restos.forEach((r, i) => (correcto[r.id] = lugares[solucion[i]].id));
    return {
      izquierda: restos.map(({ id, nombre }) => ({ id, nombre })),
      derecha: lugares.map(({ id, nombre }) => ({ id, nombre })),
      correcto,
      pistas,
      tituloIzq: 'Restos',
      tituloDer: 'Procedencia',
      tituloPistas: 'Informe de seguridad',
    };
  }
  throw new Error('No se pudo generar el informe del contenedor');
}
