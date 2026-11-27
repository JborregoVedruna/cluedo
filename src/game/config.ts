import { AUTO, Scale } from 'phaser';
import { generarAscensor } from './puzzles/ascensor.ts';
import { generarCamaras } from './puzzles/camaras.ts';
import { generarCandado } from './puzzles/candado.ts';
import { generarContenedor } from './puzzles/contenedor.ts';
import { generarDj } from './puzzles/dj.ts';
import { generarGuardarropa } from './puzzles/guardarropa.ts';
import { generarReloj } from './puzzles/reloj.ts';
import { generarReservados } from './puzzles/reservados.ts';
import { generarTicket } from './puzzles/ticket.ts';
import { generarVasos } from './puzzles/vasos.ts';
import { CifradoScene } from './scenes/CifradoScene.ts';
import { DialesScene } from './scenes/DialesScene.ts';
import { CareoScene, LlamadaScene } from './scenes/ElegirScene.ts';
import { CristaleraScene } from './scenes/CristaleraScene.ts';
import { EmparejarScene } from './scenes/EmparejarScene.ts';
import { MapaScene } from './scenes/MapaScene.ts';
import { NotaScene } from './scenes/NotaScene.ts';
import { OrdenarScene } from './scenes/OrdenarScene.ts';
import { ALTO, ANCHO, ZOOM } from './ui/phaserUi.ts';

/** Una escena por misión, en el mismo orden que MISIONES. */
function escenasDeMisiones() {
  return [
    // Lugares
    new EmparejarScene(0, generarGuardarropa), // Hall de entrada
    new CifradoScene(1), // Barra
    new NotaScene(2), // Pista de baile
    new CristaleraScene(3), // Terraza
    new LlamadaScene(4), // Baños
    new DialesScene(5, generarAscensor), // Ascensor
    // Armas
    new OrdenarScene(6, generarCamaras), // Cordón de terciopelo
    new DialesScene(7, generarTicket), // Botella de ginebra
    new OrdenarScene(8, generarDj), // Cable XLR
    new EmparejarScene(9, generarVasos), // Copa envenenada
    new DialesScene(10, generarCandado), // Barra de toallero
    new EmparejarScene(11, generarReservados), // Abridor de latón
    // Testimonios
    new OrdenarScene(12, generarReloj), // Invitados
    new EmparejarScene(13, generarContenedor), // Seguridad
    new CareoScene(14), // Camareros
  ];
}

export function crearConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: AUTO,
    parent,
    width: ANCHO * ZOOM,
    height: ALTO * ZOOM,
    backgroundColor: '#0e0a1c',
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
    },
    render: { antialias: true, roundPixels: false },
    // windowEvents: false evita que un toque fuera del lienzo (en un panel) llegue al juego.
    input: { activePointers: 2, windowEvents: false },
    scene: [MapaScene, ...escenasDeMisiones()],
  };
}
