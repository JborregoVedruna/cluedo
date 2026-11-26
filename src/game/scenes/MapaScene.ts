// Vestíbulo de la mansión: las 5 misiones, su estado y el progreso de la investigación.

import { Scene } from 'phaser';
import { eventos, obtener, puedeAcusar, TOTAL_MISIONES } from '../core/estado.ts';
import { busUi } from '../core/eventos.ts';
import type { EstadoMision } from '../core/tipos.ts';
import { MISIONES } from '../misiones.ts';
import { ANCHO, C, H, fondo, prepararCamara, rectRedondo, texto, zonaTactil } from '../ui/phaserUi.ts';

const ESTADOS: Record<EstadoMision, { texto: string; color: string }> = {
  bloqueada: { texto: 'Bloqueada', color: H.gris },
  disponible: { texto: 'Disponible · toca para investigar', color: H.dorado400 },
  descarte: { texto: 'Pista obtenida · descarte pendiente', color: H.rojo },
  completada: { texto: 'Completada · toca para releer la pista', color: H.verde },
};

export class MapaScene extends Scene {
  private aviso!: Phaser.GameObjects.Text;

  constructor() {
    super('Mapa');
  }

  create(): void {
    prepararCamara(this);
    fondo(this);
    const partida = obtener();

    texto(this, ANCHO / 2, 34, 'VILLA PUYANA', {
      size: 12,
      color: H.dorado500,
      origen: [0.5, 0.5],
      serif: false,
      negrita: true,
      espaciado: 5,
    });
    texto(this, ANCHO / 2, 62, 'La noche del crimen', { size: 25, origen: [0.5, 0.5] });
    texto(this, ANCHO / 2, 92, 'Resuelve las cinco misiones y reúne las pistas.', {
      size: 13,
      color: H.gris,
      origen: [0.5, 0.5],
      cursiva: true,
    });

    const alto = 88;
    MISIONES.forEach((info, i) => {
      const estado = partida.misiones[i].estado;
      const y = 120 + i * (alto + 10) + alto / 2;
      const ancho = ANCHO - 40;
      const c = zonaTactil(this, ANCHO / 2, y, ancho, alto, () => this.tocar(i));
      const g = this.add.graphics();
      const activa = estado === 'disponible' || estado === 'descarte';
      rectRedondo(g, -ancho / 2, -alto / 2, ancho, alto, {
        relleno: activa ? C.burdeos900 : C.carbon800,
        alfa: estado === 'bloqueada' ? 0.55 : 1,
        borde: activa ? C.dorado500 : estado === 'completada' ? C.verde : C.carbon600,
        alfaBorde: activa ? 0.9 : 0.6,
        radio: 14,
      });
      const cx = -ancho / 2 + 36;
      g.fillStyle(estado === 'bloqueada' ? C.carbon700 : C.carbon950, 1).fillCircle(cx, 0, 22);
      g.lineStyle(1.5, estado === 'completada' ? C.verde : C.dorado500, estado === 'bloqueada' ? 0.35 : 1).strokeCircle(cx, 0, 22);
      const numeral = texto(this, cx, 0, estado === 'completada' ? '✓' : info.numeral, {
        size: 17,
        negrita: true,
        color: estado === 'completada' ? H.verde : estado === 'bloqueada' ? H.gris : H.dorado400,
        origen: [0.5, 0.5],
      });
      const xTexto = cx + 36;
      const titulo = texto(this, xTexto, -alto / 2 + 14, info.titulo, {
        size: 17,
        negrita: true,
        color: estado === 'bloqueada' ? H.gris : H.crema,
      });
      const lugar = texto(this, xTexto, -alto / 2 + 38, info.lugar, { size: 12.5, cursiva: true, color: H.gris });
      const chip = texto(this, xTexto, -alto / 2 + 60, ESTADOS[estado].texto, {
        size: 11.5,
        color: ESTADOS[estado].color,
        serif: false,
        negrita: true,
      });
      c.add([g, numeral, titulo, lugar, chip]);
      if (activa) {
        this.tweens.add({ targets: c, scale: { from: 1, to: 1.015 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    });

    // Progreso
    const completadas = partida.misiones.filter((m) => m.estado === 'completada').length;
    const yBarra = 120 + TOTAL_MISIONES * (alto + 10) + 14;
    const gb = this.add.graphics();
    rectRedondo(gb, 30, yBarra, ANCHO - 60, 8, { relleno: C.carbon700, radio: 4 });
    if (completadas > 0)
      rectRedondo(gb, 30, yBarra, ((ANCHO - 60) * completadas) / TOTAL_MISIONES, 8, { relleno: C.dorado500, radio: 4 });
    texto(this, ANCHO / 2, yBarra + 24, `Misiones completadas: ${completadas} / ${TOTAL_MISIONES}`, {
      size: 13,
      color: H.crema,
      origen: [0.5, 0.5],
      serif: false,
    });

    let pie = 'Abre el Cuaderno cuando quieras para revisar tus descartes.';
    if (partida.resuelta) pie = 'Caso resuelto. Puedes empezar una nueva partida desde el Cuaderno.';
    else if (puedeAcusar()) pie = 'Todas las pistas están sobre la mesa. Pulsa «Resolver el caso» cuando estés seguro.';
    this.aviso = texto(this, ANCHO / 2, yBarra + 54, pie, {
      size: 12.5,
      cursiva: true,
      color: puedeAcusar() ? H.dorado400 : H.gris,
      origen: [0.5, 0.5],
      align: 'center',
      ancho: ANCHO - 60,
    });

    // Solo se repinta si cambia algo visible aquí (no al marcar notas en el cuaderno).
    const firma = (p = obtener()) => `${p.misiones.map((m) => m.estado).join()}|${p.resuelta}`;
    const actual = firma(partida);
    const off = eventos.on('cambio', (p) => {
      if (this.scene.isActive() && firma(p) !== actual) this.scene.restart();
    });
    this.events.once('shutdown', off);
  }

  private tocar(i: number): void {
    const m = obtener().misiones[i];
    if (m.estado === 'disponible') {
      this.cameras.main.fadeOut(180, 20, 18, 20);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(MISIONES[i].escena));
    } else if (m.estado === 'descarte' || m.estado === 'completada') {
      busUi.emit('ver-pista', { mision: i });
    } else {
      this.aviso.setText('Esa misión sigue bloqueada: completa antes la anterior.');
      this.aviso.setColor(H.rojo);
    }
  }
}
