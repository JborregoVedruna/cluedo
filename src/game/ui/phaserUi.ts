// Utilidades de interfaz dentro de Phaser: colores, textos nítidos, botones y paneles táctiles.
// Todo el juego se maqueta en un espacio lógico de 400×720 (vertical, pensado para móvil);
// la cámara aplica ZOOM para que el lienzo tenga el doble de píxeles y se vea nítido.

import type { Scene } from 'phaser';

export const ANCHO = 400;
export const ALTO = 720;
export const ZOOM = 2;

export const C = {
  noche950: 0x07050f,
  noche900: 0x0e0a1c,
  noche800: 0x171230,
  noche700: 0x241c45,
  noche600: 0x35295f,
  fucsia900: 0x4a0b3a,
  fucsia800: 0x7a0f5c,
  fucsia700: 0xb0127f,
  fucsia600: 0xff2e93,
  champan600: 0xd48f12,
  champan500: 0xf6b93b,
  champan400: 0xffd76e,
  cian500: 0x22d3ee,
  cian400: 0x5ef2ff,
  crema: 0xf4eefe,
  papel: 0xf3ecdc,
  gris: 0xb9b0d8,
  verde: 0x3ee07a,
  rojo: 0xff4d6d,
};

export const H = {
  noche900: '#0e0a1c',
  fucsia700: '#b0127f',
  fucsia600: '#ff2e93',
  champan500: '#f6b93b',
  champan400: '#ffd76e',
  cian400: '#5ef2ff',
  crema: '#f4eefe',
  tinta: '#1d1530',
  gris: '#d6cff0',
  verde: '#6ff0a0',
  rojo: '#ff8098',
};

/** Fuente principal (geométrica y festiva). */
export const SERIF = 'Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", system-ui, sans-serif';
export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace';
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
  mono?: boolean;
}

export function texto(escena: Scene, x: number, y: number, contenido: string, o: OpcionesTexto = {}) {
  const estilo = [o.negrita ? 'bold' : '', o.cursiva ? 'italic' : ''].filter(Boolean).join(' ') || 'normal';
  const t = escena.add.text(x, y, contenido, {
    fontFamily: o.mono ? MONO : o.serif === false ? SANS : SERIF,
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
  cam.setBackgroundColor(H.noche900);
  cam.fadeIn(220, 20, 18, 20);
}

/** Fondo de discoteca: noche con focos de colores y marco de neón. */
export function fondo(escena: Scene, tono: number = C.fucsia700): void {
  const g = escena.add.graphics();
  g.fillStyle(C.noche900, 1).fillRect(0, 0, ANCHO, ALTO);
  for (let i = 0; i < 14; i++) g.fillStyle(tono, 0.045).fillEllipse(ANCHO / 2, 30, 520 - i * 26, 360 - i * 20);
  for (let i = 0; i < 10; i++) g.fillStyle(C.cian500, 0.03).fillEllipse(ANCHO + 20, ALTO - 60, 360 - i * 30, 300 - i * 26);
  // Haces de luz
  const haces: [number, number][] = [
    [60, C.cian500],
    [200, C.champan400],
    [340, C.fucsia600],
  ];
  for (const [x, color] of haces) {
    g.fillStyle(color, 0.05);
    g.fillTriangle(x, -10, x - 120, ALTO, x + 120, ALTO);
  }
  // Puntitos de bola de discoteca
  for (let i = 0; i < 40; i++) {
    const x = (i * 97) % ANCHO;
    const y = (i * 53) % (ALTO - 140) + 20;
    g.fillStyle(i % 3 === 0 ? C.cian400 : i % 3 === 1 ? C.fucsia600 : C.champan400, 0.18).fillCircle(x, y, 1.2);
  }
  g.fillStyle(C.noche950, 0.4).fillRect(0, ALTO - 120, ANCHO, 120);
  g.lineStyle(1, C.fucsia600, 0.35).strokeRect(8, 8, ANCHO - 16, ALTO - 16);
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
  const colorTexto = variante === 'primario' ? '#1d1530' : H.champan400;
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
      rectRedondo(g, x0, y0, w, h, { relleno: C.noche700, alfa: 0.7, borde: C.noche600 });
      t.setColor(H.gris);
      return;
    }
    t.setColor(colorTexto);
    if (variante === 'primario') {
      rectRedondo(g, x0, y0, w, h, { relleno: pulsado ? C.champan600 : C.champan500, borde: C.champan400 });
    } else if (variante === 'secundario') {
      rectRedondo(g, x0, y0, w, h, {
        relleno: pulsado ? C.fucsia700 : C.fucsia800,
        borde: C.fucsia600,
        alfaBorde: 0.7,
      });
    } else {
      rectRedondo(g, x0, y0, w, h, {
        relleno: C.noche800,
        alfa: pulsado ? 1 : 0.6,
        borde: C.cian500,
        alfaBorde: 0.45,
      });
    }
  };
  pintar(false);

  let pulsado = false;
  c.on('pointerdown', () => {
    if (!activo) return;
    pulsado = true;
    pintar(true);
  });
  c.on('pointerout', () => {
    pulsado = false;
    pintar(false);
  });
  c.on('pointerup', () => {
    if (!activo || !pulsado) return;
    pulsado = false;
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
  // Solo cuenta si el dedo bajó y subió sobre el mismo objeto (evita pulsaciones fantasma tras cerrar un panel).
  let pulsado = false;
  c.on('pointerdown', () => (pulsado = true));
  c.on('pointerout', () => (pulsado = false));
  c.on('pointerup', () => {
    if (!pulsado) return;
    pulsado = false;
    alPulsar();
  });
  return c;
}

export function sacudir(escena: Scene, objetivos: object | object[]): void {
  escena.tweens.add({ targets: objetivos, x: '+=7', duration: 45, yoyo: true, repeat: 3 });
}
