// Punto de entrada del juego: carga la partida, arranca Phaser y conecta los paneles DOM.

import { Game } from 'phaser';
import { crearConfig } from './config.ts';
import { cargarOCrear } from './core/estado.ts';
import { iniciarOverlay } from './overlay/overlay.ts';

export function arrancar(contenedor: HTMLElement): Game {
  cargarOCrear();
  iniciarOverlay();
  return new Game(crearConfig(contenedor));
}
