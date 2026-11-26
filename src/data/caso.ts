// Los 18 elementos del caso "¿Quién mató a Puyana?".
// Este archivo alimenta tanto las páginas de presentación como la lógica del juego.

export type Categoria = 'sospechoso' | 'arma' | 'lugar';

export const CATEGORIAS: readonly Categoria[] = ['sospechoso', 'arma', 'lugar'];

export const NOMBRE_CATEGORIA: Record<Categoria, { singular: string; plural: string; otro: string }> = {
  sospechoso: { singular: 'sospechoso', plural: 'Sospechosos', otro: 'otro sospechoso' },
  arma: { singular: 'arma', plural: 'Armas', otro: 'otra arma' },
  lugar: { singular: 'lugar', plural: 'Lugares', otro: 'otro lugar' },
};

export interface DatoFicha {
  etiqueta: string;
  valor: string;
}

export interface ElementoBase {
  id: string;
  categoria: Categoria;
  /** Nombre corto tal y como aparece en el juego. */
  nombre: string;
  /** Inicial o monograma para la composición visual. */
  monograma: string;
  /** Color de iluminación de su escena (hex). */
  tono: string;
  lema: string;
  ficha: DatoFicha[];
  relacion: string;
  /** Frase (en minúscula inicial) que lo exculpa en una pista. Solo se usa si es inocente. */
  pistaInocente: string;
  /** Fragmento narrativo para la pantalla de victoria. */
  comoFue: string;
}

export interface Sospechoso extends ElementoBase {
  categoria: 'sospechoso';
  nombreCompleto: string;
  motivo: string;
  coartada: string;
  secreto: string;
}

export interface Arma extends ElementoBase {
  categoria: 'arma';
  conArticulo: string;
  descripcion: string;
  forense: string;
}

export interface Lugar extends ElementoBase {
  categoria: 'lugar';
  conArticulo: string;
  enLugar: string;
  descripcion: string;
  detalle: string;
}

export type Elemento = Sospechoso | Arma | Lugar;

