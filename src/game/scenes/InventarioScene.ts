import { generarInventario, type Ficha, type PuzleInventario } from '../puzzles/inventario.ts';
import type { Rng } from '../core/rng.ts';
import { ANCHO, C, H, rectRedondo, texto, zonaTactil, type Boton } from '../ui/phaserUi.ts';
import { MisionBase, Y_MENSAJE } from './MisionBase.ts';

const LETRAS = ['A', 'B', 'C'];
const COLORES = [C.dorado500, 0x5fb3a8, 0xd0708a];
const COLORES_HEX = ['#c9a24a', '#5fb3a8', '#d0708a'];

interface Tarjeta {
  ficha: Ficha;
  fondo: Phaser.GameObjects.Graphics;
  etiqueta: Phaser.GameObjects.Text;
}

export class InventarioScene extends MisionBase {
  private puzle!: PuzleInventario;
  private seleccion: string | null = null;
  /** muestra → lugar */
  private enlaces = new Map<string, string>();
  private muestras: Tarjeta[] = [];
  private lugares: Tarjeta[] = [];
  private accion!: Boton;
  private readonly anchoCol = 170;
  private altoTarjeta = 60;

  constructor() {
    super(2);
  }

  protected construir(rng: Rng): void {
    this.puzle = generarInventario(rng);
    this.seleccion = null;
    this.enlaces = new Map();
    this.muestras = [];
    this.lugares = [];

    // Testimonios
    const y0 = this.yLibre(2);
    const lista = this.puzle.testimonios.map((t) => `• ${t}`).join('\n');
    const tTest = texto(this, 36, y0 + 30, lista, { size: 13, ancho: ANCHO - 72, interlineado: 4, color: H.tinta });
    const g = this.add.graphics().setDepth(-1);
    rectRedondo(g, 22, y0, ANCHO - 44, tTest.height + 42, { relleno: C.papel, radio: 6 });
    texto(this, 36, y0 + 10, 'DECLARACIONES', { size: 10.5, color: '#8f1d2c', negrita: true, serif: false, espaciado: 2 });

    // Columnas
    const yCab = y0 + tTest.height + 58;
    const xIzq = 22 + this.anchoCol / 2;
    const xDer = ANCHO - 22 - this.anchoCol / 2;
    texto(this, xIzq, yCab, 'MUESTRAS', { size: 10.5, color: H.gris, origen: [0.5, 0.5], serif: false, espaciado: 2 });
    texto(this, xDer, yCab, 'PROCEDENCIA', { size: 10.5, color: H.gris, origen: [0.5, 0.5], serif: false, espaciado: 2 });

    const yPrimera = yCab + 16;
    const espacio = Y_MENSAJE - 26 - yPrimera;
    this.altoTarjeta = Math.min(64, Math.floor((espacio - 20) / 3));
    const paso = this.altoTarjeta + 10;

    this.puzle.muestras.forEach((f, i) => {
      this.muestras.push(this.tarjeta(f, xIzq, yPrimera + i * paso + this.altoTarjeta / 2, () => this.tocarMuestra(f.id)));
    });
    this.puzle.lugares.forEach((f, i) => {
      this.lugares.push(this.tarjeta(f, xDer, yPrimera + i * paso + this.altoTarjeta / 2, () => this.tocarLugar(f.id)));
    });

    this.accion = this.botonAccion('Comprobar parejas', () => this.comprobar());
    this.repintar();
    this.avisar('Toca una muestra y luego su procedencia.');
  }

  private tarjeta(ficha: Ficha, x: number, y: number, alPulsar: () => void): Tarjeta {
    const c = zonaTactil(this, x, y, this.anchoCol, this.altoTarjeta, alPulsar);
    const fondo = this.add.graphics();
    const nombre = texto(this, 12, 0, ficha.nombre, {
      size: 13,
      ancho: this.anchoCol - 46,
      origen: [0.5, 0.5],
      align: 'center',
      interlineado: 1,
    });
    const etiqueta = texto(this, -this.anchoCol / 2 + 18, 0, '', {
      size: 14,
      negrita: true,
      color: '#1a1206',
      origen: [0.5, 0.5],
      serif: false,
    });
    c.add([fondo, nombre, etiqueta]);
    return { ficha, fondo, etiqueta };
  }

  private pintar(t: Tarjeta, color: number | null, resaltada: boolean, letra: string): void {
    const w = this.anchoCol;
    const h = this.altoTarjeta;
    t.fondo.clear();
    rectRedondo(t.fondo, -w / 2, -h / 2, w, h, {
      relleno: resaltada ? C.carbon700 : C.carbon800,
      borde: color ?? C.carbon600,
      grosor: resaltada ? 2.5 : 1.5,
    });
    const cx = -w / 2 + 18;
    if (color !== null) t.fondo.fillStyle(color, 1).fillCircle(cx, 0, 11);
    else t.fondo.lineStyle(1, C.gris, 0.6).strokeCircle(cx, 0, 11);
    t.etiqueta.setText(letra);
  }

  private repintar(): void {
    this.muestras.forEach((t, i) => {
      this.pintar(t, COLORES[i], this.seleccion === t.ficha.id, LETRAS[i]);
    });
    this.lugares.forEach((t) => {
      const muestra = [...this.enlaces.entries()].find(([, l]) => l === t.ficha.id)?.[0];
      const i = muestra ? this.puzle.muestras.findIndex((m) => m.id === muestra) : -1;
      this.pintar(t, i >= 0 ? COLORES[i] : null, false, i >= 0 ? LETRAS[i] : '');
    });
    this.accion.habilitar(this.enlaces.size === 3);
  }

  private tocarMuestra(id: string): void {
    this.seleccion = this.seleccion === id ? null : id;
    if (this.seleccion) {
      const i = this.puzle.muestras.findIndex((m) => m.id === id);
      this.mensaje.setColor(COLORES_HEX[i]);
      this.mensaje.setText(`Muestra ${LETRAS[i]} seleccionada: ahora toca su procedencia.`);
    }
    this.repintar();
  }

  private tocarLugar(id: string): void {
    if (!this.seleccion) {
      this.avisar('Primero toca una muestra de la columna izquierda.');
      return;
    }
    for (const [m, l] of this.enlaces) if (l === id) this.enlaces.delete(m);
    this.enlaces.set(this.seleccion, id);
    this.seleccion = null;
    this.avisar(this.enlaces.size === 3 ? 'Parejas listas. Compruébalas.' : 'Bien. Sigue con otra muestra.');
    this.repintar();
  }

  private comprobar(): void {
    const malas = this.puzle.muestras.filter((m) => this.enlaces.get(m.id) !== this.puzle.correcto[m.id]).length;
    if (malas === 0) this.exito('Las tres muestras encajan con su procedencia.');
    else this.fallo(`Hay ${malas === 1 ? 'una pareja incorrecta' : `${malas} parejas incorrectas`}. Vuelve a leer las declaraciones.`);
  }

  protected textoAyuda(): string {
    const m = this.puzle.muestras[0];
    const l = this.puzle.lugares.find((x) => x.id === this.puzle.correcto[m.id])!;
    return `Ayuda: la muestra A (${m.nombre}) procede de: ${l.nombre}.`;
  }
}
