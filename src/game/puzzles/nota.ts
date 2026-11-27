// Misión · La nota rasgada (Pista de baile): reconstruir el orden de cinco fragmentos.

import { barajarDistinto, elegir, type Rng } from '../core/rng.ts';

export interface Fragmento {
  id: string;
  texto: string;
}

export interface PuzleNota {
  fragmentos: Fragmento[];
  orden: string[];
}

// Cada nota tiene 3 frases que cuentan una misma idea, rotas en 10 trozos.
// Las mayúsculas y los signos ayudan a encajarlos.
const NOTAS: string[][] = [
  // 1. Una cita misteriosa
  [
    'Si estás leyendo esto,',
    'es que no llegué',
    'al brindis de las cuatro.',
    'Alguien me ha citado',
    'lejos de la pista',
    'a las tres y media.',
    'Si me pasa algo,',
    'mirad mi reloj:',
    'marcará la hora exacta',
    'de esa cita.',
  ],
  // 2. Algo que devolver
  [
    'No me esperéis',
    'para el último baile.',
    'Tengo que devolverle',
    'a alguien',
    'algo que no es mío.',
    'Si no vuelvo,',
    'el sobre',
    'de mi chaqueta',
    'lo explica',
    'todo.',
  ],
  // 3. La copa cambiada
  [
    'Que nadie toque',
    'mi copa',
    'mientras estoy en el baño.',
    'Esta noche',
    'ya me la han cambiado',
    'dos veces.',
    'Si me encuentro mal,',
    'avisad a Juanky',
    'antes que',
    'a nadie.',
  ],
  // 4. Lo que vio en el ascensor
  [
    'He visto',
    'algo en el ascensor',
    'que no debía ver.',
    'Si alguien pregunta,',
    'yo estaba en la barra',
    'pidiendo chupitos.',
    'Mañana,',
    'con la resaca,',
    'os cuento',
    'lo que vi.',
  ],
];

export function generarNota(rng: Rng): PuzleNota {
  const nota = elegir(rng, NOTAS);
  const fragmentos = nota.map((texto, i) => ({ id: `f${i}`, texto }));
  return {
    orden: fragmentos.map((f) => f.id),
    fragmentos: barajarDistinto(rng, fragmentos),
  };
}
