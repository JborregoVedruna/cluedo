// Misión 3 · El inventario: emparejar 3 muestras con su procedencia mediante testimonios.

import { barajar, elegir, type Rng } from '../core/rng.ts';

export interface Ficha {
  id: string;
  nombre: string;
}

export interface PuzleInventario {
  muestras: Ficha[];
  lugares: Ficha[];
  /** muestra.id → lugar.id */
  correcto: Record<string, string>;
  testimonios: string[];
}

const MUESTRAS = [
  { id: 'huella', nombre: 'Huella dactilar parcial', conArticulo: 'la huella dactilar parcial' },
  { id: 'residuo', nombre: 'Residuo blanquecino', conArticulo: 'el residuo blanquecino' },
  { id: 'nota', nombre: 'Nota de compra arrugada', conArticulo: 'la nota de compra arrugada' },
  { id: 'vino', nombre: 'Mancha de vino tinto', conArticulo: 'la mancha de vino tinto' },
  { id: 'cera', nombre: 'Gota de cera roja', conArticulo: 'la gota de cera roja' },
  { id: 'hebra', nombre: 'Hebra de tela dorada', conArticulo: 'la hebra de tela dorada' },
];

const PROCEDENCIAS = [
  { id: 'copa', nombre: 'Copa de Puyana', conArticulo: 'la copa de Puyana' },
  { id: 'encimera', nombre: 'Encimera de la Cocina', conArticulo: 'la encimera de la Cocina' },
  { id: 'estante', nombre: 'Estante de la Bodega', conArticulo: 'el estante de la Bodega' },
  { id: 'despensa', nombre: 'Despensa', conArticulo: 'la despensa' },
  { id: 'barrica', nombre: 'Barrica n.º 12', conArticulo: 'la barrica n.º 12' },
  { id: 'escalera', nombre: 'Escalera de servicio', conArticulo: 'la escalera de servicio' },
];

const FUENTES = [
  'El forense asegura que',
  'La doncella jura que',
  'Según el sumiller,',
  'El mayordomo insiste en que',
  'Tus propias notas indican que',
  'Un pinche recuerda que',
];

const PERMUTACIONES = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

export function generarInventario(rng: Rng): PuzleInventario {
  const muestras = barajar(rng, MUESTRAS).slice(0, 3);
  const lugares = barajar(rng, PROCEDENCIAS).slice(0, 3);
  const perm = elegir(rng, PERMUTACIONES);

  const negativas: { i: number; j: number }[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (perm[i] !== j) negativas.push({ i, j });

  let vivas = PERMUTACIONES.filter((q) => q.join() !== perm.join());
  const fuentes = barajar(rng, FUENTES);
  const testimonios: string[] = [];
  for (const { i, j } of barajar(rng, negativas)) {
    const siguientes = vivas.filter((q) => q[i] !== j);
    if (siguientes.length === vivas.length) continue;
    vivas = siguientes;
    const fuente = fuentes[testimonios.length % fuentes.length];
    const origen = lugares[j].conArticulo.replace(/^el /, 'del ').replace(/^(la|los|las) /, 'de $1 ');
    testimonios.push(`${fuente} ${muestras[i].conArticulo} no salió ${origen}.`);
    if (vivas.length === 0) break;
  }

  const correcto: Record<string, string> = {};
  muestras.forEach((m, i) => (correcto[m.id] = lugares[perm[i]].id));

  return {
    muestras: muestras.map(({ id, nombre }) => ({ id, nombre })),
    lugares: lugares.map(({ id, nombre }) => ({ id, nombre })),
    correcto,
    testimonios,
  };
}
