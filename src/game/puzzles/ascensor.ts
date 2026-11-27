// Misión · El registro del ascensor (Ascensor): personas y cajas de botellas.
// La parada borrada se reconstruye con el sensor de peso: 75 kg por persona y 12 kg por caja.
// Solo hay una combinación de personas y cajas que da ese peso exacto.

import { barajar, entero, type Rng } from '../core/rng.ts';
import type { PuzleDiales } from './tipos.ts';

const KG_PERSONA = 75;
const KG_CAJA = 12;

/** Combinaciones (personas, cajas) que dan exactamente ese peso. */
export function combinaciones(peso: number): [number, number][] {
  const res: [number, number][] = [];
  for (let p = 0; p <= 8; p++) for (let c = 0; c <= 9; c++) if (p * KG_PERSONA + c * KG_CAJA === peso) res.push([p, c]);
  return res;
}

export function generarAscensor(rng: Rng): PuzleDiales {
  for (let intento = 0; intento < 1000; intento++) {
    const [f1, pasa, f2] = barajar(rng, [5, 8, 11, 14, 17, 20, 23]).slice(0, 3).sort((a, b) => a - b);
    const p0 = entero(rng, 2, 5);
    const c0 = entero(rng, 0, 3);
    const p1 = entero(rng, 3, 8); // tras la parada borrada
    const c1 = entero(rng, 2, 7);
    if (p1 === p0 && c1 === c0) continue;
    const peso = p1 * KG_PERSONA + c1 * KG_CAJA;
    if (peso > 700 || combinaciones(peso).length !== 1) continue;
    const bajan = entero(rng, 1, Math.min(3, p1 - 1));
    const sube = entero(rng, 0, 2);
    const dejan = entero(rng, 1, Math.min(3, c1));
    const pFinal = p1 - bajan + sube;
    const cFinal = c1 - dejan;
    if (pFinal < 2 || pFinal > 8 || cFinal < 0) continue;

    return {
      tituloTarjeta: 'REGISTRO · ÚLTIMO VIAJE ANTES DEL APAGÓN',
      lineas: [
        'Capacidad: 8 personas · 700 kg',
        `Peso medio: ${KG_PERSONA} kg por persona · ${KG_CAJA} kg por caja de botellas`,
        '',
        `Planta 0 · suben ${p0} personas con ${c0} ${c0 === 1 ? 'caja' : 'cajas'}`,
        `Planta ${f1} · ▒▒▒▒ registro borrado por la estática ▒▒▒▒`,
        `Planta ${pasa} · el sensor marca ${peso} kg`,
        `Planta ${f2} · bajan ${bajan}, ${sube === 0 ? 'no sube nadie' : `sube${sube === 1 ? '' : 'n'} ${sube}`} y dejan ${dejan} ${dejan === 1 ? 'caja' : 'cajas'} en el office`,
        'Planta 27 · puertas abiertas',
        '',
        '¿Cuántas personas y cuántas cajas llegaron a la planta 27?',
      ],
      diales: ['Personas', 'Cajas'],
      solucion: [pFinal, cFinal],
      ayuda: `Ayuda: prueba con cuántas personas el resto del peso (${peso} kg menos 75 por persona) es un múltiplo exacto de 12.`,
    };
  }
  throw new Error('No se pudo generar el registro del ascensor');
}