export const SOSPECHOSOS: Sospechoso[] = [
  {
    id: 'condesa-elena',
    categoria: 'sospechoso',
    nombre: 'Condesa Elena',
    nombreCompleto: 'Elena Valdés-Orsini, condesa de Altamira',
    monograma: 'E',
    tono: '#8f1d2c',
    lema: 'La nobleza también tiene deudas.',
    ficha: [
      { etiqueta: 'Edad', valor: '54 años' },
      { etiqueta: 'Ocupación', valor: 'Aristócrata sin fortuna' },
      { etiqueta: 'Vínculo', valor: 'Antigua prometida de Puyana' },
      { etiqueta: 'Vista por última vez', valor: 'Galería de retratos, 23:10' },
    ],
    relacion:
      'Hace treinta años estuvo a punto de casarse con Aurelio Puyana. Él no se lo perdonó nunca: durante décadas compró en secreto, pieza a pieza, las joyas que la familia de Elena tuvo que empeñar.',
    motivo:
      'Puyana guardaba los recibos de cada joya vendida. Había prometido mostrarlos esta noche, delante de todos, y con ellos la ruina del apellido Valdés-Orsini.',
    coartada:
      'Asegura que pasó la noche en la galería de retratos, frente al cuadro de su abuela que Puyana le arrebató en una subasta.',
    secreto: 'Lleva un año firmando préstamos con un aval que no existe.',
    pistaInocente:
      'dos criados vieron a la Condesa Elena inmóvil frente al retrato de su abuela durante todo el apagón; no se movió de la galería ni un instante',
    comoFue:
      'La Condesa Elena no iba a consentir que Puyana subastara su apellido delante de todos. Cuando él le enseñó la carpeta con los recibos, comprendió que solo había una forma de que no viera la luz.',
  },
  {
    id: 'dr-vance',
    categoria: 'sospechoso',
    nombre: 'Dr. Vance',
    nombreCompleto: 'Dr. Julian Vance, médico personal',
    monograma: 'V',
    tono: '#2f6f6a',
    lema: 'Conoce cada latido de Puyana. También el último.',
    ficha: [
      { etiqueta: 'Edad', valor: '47 años' },
      { etiqueta: 'Ocupación', valor: 'Médico de la familia' },
      { etiqueta: 'Vínculo', valor: 'Doce años a su servicio' },
      { etiqueta: 'Vista por última vez', valor: 'Ala este, 23:25' },
    ],
    relacion:
      'Atendía a Puyana dos veces por semana y era el único que entraba en su dormitorio sin llamar. Puyana decía que confiaba en él más que en su propia sangre.',
    motivo:
      'Puyana había descubierto que Vance le recetaba sedantes de más para mantenerlo dócil, y pensaba retirarlo de su testamento a la mañana siguiente.',
    coartada: 'Dice que estuvo en el ala este curando a un camarero que se cortó con una botella.',
    secreto: 'Su título de medicina se lo compró a una universidad que ya no existe.',
    pistaInocente:
      'el Dr. Vance estuvo cosiendo la mano de un camarero en el ala este; el vendaje lleva anotada la hora, y el camarero no le perdió de vista',
    comoFue:
      'El Dr. Vance sabía que al amanecer Puyana lo echaría de la casa y del testamento. Doce años de paciencia no podían terminar así, y nadie conocía mejor que él los puntos débiles de aquel cuerpo.',
  },
  {
    id: 'inspector-moreau',
    categoria: 'sospechoso',
    nombre: 'Inspector Moreau',
    nombreCompleto: 'Lucien Moreau, inspector de la policía judicial',
    monograma: 'M',
    tono: '#3b4f7a',
    lema: 'El hombre de la ley, invitado a una casa sin ley.',
    ficha: [
      { etiqueta: 'Edad', valor: '61 años' },
      { etiqueta: 'Ocupación', valor: 'Inspector en activo' },
      { etiqueta: 'Vínculo', valor: 'Viejo amigo y deudor' },
      { etiqueta: 'Visto por última vez', valor: 'Terraza norte, 23:38' },
    ],
    relacion:
      'Moreau cerró hace veinte años la investigación que dejó a Puyana limpio y millonario. Desde entonces cenaban juntos cada noviembre.',
    motivo:
      'Puyana conservaba la prueba de que aquel caso se archivó a cambio de dinero. Una sola llamada suya bastaba para acabar con la carrera de Moreau.',
    coartada: 'Afirma que, en cuanto se fue la luz, salió a la terraza para avisar a la comisaría.',
    secreto: 'La comisaría ya le había abierto un expediente interno.',
    pistaInocente:
      'el registro de la centralita demuestra que el Inspector Moreau estuvo al teléfono con la comisaría durante todo el apagón',
    comoFue:
      'El Inspector Moreau llevaba veinte años temiendo una llamada. Esta noche Puyana le dijo que la haría, y Moreau decidió que el caso más viejo de su carrera tenía que cerrarse de una vez.',
  },
  {
    id: 'lady-clara',
    categoria: 'sospechoso',
    nombre: 'Lady Clara',
    nombreCompleto: 'Lady Clara Ashford, ahijada de Puyana',
    monograma: 'C',
    tono: '#7a3b6b',
    lema: 'Sonríe como una heredera. Piensa como una jugadora.',
    ficha: [
      { etiqueta: 'Edad', valor: '26 años' },
      { etiqueta: 'Ocupación', valor: 'Pianista y heredera' },
      { etiqueta: 'Vínculo', valor: 'Ahijada y heredera principal' },
      { etiqueta: 'Vista por última vez', valor: 'Junto al piano, 23:35' },
    ],
    relacion:
      'Puyana la crio como a una hija tras la muerte de sus padres. Le pagó los estudios en Londres y le dejó claro que algún día la mansión sería suya.',
    motivo:
      'Puyana se oponía a su boda secreta con un músico sin un céntimo y había amenazado con desheredarla si no la anulaba antes de fin de mes.',
    coartada: 'Dice que se sentó al piano del salón para calmar a los invitados cuando se fue la luz.',
    secreto: 'Ya está casada. Desde hace tres meses.',
    pistaInocente:
      'veinte invitados escucharon a Lady Clara tocar el piano sin una sola pausa mientras duró el apagón',
    comoFue:
      'Lady Clara entendió esta noche que Puyana hablaba en serio: o renunciaba a su marido o lo perdía todo. Eligió no perder nada.',
  },
  {
    id: 'chef-mateo',
    categoria: 'sospechoso',
    nombre: 'Chef Mateo',
    nombreCompleto: 'Mateo Ríos, jefe de cocina',
    monograma: 'R',
    tono: '#9a5a1f',
    lema: 'Quince años cocinando para un hombre que nunca dijo gracias.',
    ficha: [
      { etiqueta: 'Edad', valor: '39 años' },
      { etiqueta: 'Ocupación', valor: 'Jefe de cocina de la mansión' },
      { etiqueta: 'Vínculo', valor: 'Empleado y socio frustrado' },
      { etiqueta: 'Visto por última vez', valor: 'Pasillo de servicio, 23:20' },
    ],
    relacion:
      'Puyana le prometió durante años financiar su propio restaurante. Esa misma tarde le anunció que se quedaba con sus recetas y que el restaurante lo abriría otro.',
    motivo: 'Quince años de trabajo robados en una sola frase, y un contrato que le impedía cocinar para nadie más.',
    coartada: 'Jura que no salió de los fogones: un soufflé no espera a nadie.',
    secreto: 'Ha vendido en secreto recetas de la casa a un hotel de la capital.',
    pistaInocente:
      'el soufflé del Chef Mateo subió perfecto a las 23:45; nadie que abandone la cocina lo consigue, y dos pinches juran que no se apartó del horno',
    comoFue:
      'El Chef Mateo llevaba toda la tarde mordiéndose la rabia. Cuando Puyana bajó a burlarse de él una última vez, quince años de humillaciones se cobraron su precio.',
  },
  {
    id: 'capitan-sterling',
    categoria: 'sospechoso',
    nombre: 'Capitán Sterling',
    nombreCompleto: 'Arthur Sterling, capitán de la marina mercante',
    monograma: 'S',
    tono: '#1f5f8a',
    lema: 'Ha sobrevivido a tres naufragios. A Puyana, quizá no.',
    ficha: [
      { etiqueta: 'Edad', valor: '58 años' },
      { etiqueta: 'Ocupación', valor: 'Capitán retirado' },
      { etiqueta: 'Vínculo', valor: 'Socio en la naviera Puyana' },
      { etiqueta: 'Visto por última vez', valor: 'Embarcadero, 23:15' },
    ],
    relacion:
      'Fueron socios en una naviera durante quince años. Juntos hundieron un viejo carguero asegurado por el triple de su valor, y juntos cobraron.',
    motivo:
      'Puyana, enfermo y con ganas de limpiar su conciencia, iba a confesar el fraude del carguero. Sterling iría a la cárcel; Puyana, probablemente, no.',
    coartada: 'Dice que bajó al embarcadero a vigilar su yate por la tormenta y que allí siguió hasta medianoche.',
    secreto: 'Hubo un marinero a bordo del carguero aquella noche.',
    pistaInocente:
      'el guarda del embarcadero ayudó al Capitán Sterling a amarrar su yate bajo la lluvia justo a la hora del crimen; volvieron los dos calados hasta los huesos',
    comoFue:
      'El Capitán Sterling no estaba dispuesto a hundirse con el barco de otro. Si Puyana quería confesar, tendría que hacerlo ante alguien que no fuera un juez.',
  },
];

