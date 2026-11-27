// Escena genérica: ordenar tarjetas (reloj, cámaras de seguridad, sesión del DJ).

import type { Rng } from '../core/rng.ts';
import type { PuzleOrden, TarjetaOrden } from '../puzzles/tipos.ts';
import { ANCHO, C, H, rectRedondo, texto, zonaTactil, type Boton } from '../ui/phaserUi.ts';
import { MisionBase } from './MisionBase.ts';

interface Vista {
  datos: TarjetaOrden;
  fondo: Phaser.GameObjects.Graphics;
  insignia: Phaser.GameObjects.Text;
  alto: number;
}

const ANCHO_TARJETA = ANCHO - 36;

export class OrdenarScene extends MisionBase {
  private generar: (rng: Rng) => PuzleOrden;
  private puzle!: PuzleOrden;
  private orden: string[] = [];
  private vistas: Vista[] = [];
  private accion!: Boton;

  constructor(indice: number, generar: (rng: Rng) => PuzleOrden) {
    super(indice);
    this.generar = generar;
  }

  protected construir(rng: Rng): void {
    this.puzle = this.generar(rng);
    this.orden = [];
    this.vistas = [];
    let y = this.yLibre(6);

    if (this.puzle.destacado) {
      const d = this.puzle.destacado;
      let x = 22;
      if (this.puzle.reloj !== undefined) {
        this.dibujarReloj(52, y + 28, 26, this.puzle.reloj);
        x = 92;
      }
      texto(this, x, y + 8, d.etiqueta, { size: 12.5, color: H.gris, serif: false });
      texto(this, x, y + 26, d.valor, { size: 26, color: H.champan400, negrita: true });
      y += 64;
    }

    if (this.puzle.pistas?.length) {
      const t = texto(this, 34, y + 10, this.puzle.pistas.map((p) => `• ${p}`).join('\n'), {
        size: 12,
        ancho: ANCHO - 68,
        color: H.tinta,
        interlineado: 3,
      });
      const g = this.add.graphics();
      this.children.moveBelow(g, t);
      rectRedondo(g, 20, y, ANCHO - 40, t.height + 20, { relleno: C.papel, radio: 6 });
      y += t.height + 30;
    }

    const disponible = this.disponibleDesde(y);
    const conMiniatura = this.puzle.tarjetas.some((t) => t.cordones);
    for (const size of [13, 12, 11, 10]) {
      this.vistas.forEach((v) => v.fondo.parentContainer?.destroy());
      this.vistas = [];
      let yy = y;
      for (const t of this.puzle.tarjetas) {
        const v = this.crearTarjeta(t, yy, size, conMiniatura);
        yy += v.alto + 7;
      }
      if (yy - 7 - y <= disponible) break;
    }

    this.accion = this.botonAccion('Comprobar orden', () => this.comprobar());
    this.accion.habilitar(false);
    this.avisar('Toca las tarjetas de la primera a la última. Vuelve a tocar una para quitarla.');
  }

  private crearTarjeta(t: TarjetaOrden, y: number, size: number, conMiniatura: boolean): Vista {
    const izquierda = conMiniatura ? 128 : 54;
    const cuerpo = texto(this, 0, 0, t.texto, { size, ancho: ANCHO_TARJETA - izquierda - 12, interlineado: 2 });
    const alto = t.texto ? Math.max(58, cuerpo.height + 32) : 56;
    const c = zonaTactil(this, ANCHO / 2, y + alto / 2, ANCHO_TARJETA, alto, () => this.alternar(t.id));
    const fondo = this.add.graphics();
    const etiqueta = texto(this, -ANCHO_TARJETA / 2 + izquierda, -alto / 2 + 9, t.etiqueta.toUpperCase(), {
      size: 10.5,
      color: H.cian400,
      serif: false,
      negrita: true,
      espaciado: 1,
      mono: !!t.cordones,
    });
    cuerpo.setPosition(-ANCHO_TARJETA / 2 + izquierda, -alto / 2 + 25);
    const insignia = texto(this, -ANCHO_TARJETA / 2 + 26, 0, '', {
      size: 17,
      negrita: true,
      color: '#1d1530',
      origen: [0.5, 0.5],
      serif: false,
    });
    c.add([fondo, etiqueta, cuerpo, insignia]);
    if (t.cordones) c.add(this.miniaturaCamara(-ANCHO_TARJETA / 2 + 50, -alto / 2 + 8, 70, alto - 16, t.cordones));
    const vista = { datos: t, fondo, insignia, alto };
    this.vistas.push(vista);
    this.pintar(vista);
    return vista;
  }

