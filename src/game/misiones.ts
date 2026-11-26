// Ficha de cada una de las 5 misiones.

export interface InfoMision {
  numeral: string;
  titulo: string;
  lugar: string;
  escena: string;
  instrucciones: string;
  /** Frase con la que se abre la pista que desbloquea. */
  introPista: string;
}

export const MISIONES: InfoMision[] = [
  {
    numeral: 'I',
    titulo: 'El reloj roto',
    lugar: 'Despacho de Puyana',
    escena: 'Reloj',
    instrucciones:
      'El reloj de Puyana se detuvo con un golpe. Ordena los cuatro sucesos de la noche del primero al último tocando cada testimonio.',
    introPista: 'Con los testimonios ordenados, la cronología de la noche ya no deja huecos.',
  },
  {
    numeral: 'II',
    titulo: 'La caja fuerte',
    lugar: 'Invernadero',
    escena: 'Candado',
    instrucciones:
      'Bajo la orquídea negra hay una caja fuerte con un candado de tres dígitos. Puyana dejó las reglas de la combinación en una tarjeta.',
    introPista: 'Dentro de la caja fuerte hay un sobre con notas de Puyana, escritas de su puño y letra horas antes de morir.',
  },
  {
    numeral: 'III',
    titulo: 'El inventario',
    lugar: 'Cocina y Bodega',
    escena: 'Inventario',
    instrucciones:
      'Tres muestras, tres procedencias. Toca una muestra y después el lugar del que salió. Los testimonios te dirán cuál es cuál.',
    introPista: 'Con las muestras emparejadas, el informe del laboratorio improvisado es concluyente.',
  },
  {
    numeral: 'IV',
    titulo: 'La nota rasgada',
    lugar: 'Biblioteca',
    escena: 'Nota',
    instrucciones:
      'Puyana rompió una nota en cinco trozos. Tócalos en el orden correcto para reconstruir el mensaje.',
    introPista: 'Reconstruida la nota, encuentras escrito en el reverso un último apunte de Puyana.',
  },
  {
    numeral: 'V',
    titulo: 'El careo final',
    lugar: 'Salón de baile',
    escena: 'Careo',
    instrucciones:
      'Tres testigos, frente a frente. Exactamente uno de ellos miente. Tócalo y desenmascáralo.',
    introPista:
      'Desenmascarado el mentiroso, los dos testigos sinceros firman una declaración conjunta. Crúzala con tus descartes: solo admite una explicación.',
  },
];