export const ARMAS: Arma[] = [
  {
    id: 'daga-antigua',
    categoria: 'arma',
    nombre: 'Daga antigua',
    conArticulo: 'la daga antigua',
    monograma: 'I',
    tono: '#a3802f',
    lema: 'Cuatro siglos esperando una última herida.',
    ficha: [
      { etiqueta: 'Origen', valor: 'Toledo, siglo XVI' },
      { etiqueta: 'Longitud', valor: '31 cm' },
      { etiqueta: 'Ubicación habitual', valor: 'Vitrina del Despacho' },
      { etiqueta: 'Acceso', valor: 'Cualquiera con la llave de la vitrina' },
    ],
    descripcion:
      'Hoja estrecha de acero con empuñadura de plata y un rubí agrietado en el pomo. Puyana la enseñaba a cada invitado como la joya de su colección.',
    relacion: 'La compró en la misma subasta en la que humilló a media aristocracia. Decía que traía suerte a quien la tenía.',
    forense: 'Una hoja así deja heridas estrechas y profundas, y apenas mancha: el agresor puede salir limpio.',
    pistaInocente:
      'la daga antigua sigue en su vitrina: el polvo del terciopelo dibuja su silueta intacta y el cristal no se ha abierto en meses',
    comoFue:
      'El arma fue la daga antigua, descolgada de su vitrina con guantes de gala: una sola puñalada, precisa, que apenas dejó rastro en la alfombra.',
  },
  {
    id: 'candelabro-plata',
    categoria: 'arma',
    nombre: 'Candelabro de plata',
    conArticulo: 'el candelabro de plata',
    monograma: 'II',
    tono: '#9aa3ad',
    lema: 'Iluminó la cena. Después, apagó una vida.',
    ficha: [
      { etiqueta: 'Material', valor: 'Plata maciza de ley' },
      { etiqueta: 'Peso', valor: '3,4 kg' },
      { etiqueta: 'Ubicación habitual', valor: 'Mesa del comedor' },
      { etiqueta: 'Acceso', valor: 'Todo el servicio y los invitados' },
    ],
    descripcion: 'Cinco brazos rematados en hojas de acanto. Es tan pesado que el servicio lo mueve entre dos personas.',
    relacion: 'Regalo de bodas que Puyana nunca llegó a usar en su propia boda. Lo encendía solo en las grandes ocasiones.',
    forense: 'Un golpe con un objeto de ese peso fractura el cráneo al instante. La cera derretida suele delatar el movimiento.',
    pistaInocente:
      'el candelabro de plata estuvo encendido en la mesa del comedor toda la velada; la cera derretida forma un charco continuo, sin un solo corte',
    comoFue:
      'El arma fue el candelabro de plata: un único golpe en la penumbra del apagón, y la cera caliente borrando las huellas sobre el metal.',
  },
  {
    id: 'veneno-copa',
    categoria: 'arma',
    nombre: 'Veneno en copa',
    conArticulo: 'el veneno en copa',
    monograma: 'III',
    tono: '#4f7a3b',
    lema: 'Un brindis por los viejos tiempos. El último.',
    ficha: [
      { etiqueta: 'Sustancia', valor: 'Alcaloide sin olor' },
      { etiqueta: 'Dosis letal', valor: 'Menos de diez gotas' },
      { etiqueta: 'Recipiente', valor: 'Copa de coñac de Puyana' },
      { etiqueta: 'Acceso', valor: 'Quien sirviera o rellenara su copa' },
    ],
    descripcion:
      'La copa tallada de la que Puyana bebía siempre, y de la que nadie más tenía permiso para beber. Esta noche se rellenó cuatro veces.',
    relacion: 'Puyana presumía de no haber cambiado nunca de copa ni de coñac. Era su costumbre más previsible.',
    forense: 'Un alcaloide así actúa en minutos y se confunde con un fallo cardíaco si nadie analiza los restos.',
    pistaInocente:
      'el análisis de la copa de Puyana y de la botella sale limpio: ni rastro de tóxicos en nada de lo que bebió esa noche',
    comoFue:
      'El arma fue el veneno en copa: unas gotas en el coñac de Puyana, que brindó sin saber que se estaba despidiendo.',
  },
  {
    id: 'llave-inglesa',
    categoria: 'arma',
    nombre: 'Llave inglesa',
    conArticulo: 'la llave inglesa',
    monograma: 'IV',
    tono: '#6b6f73',
    lema: 'Una herramienta vulgar en una casa demasiado elegante.',
    ficha: [
      { etiqueta: 'Material', valor: 'Acero forjado' },
      { etiqueta: 'Longitud', valor: '38 cm' },
      { etiqueta: 'Ubicación habitual', valor: 'Caja de herramientas del sótano' },
      { etiqueta: 'Acceso', valor: 'Personal de mantenimiento' },
    ],
    descripcion:
      'Una llave ajustable, grasienta, con las iniciales del antiguo jardinero grabadas a punta de navaja en el mango.',
    relacion: 'Nadie recuerda que Puyana la tocara jamás. Y precisamente por eso nadie la buscaría.',
    forense: 'Deja contusiones irregulares y restos de grasa mineral en la ropa de la víctima.',
    pistaInocente:
      'la llave inglesa no ha salido de la caja de herramientas del sótano: el candado de la caja está oxidado y sigue cerrado',
    comoFue:
      'El arma fue la llave inglesa, subida del sótano envuelta en un trapo: un objeto que nadie habría relacionado con una gala.',
  },
  {
    id: 'carta-incriminatoria',
    categoria: 'arma',
    nombre: 'Carta incriminatoria',
    conArticulo: 'la carta incriminatoria',
    monograma: 'V',
    tono: '#b0702a',
    lema: 'Algunas palabras matan. Esta, literalmente.',
    ficha: [
      { etiqueta: 'Formato', valor: 'Sobre de lino con lacre rojo' },
      { etiqueta: 'Remitente', valor: 'Sin firmar' },
      { etiqueta: 'Ubicación habitual', valor: 'Bandeja del correo' },
      { etiqueta: 'Peculiaridad', valor: 'Lacre de textura extraña' },
    ],
    descripcion:
      'Un sobre que llegó a mediodía con la inscripción «Para leer a solas». Contenía, supuestamente, pruebas contra uno de los invitados.',
    relacion: 'Puyana coleccionaba secretos ajenos como otros coleccionan sellos. Ninguna carta así se quedaba sin abrir.',
    forense: 'Un lacre mezclado con un tóxico de contacto penetra por la piel de los dedos en pocos minutos.',
    pistaInocente:
      'la carta incriminatoria nunca llegó a manos de Puyana: apareció sin abrir en la bandeja del correo, con el lacre intacto',
    comoFue:
      'El arma fue la carta incriminatoria: su lacre estaba impregnado de un tóxico de contacto. Puyana la abrió con los dedos, como siempre, y leyó su propia sentencia.',
  },
  {
    id: 'cuerda-seda',
    categoria: 'arma',
    nombre: 'Cuerda de seda',
    conArticulo: 'la cuerda de seda',
    monograma: 'VI',
    tono: '#8f2b4f',
    lema: 'Suave al tacto. Implacable al cerrarse.',
    ficha: [
      { etiqueta: 'Material', valor: 'Seda trenzada' },
      { etiqueta: 'Longitud', valor: '1,8 m' },
      { etiqueta: 'Ubicación habitual', valor: 'Cortinas del Salón de baile' },
      { etiqueta: 'Acceso', valor: 'Cualquiera que pasara por el salón' },
    ],
    descripcion: 'Un cordón granate con borlas doradas que recoge las cortinas de terciopelo del Salón de baile.',
    relacion: 'Puyana hizo traer la seda de Lyon para la gala. Quería que todo, hasta el último detalle, fuera perfecto.',
    forense: 'La seda apenas deja marcas visibles si se usa con un pañuelo debajo; hay que buscarlas con lupa.',
    pistaInocente:
      'la cuerda de seda sigue anudada a las cortinas del salón; el nudo original del tapicero está cubierto de polvo y nadie lo ha deshecho',
    comoFue:
      'El arma fue la cuerda de seda, arrancada de las cortinas durante el apagón: silenciosa, rápida y devuelta a su sitio antes de que volviera la luz.',
  },
];