  private miniaturaCamara(x: number, y: number, w: number, h: number, cordones: boolean[]): Phaser.GameObjects.Graphics {
    const g = this.add.graphics();
    g.fillStyle(0x1a1a22, 1).fillRect(x, y, w, h);
    g.lineStyle(1, 0x666677, 1).strokeRect(x, y, w, h);
    // Suelo de mármol con reflejo
    g.fillStyle(0xffffff, 0.06).fillRect(x, y + h * 0.62, w, h * 0.38);
    const base = y + h * 0.72;
    const postes = [0, 1, 2, 3].map((k) => x + 8 + (k * (w - 16)) / 3);
    cordones.forEach((puesto, k) => {
      if (!puesto) return;
      g.lineStyle(2, 0xc0264f, 1);
      g.beginPath();
      const x0 = postes[k];
      const x1 = postes[k + 1];
      for (let s = 0; s <= 8; s++) {
        const px = x0 + ((x1 - x0) * s) / 8;
        const py = base - 10 + Math.sin((Math.PI * s) / 8) * 5;
        if (s === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.strokePath();
    });
    for (const px of postes) {
      g.fillStyle(0xd4af37, 1).fillRect(px - 1.5, base - 14, 3, 14);
      g.fillCircle(px, base - 14, 2.5);
    }
    // Ruido de vídeo
    g.lineStyle(1, 0xffffff, 0.05);
    for (let ly = y + 3; ly < y + h; ly += 4) g.lineBetween(x, ly, x + w, ly);
    g.fillStyle(0xff3355, 1).fillCircle(x + w - 6, y + 6, 2);
    return g;
  }

  private pintar(v: Vista): void {
    const pos = this.orden.indexOf(v.datos.id);
    const g = v.fondo;
    g.clear();
    rectRedondo(g, -ANCHO_TARJETA / 2, -v.alto / 2, ANCHO_TARJETA, v.alto, {
      relleno: pos >= 0 ? C.noche700 : C.noche800,
      borde: pos >= 0 ? C.fucsia600 : C.noche600,
    });
    const cx = -ANCHO_TARJETA / 2 + 26;
    if (pos >= 0) {
      g.fillStyle(C.champan500, 1).fillCircle(cx, 0, 15);
      v.insignia.setText(String(pos + 1));
    } else {
      g.lineStyle(1.5, C.cian500, 0.6).strokeCircle(cx, 0, 15);
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
    if (this.orden.every((id, i) => id === this.puzle.orden[i])) {
      this.exito('El orden encaja. Hay una pista nueva.');
    } else {
      const aciertos = this.orden.filter((id, i) => id === this.puzle.orden[i]).length;
      this.fallo(`Ese orden no cuadra (${aciertos} de ${this.puzle.orden.length} en su sitio).`);
    }
  }

  protected textoAyuda(): string {
    return this.puzle.ayuda;
  }

  private dibujarReloj(x: number, y: number, r: number, minuto: number): void {
    const g = this.add.graphics();
    g.fillStyle(C.noche950, 1).fillCircle(x, y, r + 4);
    g.lineStyle(2, C.champan500, 1).strokeCircle(x, y, r + 4);
    g.fillStyle(C.papel, 1).fillCircle(x, y, r);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const largo = i % 3 === 0 ? 6 : 3;
      g.lineStyle(i % 3 === 0 ? 2 : 1, 0x1d1530, 1);
      g.lineBetween(
        x + Math.sin(a) * (r - 2),
        y - Math.cos(a) * (r - 2),
        x + Math.sin(a) * (r - 2 - largo),
        y - Math.cos(a) * (r - 2 - largo),
      );
    }
    const aH = (((minuto / 60) % 12) / 12) * Math.PI * 2;
    const aM = ((minuto % 60) / 60) * Math.PI * 2;
    g.lineStyle(3, 0x1d1530, 1).lineBetween(x, y, x + Math.sin(aH) * r * 0.5, y - Math.cos(aH) * r * 0.5);
    g.lineStyle(2, C.fucsia600, 1).lineBetween(x, y, x + Math.sin(aM) * r * 0.8, y - Math.cos(aM) * r * 0.8);
    g.fillStyle(C.champan500, 1).fillCircle(x, y, 2.5);
    g.lineStyle(1, 0xffffff, 0.8);
    g.beginPath();
    g.moveTo(x - r * 0.7, y - r * 0.5);
    g.lineTo(x - r * 0.15, y - r * 0.1);
    g.lineTo(x + r * 0.1, y - r * 0.55);
    g.moveTo(x - r * 0.15, y - r * 0.1);
    g.lineTo(x + r * 0.45, y + r * 0.35);
    g.strokePath();
  }
}
