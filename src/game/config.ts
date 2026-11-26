import { AUTO, Scale } from 'phaser';
import { ALTO, ANCHO, ZOOM } from './ui/phaserUi.ts';
import { MapaScene } from './scenes/MapaScene.ts';
import { RelojScene } from './scenes/RelojScene.ts';
import { CandadoScene } from './scenes/CandadoScene.ts';
import { InventarioScene } from './scenes/InventarioScene.ts';
import { NotaScene } from './scenes/NotaScene.ts';
import { CareoScene } from './scenes/CareoScene.ts';

export function crearConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: AUTO,
    parent,
    width: ANCHO * ZOOM,
    height: ALTO * ZOOM,
    backgroundColor: '#141214',
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
    },
    render: { antialias: true, roundPixels: false },
    input: { activePointers: 2 },
    scene: [MapaScene, RelojScene, CandadoScene, InventarioScene, NotaScene, CareoScene],
  };
}
