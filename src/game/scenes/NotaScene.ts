import { generarNota, type Fragmento, type PuzleNota } from '../puzzles/nota.ts';
import type { Rng } from '../core/rng.ts';
import { ANCHO, C, H, texto, zonaTactil } from '../ui/phaserUi.ts';
import { MisionBase, Y_MENSAJE } from './MisionBase.ts';

/** Dibuja un trozo de papel con bordes rasgados. */
function papelRasgado(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, semilla: number, color: number) {
  let s = semilla;
  const azar = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const puntos: { x: number; y: number }[] = [];
  const pasos = Math.max(6, Math.round(w / 18));
  for (let i = 0; i <= pasos; i++) puntos.push({ x: x + (w * i) / pasos, y: y + azar() * 4 });
  for (let i = 1; i <= 3; i++) puntos.push({ x: x + w - azar() * 4, y: y + (h * i) / 4 });
  for (let i = pasos; i >= 0; i--) puntos.push({ x: x + (w * i) / pasos, y: y + h - azar() * 4 });
  for (let i = 3; i >= 1; i--) puntos.push({ x: x + azar() * 4, y: y + (h * i) / 4 });
  g.fillStyle(0x000000, 0.35).fillPoints(puntos.map((p) => ({ x: p.x + 2, y: p.y + 3 })), true);
  g.fillStyle(color, 1).fillPoints(puntos, true);
}

export class NotaScene extends MisionBase {
  private puzle!: PuzleNota;
  private colocados: string[] = [];
  private textoNota!: Phaser.GameObjects.Text;
  private piezas = new Map<string, Phaser.GameObjects.Container>();
  private bloqueado = false;

  constructor() {
    super(3);
  }

  protected construir(rng: Rng): void {
    this.puzle = generarNota(rng);
    this.colocados = [];
    this.piezas = new Map();
    this.bloqueado = false;

    // Nota reconstruida
    const yNota = this.yLibre(6);
    const altoNota = 168;
    const g = this.add.graphics();
    papelRasgado(g, 26, yNota, ANCHO - 52, altoNota, 7, C.papel);
    g.lineStyle(1, 0x8f1d2c, 0.25);
    for (let ly = yNota + 44; ly < yNota + altoNota - 10; ly += 26) g.lineBetween(40, ly, ANCHO - 40, ly);
    texto(this, 42, yNota + 14, 'NOTA DE PUYANA', { size: 10.5, color: '#8f1d2c', negrita: true, serif: false, espaciado: 2 });
    this.textoNota = texto(this, 42, yNota + 34, '', {
      size: 17,
      cursiva: true,
      color: H.tinta,
      ancho: ANCHO - 84,
      interlineado: 6,
    });

    // Fragmentos
    const yFrag = yNota + altoNota + 18;
    const paso = Math.min(52, Math.floor((Y_MENSAJE - 30 - yFrag) / this.puzle.fragmentos.length));
    this.puzle.fragmentos.forEach((f, i) => this.crearPieza(f, i, yFrag + i * paso + paso / 2, paso - 8));

    this.botonAccion('Empezar de nuevo', () => this.reiniciar());
    this.avisar('Toca los fragmentos en el orden en que se leen.');
    this.actualizarNota();
  }

  private crearPieza(f: Fragmento, i: number, y: number, alto: number): void {
    const ancho = ANCHO - 60;
    const c = zonaTactil(this, ANCHO / 2, y, ancho, alto, () => this.colocar(f.id));
    const g = this.add.graphics();
    papelRasgado(g, -ancho / 2, -alto / 2, ancho, alto, 31 + i * 17, 0xd9c9a6);
    const t = texto(this, 0, 0, f.texto, { size: 15, cursiva: true, color: H.tinta, origen: [0.5, 0.5] });
    c.add([g, t]);
    c.setAngle((i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4));
    this.piezas.set(f.id, c);
  }

  private colocar(id: string): void {
    if (this.bloqueado || this.colocados.includes(id)) return;
    this.colocados.push(id);
    const pieza = this.piezas.get(id)!;
    pieza.disableInteractive();
    this.tweens.add({ targets: pieza, alpha: 0.18, scale: 0.96, duration: 160 });
    this.actualizarNota();

    if (this.colocados.length === this.puzle.orden.length) {
      const bien = this.colocados.every((x, i) => x === this.puzle.orden[i]);
      if (bien) this.exito('El mensaje tiene sentido. Le das la vuelta al papel...');
      else {
        this.bloqueado = true;
        this.fallo('Así el mensaje no se entiende. Fíjate en mayúsculas y puntos.');
        this.time.delayedCall(1100, () => this.reiniciar(false));
      }
    }
  }

  private actualizarNota(): void {
    const frases = this.colocados.map((id) => this.puzle.fragmentos.find((f) => f.id === id)!.texto);
    this.textoNota.setText(frases.length ? frases.join(' ') : '…');
  }

  private reiniciar(limpiarMensaje = true): void {
    this.bloqueado = false;
    this.colocados = [];
    for (const p of this.piezas.values()) {
      p.setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: p, alpha: 1, scale: 1, duration: 160 });
    }
    this.actualizarNota();
    if (limpiarMensaje) this.avisar('Toca los fragmentos en el orden en que se leen.');
  }

  protected textoAyuda(): string {
    const [a, b] = this.puzle.orden.map((id) => this.puzle.fragmentos.find((f) => f.id === id)!.texto);
    return `Ayuda: la nota empieza «${a} ${b}…»`;
  }
}
