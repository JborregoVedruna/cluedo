import { generarCandado, type PuzleCandado } from '../puzzles/candado.ts';
import type { Rng } from '../core/rng.ts';
import { ANCHO, C, H, boton, rectRedondo, texto } from '../ui/phaserUi.ts';
import { MisionBase, Y_MENSAJE } from './MisionBase.ts';

export class CandadoScene extends MisionBase {
  private puzle!: PuzleCandado;
  private valores: number[] = [0, 0, 0];
  private cifras: Phaser.GameObjects.Text[] = [];
  private arco!: Phaser.GameObjects.Graphics;

  constructor() {
    super(1);
  }

  protected construir(rng: Rng): void {
    this.puzle = generarCandado(rng);
    this.valores = [0, 0, 0];
    this.cifras = [];

    // Candado anclado abajo; la tarjeta de reglas ocupa el espacio que queda encima.
    const altoCuerpo = 140;
    const yCuerpo = Y_MENSAJE - 24 - altoCuerpo;
    const radioArco = 44;
    const yTarjeta = this.yLibre(4);
    const limiteTarjeta = yCuerpo - radioArco - 10;

    const lineas = this.puzle.reglas.map((r, i) => `${i + 1}. ${r}`).join('\n');
    let reglas!: Phaser.GameObjects.Text;
    for (const size of [13.5, 12.5, 11.5, 10.5]) {
      reglas?.destroy();
      reglas = texto(this, 40, yTarjeta + 32, lineas, { size, ancho: ANCHO - 80, color: H.tinta, interlineado: 4 });
      if (yTarjeta + reglas.height + 44 <= limiteTarjeta) break;
    }
    const g = this.add.graphics();
    rectRedondo(g, 24, yTarjeta, ANCHO - 48, reglas.height + 44, { relleno: C.papel, radio: 6 });
    g.setDepth(-1);
    texto(this, 40, yTarjeta + 11, 'TARJETA DE PUYANA', {
      size: 10.5,
      color: '#8f1d2c',
      negrita: true,
      serif: false,
      espaciado: 2,
    });

    this.arco = this.add.graphics();
    this.arco.lineStyle(13, C.gris, 1);
    this.arco.beginPath();
    this.arco.arc(ANCHO / 2, yCuerpo + 2, radioArco, Math.PI, 0, false);
    this.arco.strokePath();

    const cuerpo = this.add.graphics();
    rectRedondo(cuerpo, 40, yCuerpo, ANCHO - 80, altoCuerpo, {
      relleno: C.burdeos900,
      borde: C.dorado500,
      grosor: 2,
      radio: 18,
    });

    const cy = yCuerpo + altoCuerpo / 2;
    for (let k = 0; k < 3; k++) {
      const x = ANCHO / 2 + (k - 1) * 88;
      const caja = this.add.graphics();
      rectRedondo(caja, x - 28, cy - 24, 56, 48, { relleno: C.carbon950, borde: C.dorado600 });
      this.cifras.push(texto(this, x, cy, '0', { size: 32, negrita: true, color: H.dorado400, origen: [0.5, 0.5] }));
      boton(this, x, cy - 46, 64, 34, '▲', () => this.girar(k, 1), 'fantasma', 14);
      boton(this, x, cy + 46, 64, 34, '▼', () => this.girar(k, -1), 'fantasma', 14);
    }

    this.botonAccion('Abrir la caja', () => this.comprobar());
    this.avisar('Ajusta los tres diales con las flechas.');
  }

  private girar(k: number, d: number): void {
    this.valores[k] = (this.valores[k] + d + 10) % 10;
    const t = this.cifras[k];
    t.setText(String(this.valores[k]));
    this.tweens.add({ targets: t, scale: { from: 1.25, to: 1 }, duration: 140 });
  }

  private comprobar(): void {
    if (this.valores.every((v, i) => v === this.puzle.digitos[i])) {
      this.tweens.add({ targets: this.arco, y: -22, duration: 380, ease: 'Back.easeOut' });
      this.exito('¡Clic! La caja fuerte se abre.');
    } else {
      this.fallo(`El candado no cede con ${this.valores.join('-')}. Revisa las reglas una a una.`);
    }
  }

  protected textoAyuda(): string {
    const nombres = ['primer', 'segundo', 'tercer'];
    const k = 1;
    return `Ayuda: el ${nombres[k]} dígito es ${this.puzle.digitos[k]}.`;
  }
}
