// Misión · El guardarropa (Hall de entrada): seis objetos en consigna ↔ seis invitados.
// Cada objeto está ligado al secreto de su dueño; las notas de la encargada lo demuestran.

import { SOSPECHOSOS } from '../../data/caso.ts';
import { barajar, elegir, type Rng } from '../core/rng.ts';
import { elegirCondiciones, permutaciones, type Condicion } from './logica.ts';
import type { PuzleEmparejar } from './tipos.ts';

const OBJETOS: { id: string; nombre: string; conArticulo: string; dueno: string }[] = [
  { id: 'recibo', nombre: 'Recibo de farmacia con un beso de carmín', conArticulo: 'el recibo de farmacia con carmín', dueno: 'machi' },
  { id: 'entrada', nombre: 'Entrada arrugada de la terraza con el número de Amara apuntado por detrás', conArticulo: 'la entrada arrugada de la terraza', dueno: 'kike' },
  { id: 'llave', nombre: 'Llave de furgoneta con ambientador de pino', conArticulo: 'la llave de furgoneta', dueno: 'jack' },
  { id: 'foto', nombre: 'Foto de fotomatón con Puyana, los dos sonriendo', conArticulo: 'la foto de fotomatón', dueno: 'juaky' },
  { id: 'bonobus', nombre: 'Bonobús sin viajes', conArticulo: 'el bonobús sin viajes', dueno: 'plakito' },
  { id: 'billetes', nombre: 'Sobre con dos billetes a Mauricio', conArticulo: 'el sobre con billetes', dueno: 'paula' },
];

const FUENTES = [
  'Según la encargada,',
  'La etiqueta de consigna dice que',
  'El portero recuerda que',
  'En la libreta del guardarropa pone que',
  'Una invitada asegura que',
];

export function generarGuardarropa(rng: Rng): PuzleEmparejar {
  const objetos = barajar(rng, OBJETOS);
  const personas = barajar(rng, SOSPECHOSOS);
  // solucion[i] = índice en `personas` del dueño del objeto i
  const solucion = objetos.map((o) => personas.findIndex((p) => p.id === o.dueno));
  const universo = permutaciones(objetos.length);
  const pool: Condicion<number[]>[] = [];
  // Solo dos afirmaciones directas; el resto se deduce por descarte.
  for (const i of barajar(rng, [0, 1, 2, 3, 4, 5]).slice(0, 2)) {
    const o = objetos[i];
    pool.push({
      texto: `${elegir(rng, FUENTES)} ${o.conArticulo} ${o.conArticulo.startsWith('la ') ? 'la' : 'lo'} dejó ${personas[solucion[i]].nombre}.`,
      cumple: (perm) => perm[i] === solucion[i],
    });
  }
  objetos.forEach((o, i) => {
    personas.forEach((p, j) => {
      pool.push({
        texto: `${elegir(rng, FUENTES)} ${o.conArticulo} no ${o.conArticulo.startsWith('la ') ? 'la' : 'lo'} dejó ${p.nombre}.`,
        cumple: (perm) => perm[i] !== j,
      });
    });
  });
  const pistas =
    elegirCondiciones(rng, universo, (perm) => perm.every((v, i) => v === solucion[i]), pool, 25) ?? [];

  const correcto: Record<string, string> = {};
  objetos.forEach((o, i) => (correcto[o.id] = personas[solucion[i]].id));
  return {
    izquierda: objetos.map((o) => ({ id: o.id, nombre: o.nombre })),
    derecha: personas.map((p) => ({ id: p.id, nombre: p.nombre })),
    correcto,
    pistas,
    tituloIzq: 'Objetos',
    tituloDer: 'Invitados',
    tituloPistas: 'Notas de la encargada',
  };
}
