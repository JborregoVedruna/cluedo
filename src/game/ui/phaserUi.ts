// Utilidades de interfaz dentro de Phaser: colores, textos nítidos, botones y paneles táctiles.
// Todo el juego se maqueta en un espacio lógico de 400×720 (vertical, pensado para móvil);
// la cámara aplica ZOOM para que el lienzo tenga el doble de píxeles y se vea nítido.

import type { Scene } from 'phaser';

export const ANCHO = 400;
export const ALTO = 720;
export const ZOOM = 2;

export const C = {
  carbon950: 0x0b0a0b,
  carbon900: 0x141214,
  carbon800: 0x1e1b1e,
  carbon700: 0x2a262a,
  carbon600: 0x3a353a,
  burdeos900: 0x4a0a12,
  burdeos800: 0x6b0f1a,
  burdeos700: 0x8f1d2c,
  burdeos600: 0xb3263a,
  dorado600: 0xa3802f,
  dorado500: 0xc9a24a,
  dorado400: 0xe6c77a,
  crema: 0xefe6d2,
  papel: 0xe9dcc0,
  gris: 0x8a8288,
  verde: 0x4f9a6c,
  rojo: 0xd0435a,
};

export const H = {
  carbon900: '#141214',
  burdeos700: '#8f1d2c',
  dorado500: '#c9a24a',
  dorado400: '#e6c77a',
  crema: '#efe6d2',
  tinta: '#2a1a12',
  gris: '#a59ca3',
  verde: '#7cc79a',
  rojo: '#f07a8c',
};

export const SERIF = 'Georgia, "Times New Roman", serif';
export const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export interface OpcionesTexto {
  size?: number;
  color?: string;
  ancho?: number;
  align?: 'left' | 'center' | 'right';
  serif?: boolean;
  negrita?: boolean;
  cursiva?: boolean;
  origen?: [number, number];
  interlineado?: number;
  espaciado?: number;
}

export function texto(escena: Scene, x: number, y: number, contenido: string, o: OpcionesTexto = {}) {
  const estilo = [o.negrita ? 'bold' : '', o.cursiva ? 'italic' : ''].filter(Boolean).join(' ') || 'normal';
  const t = escena.add.text(x, y, contenido, {
    fontFamily: o.serif === false ? SANS : SERIF,
    fontSize: `${o.size ?? 16}px`,
    color: o.color ?? H.crema,
    align: o.align ?? 'left',
    fontStyle: estilo,
    lineSpacing: o.interlineado ?? 4,
    wordWrap: o.ancho ? { width: o.ancho, useAdvancedWrap: true } : undefined,
  });
  t.setResolution(ZOOM * 1.25);
  if (o.espaciado) t.setLetterSpacing(o.espaciado);
  if (o.origen) t.setOrigin(o.origen[0], o.origen[1]);
  return t;
}

export function prepararCamara(escena: Scene): void {
  const cam = escena.cameras.main;
  cam.setZoom(ZOOM);
  cam.centerOn(ANCHO / 2, ALTO / 2);
  cam.setBackgroundColor(H.carbon900);
  cam.fadeIn(220, 20, 18, 20);
}

/** Fondo atmosférico: carbón con un halo burdeos arriba y marco dorado fino. */
export function fondo(escena: Scene, tono: number = C.burdeos800): void {
  const g = escena.add.graphics();
  g.fillStyle(C.carbon900, 1).fillRect(0, 0, ANCHO, ALTO);
  for (let i = 0; i < 14; i++) {
    g.fillStyle(tono, 0.05).fillEllipse(ANCHO / 2, 40, 520 - i * 26, 360 - i * 20);
  }
  g.fillStyle(C.carbon950, 0.35).fillRect(0, ALTO - 120, ANCHO, 120);
  g.lineStyle(1, C.dorado500, 0.22).strokeRect(8, 8, ANCHO - 16, ALTO - 16);
}

export function rectRedondo(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  o: { relleno?: number; alfa?: number; borde?: number; alfaBorde?: number; grosor?: number; radio?: number } = {},
): void {
  const r = o.radio ?? 12;
  if (o.relleno !== undefined) g.fillStyle(o.relleno, o.alfa ?? 1).fillRoundedRect(x, y, w, h, r);
  if (o.borde !== undefined) g.lineStyle(o.grosor ?? 1.5, o.borde, o.alfaBorde ?? 1).strokeRoundedRect(x, y, w, h, r);
}

export type VarianteBoton = 'primario' | 'secundario' | 'fantasma';

export interface Boton {
  contenedor: Phaser.GameObjects.Container;
  habilitar(v: boolean): void;
  etiqueta(s: string): void;
}

export function boton(
  escena: Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  etiqueta: string,
  alPulsar: () => void,
  variante: VarianteBoton = 'primario',
  tamano = 16,
): Boton {
  const g = escena.add.graphics();
  const colorTexto = variante === 'primario' ? '#1a1206' : H.dorado400;
  const t = texto(escena, 0, 0, etiqueta, {
    size: tamano,
    negrita: true,
    serif: false,
    color: colorTexto,
    origen: [0.5, 0.5],
    align: 'center',
  });
  const c = escena.add.container(x, y, [g, t]);
  c.setSize(w, h);
  c.setInteractive({ useHandCursor: true });
  let activo = true;

  const pintar = (pulsado: boolean) => {
    g.clear();
    const x0 = -w / 2;
    const y0 = -h / 2;
    if (!activo) {
      rectRedondo(g, x0, y0, w, h, { relleno: C.carbon700, alfa: 0.7, borde: C.carbon600 });
      t.setColor(H.gris);
      return;
    }
    t.setColor(colorTexto);
    if (variante === 'primario') {
      rectRedondo(g, x0, y0, w, h, { relleno: pulsado ? C.dorado600 : C.dorado500, borde: C.dorado400 });
    } else if (variante === 'secundario') {
      rectRedondo(g, x0, y0, w, h, {
        relleno: pulsado ? C.burdeos700 : C.burdeos800,
        borde: C.dorado500,
        alfaBorde: 0.7,
      });
    } else {
      rectRedondo(g, x0, y0, w, h, {
        relleno: C.carbon800,
        alfa: pulsado ? 1 : 0.6,
        borde: C.dorado500,
        alfaBorde: 0.35,
      });
    }
  };
  pintar(false);

  c.on('pointerdown', () => activo && pintar(true));
  c.on('pointerout', () => pintar(false));
  c.on('pointerup', () => {
    if (!activo) return;
    pintar(false);
    alPulsar();
  });

  return {
    contenedor: c,
    habilitar(v: boolean) {
      activo = v;
      pintar(false);
    },
    etiqueta(s: string) {
      t.setText(s);
    },
  };
}

/** Contenedor táctil genérico (tarjetas). El fondo lo pinta quien lo usa. */
export function zonaTactil(
  escena: Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  alPulsar: () => void,
): Phaser.GameObjects.Container {
  const c = escena.add.container(x, y);
  c.setSize(w, h);
  c.setInteractive({ useHandCursor: true });
  c.on('pointerup', alPulsar);
  return c;
}

export function sacudir(escena: Scene, objetivos: object | object[]): void {
  escena.tweens.add({ targets: objetivos, x: '+=7', duration: 45, yoyo: true, repeat: 3 });
}