export const LUGARES: Lugar[] = [
  {
    id: 'biblioteca',
    categoria: 'lugar',
    nombre: 'Biblioteca',
    conArticulo: 'la Biblioteca',
    enLugar: 'en la Biblioteca',
    monograma: 'B',
    tono: '#5a3a22',
    lema: 'Doce mil libros y ni un solo testigo.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Primera, ala oeste' },
      { etiqueta: 'Accesos', valor: 'Puerta de roble y pasadizo tras la estantería' },
      { etiqueta: 'Iluminación', valor: 'Lámparas de gas' },
      { etiqueta: 'Ambiente', valor: 'Olor a cuero y ceniza' },
    ],
    descripcion: 'Dos pisos de estanterías unidos por una escalera de caracol. Las alfombras gruesas se tragan cualquier paso.',
    relacion: 'Era el refugio de Puyana. Allí escribía sus cartas, y allí guardaba lo que no quería que nadie leyera.',
    detalle: 'Un tomo de derecho marítimo está colocado del revés en el estante más alto.',
    pistaInocente:
      'la Biblioteca permaneció cerrada toda la noche: la humedad de la tormenta hinchó su puerta de roble y nadie logró abrirla hasta el amanecer',
    comoFue: 'Todo ocurrió en la Biblioteca, entre estanterías que ahogaron cualquier grito.',
  },
  {
    id: 'invernadero',
    categoria: 'lugar',
    nombre: 'Invernadero',
    conArticulo: 'el Invernadero',
    enLugar: 'en el Invernadero',
    monograma: 'I',
    tono: '#2f6b45',
    lema: 'Orquídeas, cristal y una caja fuerte que no debería estar ahí.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Baja, jardín sur' },
      { etiqueta: 'Accesos', valor: 'Puerta acristalada y trampilla de riego' },
      { etiqueta: 'Temperatura', valor: '28 °C constantes' },
      { etiqueta: 'Peculiaridad', valor: 'Caja fuerte oculta entre helechos' },
    ],
    descripcion: 'Una cúpula de hierro y cristal llena de plantas tropicales. La lluvia sobre el techo suena como un aplauso interminable.',
    relacion: 'Puyana pasaba allí las mañanas cuidando sus orquídeas. Escondió su caja fuerte bajo la más rara de todas.',
    detalle: 'Hay una orquídea negra recién trasplantada, con la tierra todavía removida.',
    pistaInocente:
      'el suelo de tierra del Invernadero no tiene una sola pisada fresca: el jardinero lo rastrilló a las diez y sigue intacto',
    comoFue: 'Todo ocurrió en el Invernadero, donde el estruendo de la lluvia sobre el cristal cubrió cualquier ruido.',
  },
  {
    id: 'bodega',
    categoria: 'lugar',
    nombre: 'Bodega',
    conArticulo: 'la Bodega',
    enLugar: 'en la Bodega',
    monograma: 'B',
    tono: '#5b1630',
    lema: 'Tres mil botellas. Algunas, más viejas que los invitados.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Sótano' },
      { etiqueta: 'Accesos', valor: 'Escalera de piedra desde la cocina' },
      { etiqueta: 'Temperatura', valor: '12 °C' },
      { etiqueta: 'Peculiaridad', valor: 'Barrica n.º 12, siempre cerrada' },
    ],
    descripcion: 'Bóvedas de ladrillo, humedad y silencio. El eco devuelve cada paso multiplicado por tres.',
    relacion: 'Puyana bajaba solo a elegir el vino de cada gala. Nadie más tenía llave de la reserva.',
    detalle: 'Falta una botella de 1964 en la estantería de la reserva privada.',
    pistaInocente:
      'la Bodega quedó inundada con el primer aguacero: el agua llega a las rodillas y nadie bajó a ella en toda la noche',
    comoFue: 'Todo ocurrió en la Bodega, bajo bóvedas de ladrillo donde ningún grito llega al piso de arriba.',
  },
  {
    id: 'salon-baile',
    categoria: 'lugar',
    nombre: 'Salón de baile',
    conArticulo: 'el Salón de baile',
    enLugar: 'en el Salón de baile',
    monograma: 'S',
    tono: '#a3802f',
    lema: 'Doscientas velas, una orquesta y un apagón perfecto.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Baja, ala central' },
      { etiqueta: 'Accesos', valor: 'Tres puertas y dos balcones' },
      { etiqueta: 'Aforo', valor: '120 personas' },
      { etiqueta: 'Peculiaridad', valor: 'Espejos de suelo a techo' },
    ],
    descripcion: 'Suelos de mármol ajedrezado, lámparas de araña y espejos que multiplican cada sombra.',
    relacion: 'Puyana organizó la gala para anunciar algo «que cambiaría la vida de todos los presentes».',
    detalle: 'Uno de los espejos tiene una grieta reciente, a la altura de un hombro.',
    pistaInocente:
      'en el Salón de baile hubo decenas de testigos durante todo el apagón; allí nadie pudo moverse sin ser visto',
    comoFue: 'Todo ocurrió en el Salón de baile, a oscuras, entre decenas de invitados que no vieron nada.',
  },
  {
    id: 'despacho',
    categoria: 'lugar',
    nombre: 'Despacho',
    conArticulo: 'el Despacho',
    enLugar: 'en el Despacho',
    monograma: 'D',
    tono: '#6b0f1a',
    lema: 'Donde Puyana firmaba fortunas y sentencias.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Primera, ala este' },
      { etiqueta: 'Accesos', valor: 'Puerta blindada con alarma' },
      { etiqueta: 'Iluminación', valor: 'Lámpara de escritorio verde' },
      { etiqueta: 'Peculiaridad', valor: 'Reloj de pared detenido' },
    ],
    descripcion: 'Madera oscura, un escritorio inmenso y un reloj de péndulo que dejó de sonar esta noche.',
    relacion: 'Ningún invitado entraba sin ser llamado. Allí Puyana cerraba los tratos que nadie más debía conocer.',
    detalle: 'El cristal del reloj está roto y las agujas se han quedado clavadas.',
    pistaInocente:
      'la alarma del Despacho está conectada a su puerta blindada y no saltó en toda la noche: nadie la abrió',
    comoFue: 'Todo ocurrió en el Despacho, tras una puerta blindada que Puyana abrió él mismo a su asesino.',
  },
  {
    id: 'cocina',
    categoria: 'lugar',
    nombre: 'Cocina',
    conArticulo: 'la Cocina',
    enLugar: 'en la Cocina',
    monograma: 'C',
    tono: '#9a5a1f',
    lema: 'Fuego, cuchillos y demasiadas manos.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Baja, ala de servicio' },
      { etiqueta: 'Accesos', valor: 'Pasillo de servicio y escalera a la bodega' },
      { etiqueta: 'Personal', valor: 'Chef y cuatro pinches' },
      { etiqueta: 'Peculiaridad', valor: 'Montaplatos hasta el primer piso' },
    ],
    descripcion: 'Fogones de hierro, cobre colgado del techo y un montaplatos que sube directamente al ala de los señores.',
    relacion: 'Puyana bajaba de madrugada a probar las salsas a escondidas. Era el único sitio donde se le veía sonreír.',
    detalle: 'El montaplatos está detenido entre dos pisos.',
    pistaInocente:
      'la Cocina no se quedó vacía ni un minuto: los pinches trabajaron sin descanso y juran que allí no entró nadie más',
    comoFue: 'Todo ocurrió en la Cocina, entre el ruido de los fogones y el ir y venir del montaplatos.',
  },
];

