import type { Categoria } from '../../data/caso.ts';

export type Seleccion = Record<Categoria, string>;

export type EstadoMision = 'bloqueada' | 'disponible' | 'descarte' | 'completada';

export type Marca = 'ninguna' | 'sospecha' | 'principal';

export interface Pista {
  mision: number;
  titulo: string;
  parrafos: string[];
  /** Afirmaciones condicionales (solo en el careo final). */
  condicionales?: string[];
  /** Elementos que la pista exculpa expresamente. */
  senalados?: Partial<Seleccion>;
}

export interface RegistroMision {
  estado: EstadoMision;
  fallos: number;
  pista?: Pista;
  descarte?: Seleccion;
}

export interface Partida {
  version: 1;
  semilla: number;
  solucion: Seleccion;
  descartados: Record<Categoria, string[]>;
  misiones: RegistroMision[];
  marcas: Record<string, Marca>;
  notasLibres: string;
  acusaciones: number;
  resuelta: boolean;
}
