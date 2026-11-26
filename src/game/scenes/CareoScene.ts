import { generarCareo, type PuzleCareo } from '../puzzles/careo.ts';
import type { Rng } from '../core/rng.ts';
import { ANCHO, C, H, rectRedondo, texto, zonaTactil, type Boton } from '../ui/phaserUi.ts';
import { MisionBase, Y_MENSAJE } from './MisionBase.ts';

export class CareoScene extends MisionBase {
  private puzle!: PuzleCareo;
  private elegido: number | null = null;
  private fondos: Phaser.GameObjects.Graphics[] = [];
  private sellos: Phaser.GameObjects.Text[] = [];
  private accion!: Boton;
  private alto = 120;

  constructor() {
    super(4);
  }

  protected construir(rng: Rng): void {
    this.puzle = generarCareo(rng);
    this.elegido = null;
    this.fondos = [];
    this.sellos = [];

    const y0 = this.yLibre(10);
    const disponible = Y_MENSAJE - 30 - y0;
    this.alto = Math.min(130, Math.floor((disponible - 24) / 3));
    const ancho = ANCHO - 40;

    this.puzle.testigos.forEach((t, i) => {
      const y = y0 + i * (this.alto + 12) + this.alto / 2;
      const c = zonaTactil(this, ANCHO / 2, y, ancho, this.alto, () => this.elegir(i));
      const g = this.add.graphics();
      const nombre = texto(this, -ancho / 2 + 20, -this.alto / 2 + 14, t.nombre.toUpperCase(), {
        size: 13,
        negrita: true,
        color: H.dorado400,
        serif: false,
        espaciado: 2,
      });
      const frase = texto(this, -ancho / 2 + 20, -this.alto / 2 + 40, t.frase, {
        size: 17,
        cursiva: true,
        ancho: ancho - 40,
        interlineado: 4,
      });
      const sello = texto(this, ancho / 2 - 16, -this.alto / 2 + 14, '', {
        size: 11,
        negrita: true,
        color: H.rojo,
        serif: false,
        origen: [1, 0],
        espaciado: 1.5,
      });
      c.add([g, nombre, frase, sello]);
      this.fondos.push(g);
      this.sellos.push(sello);
    });

    this.accion = this.botonAccion('Desenmascarar', () => this.comprobar());
    this.repintar();
    this.avisar('Supón por turnos que cada uno miente y comprueba si las otras frases encajan.');
  }

  private repintar(): void {
    const ancho = ANCHO - 40;
    this.fondos.forEach((g, i) => {
      const sel = this.elegido === i;
      g.clear();
      rectRedondo(g, -ancho / 2, -this.alto / 2, ancho, this.alto, {
        relleno: sel ? C.burdeos900 : C.carbon800,
        borde: sel ? C.rojo : C.carbon600,
        grosor: sel ? 2.5 : 1.5,
        radio: 14,
      });
      this.sellos[i].setText(sel ? 'MIENTE' : '');
    });
    this.accion.habilitar(this.elegido !== null);
  }

  private elegir(i: number): void {
    this.elegido = this.elegido === i ? null : i;
    this.repintar();
  }

  private comprobar(): void {
    if (this.elegido === this.puzle.mentiroso) {
      this.exito(`Exacto: ${this.puzle.testigos[this.elegido].nombre} mentía.`);
    } else {
      this.fallo('Si esa persona mintiera, otra de las frases sería contradictoria. Prueba otra hipótesis.');
    }
  }

  protected textoAyuda(): string {
    const inocente = [0, 1, 2].find((i) => i !== this.puzle.mentiroso)!;
    return `Ayuda: ${this.puzle.testigos[inocente].nombre} dice la verdad.`;
  }
}
