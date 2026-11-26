// Escena base de las misiones: cabecera, instrucciones, mensajes, ayuda tras fallos
// y entrega de la pista al resolver el puzle.

import { Scene } from 'phaser';
import { eventos, obtener, registrarFallo, resolverPuzle } from '../core/estado.ts';
import { crearRng, derivar, type Rng } from '../core/rng.ts';
import { MISIONES, type InfoMision } from '../misiones.ts';
import { ANCHO, H, boton, fondo, prepararCamara, texto, type Boton } from '../ui/phaserUi.ts';

export const Y_MENSAJE = 626;
export const Y_ACCION = 676;

export abstract class MisionBase extends Scene {
  protected indice: number;
  protected info: InfoMision;
  protected mensaje!: Phaser.GameObjects.Text;
  protected instrucciones!: Phaser.GameObjects.Text;
  private botonAyuda?: Boton;
  private terminada = false;

  constructor(indice: number) {
    super(MISIONES[indice].escena);
    this.indice = indice;
    this.info = MISIONES[indice];
  }

  create(): void {
    this.terminada = false;
    this.botonAyuda = undefined;
    prepararCamara(this);
    fondo(this);

    const estado = obtener().misiones[this.indice].estado;
    if (estado !== 'disponible') {
      // Misión ya resuelta o bloqueada: volvemos al mapa.
      this.scene.start('Mapa');
      return;
    }

    boton(this, 58, 34, 92, 34, '‹ Mansión', () => this.volver(), 'fantasma', 14);
    texto(this, ANCHO / 2, 70, `Misión ${this.info.numeral} · ${this.info.titulo}`, {
      size: 21,
      color: H.dorado400,
      origen: [0.5, 0.5],
      negrita: true,
    });
    texto(this, ANCHO / 2, 94, this.info.lugar.toUpperCase(), {
      size: 11,
      color: H.gris,
      origen: [0.5, 0.5],
      serif: false,
      espaciado: 2,
    });
    this.instrucciones = texto(this, 24, 112, this.info.instrucciones, {
      size: 13.5,
      ancho: ANCHO - 48,
      color: H.crema,
      cursiva: true,
      interlineado: 3,
    });
    this.mensaje = texto(this, ANCHO / 2, Y_MENSAJE, '', {
      size: 14,
      ancho: ANCHO - 48,
      align: 'center',
      origen: [0.5, 0.5],
      serif: false,
    });

    const rng = crearRng(derivar(obtener().semilla, this.indice));
    this.construir(rng);

    if (obtener().misiones[this.indice].fallos >= 2) this.mostrarBotonAyuda();

    // Si se empieza una partida nueva desde el cuaderno, este puzle ya no vale.
    const semilla = obtener().semilla;
    const off = eventos.on('cambio', (p) => {
      if (p.semilla !== semilla && this.scene.isActive()) this.scene.start('Mapa');
    });
    this.events.once('shutdown', off);
  }

  /** Primera coordenada Y libre bajo las instrucciones. */
  protected yLibre(margen = 14): number {
    return this.instrucciones.y + this.instrucciones.height + margen;
  }

  /** Dibuja el puzle. Recibe un RNG determinista para esta partida y misión. */
  protected abstract construir(rng: Rng): void;

  /** Texto de ayuda que aparece tras dos fallos. */
  protected abstract textoAyuda(): string;

  protected botonAccion(etiqueta: string, alPulsar: () => void): Boton {
    return boton(this, ANCHO / 2, Y_ACCION, ANCHO - 56, 52, etiqueta, alPulsar, 'primario', 17);
  }

  protected avisar(msg: string, tipo: 'info' | 'error' | 'exito' = 'info'): void {
    this.mensaje.setText(msg);
    this.mensaje.setColor(tipo === 'error' ? H.rojo : tipo === 'exito' ? H.dorado400 : H.crema);
    this.mensaje.setAlpha(0);
    this.tweens.add({ targets: this.mensaje, alpha: 1, duration: 180 });
  }

  protected fallo(msg: string): void {
    const fallos = registrarFallo(this.indice);
    this.cameras.main.shake(180, 0.004);
    this.avisar(msg, 'error');
    if (fallos >= 2) this.mostrarBotonAyuda();
  }

  private mostrarBotonAyuda(): void {
    if (this.botonAyuda) return;
    this.botonAyuda = boton(this, ANCHO - 58, 34, 92, 34, 'Ayuda', () => this.avisar(this.textoAyuda()), 'secundario', 14);
  }

  protected exito(msg = 'Resuelto. Has encontrado una pista.'): void {
    if (this.terminada) return;
    this.terminada = true;
    this.input.enabled = false;
    this.avisar(msg, 'exito');
    this.cameras.main.flash(260, 230, 199, 122);
    this.time.delayedCall(900, () => {
      this.input.enabled = true;
      resolverPuzle(this.indice);
      this.scene.start('Mapa');
    });
  }

  protected volver(): void {
    this.scene.start('Mapa');
  }
}