export const ELEMENTOS: Record<Categoria, readonly Elemento[]> = {
  sospechoso: SOSPECHOSOS,
  arma: ARMAS,
  lugar: LUGARES,
};

const INDICE = new Map<string, Elemento>([...SOSPECHOSOS, ...ARMAS, ...LUGARES].map((e) => [e.id, e]));

export function porId(id: string): Elemento {
  const e = INDICE.get(id);
  if (!e) throw new Error(`Elemento desconocido: ${id}`);
  return e;
}

/** "la Condesa Elena", "el Dr. Vance", "Lady Clara"... para usar dentro de una frase. */
export function conTratamiento(nombre: string): string {
  if (/^(Condesa)\b/.test(nombre)) return `la ${nombre}`;
  if (/^(Dr\.|Inspector|Chef|Capitán)/.test(nombre)) return `el ${nombre}`;
  return nombre;
}

export function sospechoso(id: string): Sospechoso {
  return porId(id) as Sospechoso;
}
export function arma(id: string): Arma {
  return porId(id) as Arma;
}
export function lugar(id: string): Lugar {
  return porId(id) as Lugar;
}

export const HISTORIA = {
  titulo: '¿Quién mató a Puyana?',
  fecha: 'Villa Puyana · 13 de noviembre · 23:40',
  parrafos: [
    'Don Aurelio Puyana cumplía sesenta años y quiso celebrarlo como vivía: a lo grande y con público. Reunió en su mansión a seis invitados, cada uno con una deuda pendiente con él, y les prometió un anuncio que «cambiaría la vida de todos los presentes».',
    'A las 23:40 la tormenta tumbó la línea eléctrica. Durante veinte minutos, Villa Puyana fue solo oscuridad, relámpagos y el piano de alguien intentando calmar los nervios.',
    'Cuando volvió la luz, Puyana no estaba en el salón. Lo encontraron sin vida poco después. El reloj de su despacho se había detenido, la carretera estaba inundada y la policía no llegaría hasta el amanecer.',
    'Seis sospechosos. Seis armas posibles. Seis estancias en las que pudo ocurrir. Solo una combinación es la verdadera, y antes de que salga el sol tendrás que demostrar cuál.',
  ],
};
