// Las 15 misiones: una por cada lugar, una por cada arma y tres rondas de testimonios.

export type GrupoMision = 'lugar' | 'arma' | 'testimonio';

export interface InfoMision {
  numeral: string;
  titulo: string;
  /** Lugar o arma con la que está relacionada, o quién testifica. */
  referencia: string;
  grupo: GrupoMision;
  escena: string;
  instrucciones: string;
  /** Frase con la que se abre la pista que desbloquea. */
  introPista: string;
}

const datos: Omit<InfoMision, 'numeral' | 'escena'>[] = [
  // ---------- Una por lugar ----------
  {
    titulo: 'El guardarropa',
    referencia: 'Hall de entrada',
    grupo: 'lugar',
    instrucciones:
      'Seis objetos se quedaron en consigna. Toca un objeto y después al invitado que lo dejó. Las notas de la encargada te dirán cuál es de quién.',
    introPista: 'Con cada objeto en su percha, la encargada del guardarropa recuerda algo más de la noche.',
  },
  {
    titulo: 'La servilleta manchada',
    referencia: 'Barra',
    grupo: 'lugar',
    instrucciones:
      'Bajo el mostrador hay una servilleta con un mensaje cifrado a toda prisa. Averigua el desplazamiento, descífralo a mano y escribe las dos cosas.',
    introPista: 'El mensaje de la servilleta, por fin legible, lleva a un dato que lo cambia todo.',
  },
  {
    titulo: 'La nota rasgada',
    referencia: 'Pista de baile',
    grupo: 'lugar',
    instrucciones:
      'Junto a los altavoces aparece una nota de Puyana rota en diez trozos. Tócalos en el orden en que se leen para reconstruirla.',
    introPista: 'En el reverso de la nota reconstruida, Puyana dejó apuntado algo más.',
  },
  {
    titulo: 'El reflejo en la cristalera',
    referencia: 'Terraza',
    grupo: 'lugar',
    instrucciones:
      'Cada panel de la cristalera refleja una de las 6 luces de la pista. En cada fila, columna y bloque de 2×3 aparecen las 6 una sola vez. Completa los reflejos.',
    introPista: 'Con los reflejos completos, la cristalera muestra lo que pasó al final de la pasarela.',
  },
  {
    titulo: 'La llamada perdida',
    referencia: 'Baños',
    grupo: 'lugar',
    instrucciones:
      'El móvil de Puyana apareció en los baños. A las 3:39 llamó a alguien. El número usa exactamente las teclas con marca de dedo, ni una más, y cuadra con la pantalla.',
    introPista: 'El historial del móvil de Puyana guarda algo más que esa llamada cortada.',
  },
  {
    titulo: 'El registro del ascensor',
    referencia: 'Ascensor',
    grupo: 'lugar',
    instrucciones:
      'La estática ha borrado una parada del registro. Usa el sensor de peso para reconstruirla y averigua cuántas personas y cajas llegaron a la planta 27.',
    introPista: 'Con el registro ya reconstruido, el técnico del ascensor aporta un dato clave.',
  },
  // ---------- Una por arma ----------
  {
    titulo: 'Las cámaras de seguridad',
    referencia: 'Cordón de terciopelo',
    grupo: 'arma',
    instrucciones:
      'Seis fotogramas del hall con dos cifras borradas en cada hora. Los cordones solo se quitaron, nunca se volvieron a poner. Ordénalos del primero al último.',
    introPista: 'Con los fotogramas en orden, seguridad repasa la grabación completa.',
  },
  {
    titulo: 'El ticket de la barra',
    referencia: 'Botella de ginebra premium',
    grupo: 'arma',
    instrucciones:
      'El hielo derretido ha borrado parte de la cuenta. Usa los precios de la carta y las rondas que admiten los invitados para averiguar cuánto costó la línea borrada.',
    introPista: 'Con la cuenta cuadrada, el encargado de la barra revisa qué botellas salieron esa noche.',
  },
  {
    titulo: 'La sesión del DJ',
    referencia: 'Cable XLR de sonido',
    grupo: 'arma',
    instrucciones:
      'Ordena las canciones que sonaron antes del corte de luz, de la primera a la última. La sesión terminó justo a las 3:30:00. Usa la duración de cada tema y lo que cuentan los invitados.',
    introPista: 'Con la sesión reconstruida, el DJ por fin recuerda qué pasó con su equipo.',
  },
  {
    titulo: 'Los vasos sin dueño',
    referencia: 'Copa de cóctel envenenada',
    grupo: 'arma',
    instrucciones:
      'Seis copas abandonadas entre la pista y la barra. Empareja cada una con su dueño según el hielo, el cítrico, el carmín y la graduación.',
    introPista: 'Con cada copa identificada, el laboratorio improvisado analiza los restos.',
  },
  {
    titulo: 'La taquilla de limpieza',
    referencia: 'Barra metálica de toallero',
    grupo: 'arma',
    instrucciones:
      'La taquilla del personal de limpieza tiene un candado de tres dígitos. La combinación está apuntada en una tarjeta pegada en la puerta.',
    introPista: 'Dentro de la taquilla está el parte de incidencias de los baños.',
  },
  {
    titulo: 'La lista de reservados',
    referencia: 'Abridor de botellas de latón',
    grupo: 'arma',
    instrucciones:
      'Cinco sillones en la zona VIP, cada uno con su abridor de regalo. Cruza alergias, bebidas y deudas para saber quién se sentó en cada sillón.',
    introPista: 'Con el plano de mesas completo, la encargada de la zona VIP cuenta los abridores.',
  },
  // ---------- Testimonios ----------
  {
    titulo: 'El reloj de Puyana',
    referencia: 'Testimonio de los invitados',
    grupo: 'testimonio',
    instrucciones:
      'El reloj de Puyana se paró a las 3:50. Seis invitados cuentan qué pasó y cuándo. Ordena los sucesos del primero al último.',
    introPista:
      'Con la cronología ordenada, los invitados firman una declaración. Crúzala con tus descartes y con los otros testimonios.',
  },
  {
    titulo: 'El contenedor',
    referencia: 'Testimonio de seguridad',
    grupo: 'testimonio',
    instrucciones: 'Junto al cuerpo, seguridad encontró seis restos. Toca un resto y después el sitio del hotel del que salió.',
    introPista:
      'Con los restos identificados, el jefe de seguridad del hotel firma su declaración. Crúzala con tus descartes y con los otros testimonios.',
  },
  {
    titulo: 'El careo de los camareros',
    referencia: 'Testimonio de los camareros',
    grupo: 'testimonio',
    instrucciones: 'Tres camareros, frente a frente. Exactamente uno miente. Tócalo y desenmascáralo.',
    introPista:
      'Desenmascarado el mentiroso, los dos camareros sinceros firman su declaración. Crúzala con tus descartes y con los otros testimonios.',
  },
];

export const MISIONES: InfoMision[] = datos.map((d, i) => ({ ...d, numeral: String(i + 1), escena: `M${i}` }));

/** Índices de las misiones que terminan con un descarte (las 12 de lugares y armas). */
export const INDICES_DESCARTE = MISIONES.map((m, i) => (m.grupo !== 'testimonio' ? i : -1)).filter((i) => i >= 0);
/** Índices de los testimonios (afirmaciones condicionales). */
export const INDICES_TESTIMONIO = MISIONES.map((m, i) => (m.grupo === 'testimonio' ? i : -1)).filter((i) => i >= 0);

export const NOMBRE_GRUPO: Record<GrupoMision, string> = {
  lugar: 'Un lugar',
  arma: 'Un arma',
  testimonio: 'Testimonios',
};
