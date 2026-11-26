import { generarReloj, hhmm, type PuzleReloj, type TarjetaReloj } from '../puzzles/reloj.ts';
import type { Rng } from '../core/rng.ts';
import { ANCHO, C, H, rectRedondo, texto, zonaTactil, type Boton } from '../ui/phaserUi.ts';
import { MisionBase, Y_MENSAJE } from './MisionBase.ts';

interface VistaTarjeta {
  datos: TarjetaReloj;
  fondo: Phaser.GameObjects.Graphics;
  insignia: Phaser.GameObjects.Text;
  alto: number;
}

export class RelojScene extends MisionBase {
  private puzle!: PuzleReloj;
  private orden: string[] = [];
  private vistas: VistaTarjeta[] = [];
  private accion!: Boton;

  constructor() {
    super(0);
  }

  protected construir(rng: Rng): void {
    this.puzle = generarReloj(rng);
    this.orden = [];
    this.vistas = [];

    const yReloj = this.yLibre(8) + 36;
    this.dibujarReloj(64, yReloj, 34, this.puzle.parada);
    texto(this, 112, yReloj - 22, 'El reloj de Puyana se detuvo a las', { size: 13, color: H.gris, serif: false });
    texto(this, 112, yReloj - 2, hhmm(this.puzle.parada), { size: 30, color: H.dorado400, negrita: true });

    // Tarjetas apiladas; el tamaño de letra se ajusta si no caben.
    const yInicio = yReloj + 50;
    const disponible = Y_MENSAJE - 24 - yInicio;
    for (const size of [13.5, 12.5, 11.5]) {
      this.vistas.forEach((v) => v.fondo.parentContainer?.destroy());
      this.vistas = [];
      let y = yInicio;
      for (const t of this.puzle.tarjetas) {
        const v = this.crearTarjeta(t, y, size);
        y += v.alto + 8;
      }
      if (y - 8 - yInicio <= disponible) break;
    }

    this.accion = this.botonAccion('Comprobar orden', () => this.comprobar());
    this.accion.habilitar(false);
    this.avisar('Toca los testimonios del primero al último. Vuelve a tocar uno para quitarlo.');
  }

  private crearTarjeta(t: TarjetaReloj, y: number, size: number): VistaTarjeta {
    const ancho = ANCHO - 40;
    const cuerpo = texto(this, 0, 0, t.texto, { size, ancho: ancho - 70, interlineado: 2 });
    const alto = Math.max(64, cuerpo.height + 34);
    const c = zonaTactil(this, ANCHO / 2, y + alto / 2, ancho, alto, () => this.alternar(t.id));
    const fondo = this.add.graphics();
    const testigo = texto(this, -ancho / 2 + 58, -alto / 2 + 9, t.testigo.toUpperCase(), {
      size: 10.5,
      color: H.dorado500,
      serif: false,
      negrita: true,
      espaciado: 1.5,
    });
    cuerpo.setPosition(-ancho / 2 + 58, -alto / 2 + 24);
    const insignia = texto(this, -ancho / 2 + 28, 0, '', {
      size: 18,
      negrita: true,
      color: '#1a1206',
      origen: [0.5, 0.5],
      serif: false,
    });
    c.add([fondo, testigo, cuerpo, insignia]);
    const vista = { datos: t, fondo, insignia, alto };
    this.vistas.push(vista);
    this.pintar(vista);
    return vista;
  }

  private pintar(v: VistaTarjeta): void {
    const ancho = ANCHO - 40;
    const pos = this.orden.indexOf(v.datos.id);
    const g = v.fondo;
    g.clear();
    rectRedondo(g, -ancho / 2, -v.alto / 2, ancho, v.alto, {
      relleno: pos >= 0 ? C.carbon700 : C.carbon800,
      borde: pos >= 0 ? C.dorado500 : C.carbon600,
      alfaBorde: pos >= 0 ? 0.9 : 1,
    });
    const cx = -ancho / 2 + 28;
    if (pos >= 0) {
      g.fillStyle(C.dorado500, 1).fillCircle(cx, 0, 16);
      v.insignia.setText(String(pos + 1));
    } else {
      g.lineStyle(1.5, C.dorado500, 0.5).strokeCircle(cx, 0, 16);
      v.insignia.setText('');
    }
  }

  private alternar(id: string): void {
    const i = this.orden.indexOf(id);
    if (i >= 0) this.orden.splice(i, 1);
    else this.orden.push(id);
    this.vistas.forEach((v) => this.pintar(v));
    this.accion.habilitar(this.orden.length === this.puzle.tarjetas.length);
  }

  private comprobar(): void {
    const correcto = this.orden.every((id, i) => id === this.puzle.orden[i]);
    if (correcto) {
      this.exito('La cronología encaja. El reloj guarda una pista.');
    } else {
      const aciertos = this.orden.filter((id, i) => id === this.puzle.orden[i]).length;
      this.fallo(`Ese orden no cuadra con los testimonios (${aciertos} de 4 en su sitio). Pasa todas las horas a un mismo formato.`);
    }
  }

  protected textoAyuda(): string {
    const primero = this.puzle.tarjetas.find((t) => t.id === this.puzle.orden[0])!;
    return `Ayuda: el primer suceso es el que cuenta ${primero.testigo}.`;
  }

  private dibujarReloj(x: number, y: number, r: number, minuto: number): void {
    const g = this.add.graphics();
    g.fillStyle(C.carbon950, 1).fillCircle(x, y, r + 5);
    g.lineStyle(2, C.dorado500, 1).strokeCircle(x, y, r + 5);
    g.fillStyle(C.papel, 1).fillCircle(x, y, r);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const largo = i % 3 === 0 ? 7 : 4;
      g.lineStyle(i % 3 === 0 ? 2 : 1, 0x2a1a12, 1);
      g.lineBetween(
        x + Math.sin(a) * (r - 3),
        y - Math.cos(a) * (r - 3),
        x + Math.sin(a) * (r - 3 - largo),
        y - Math.cos(a) * (r - 3 - largo),
      );
    }
    const h = (minuto / 60) % 12;
    const m = minuto % 60;
    const aH = (h / 12) * Math.PI * 2;
    const aM = (m / 60) * Math.PI * 2;
    g.lineStyle(3, 0x2a1a12, 1).lineBetween(x, y, x + Math.sin(aH) * r * 0.5, y - Math.cos(aH) * r * 0.5);
    g.lineStyle(2, C.burdeos700, 1).lineBetween(x, y, x + Math.sin(aM) * r * 0.8, y - Math.cos(aM) * r * 0.8);
    g.fillStyle(C.dorado500, 1).fillCircle(x, y, 3);
    // Cristal roto
    g.lineStyle(1, 0xffffff, 0.75);
    g.beginPath();
    g.moveTo(x - r * 0.7, y - r * 0.5);
    g.lineTo(x - r * 0.15, y - r * 0.1);
    g.lineTo(x + r * 0.1, y - r * 0.55);
    g.moveTo(x - r * 0.15, y - r * 0.1);
    g.lineTo(x + r * 0.45, y + r * 0.35);
    g.lineTo(x + r * 0.2, y + r * 0.7);
    g.strokePath();
  }
}
