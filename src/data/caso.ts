// Los 18 elementos del caso "¿Quién mató a Puyana?" (pre boda de Juanky y Paula).
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
  voz: string;
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
    id: 'machi',
    categoria: 'sospechoso',
    nombre: 'Machi el mono',
    nombreCompleto: 'Marcelino Mora Cortés',
    monograma: 'MM',
    tono: '#ff2e93',
    lema: 'Que Dios te lo pague.',
    voz: 'Altiva',
    ficha: [
      { etiqueta: 'Edad', valor: '31 años' },
      { etiqueta: 'Profesión', valor: 'Farmacéutico anti-abertzale' },
      { etiqueta: 'Visto por última vez', valor: 'Barra, 3:28' },
      { etiqueta: 'Tono de voz', valor: 'Altiva' },
    ],
    relacion:
      'Fijo en todas las quedadas del grupo. Con Puyana la cosa llevaba tiempo tensa: por política… y por algo que Machi prefiere no contar.',
    motivo: 'Puyana iba a votar a Pedro Sánchez.',
    coartada: 'Dice que estaba pidiendo en la barra.',
    secreto: 'Se besó con la novia de Puyana.',
    pistaInocente:
      'el camarero de la Barra tiene a Machi el mono en el ticket: pidió, pagó y volvió a pedir sin despegarse del mostrador durante todo el apagón',
    comoFue:
      'Machi el mono no podía consentir ese voto, y mucho menos que Puyana acabara contando lo del beso. Aprovechó la oscuridad para cobrarse la deuda. Que Dios se lo pague.',
  },
  {
    id: 'kike',
    categoria: 'sospechoso',
    nombre: 'Kike el verde',
    nombreCompleto: 'Enrique Jorge Caballero Liñán',
    monograma: 'KV',
    tono: '#3ee07a',
    lema: '¿Esta noche hacemos el camino de Shanti-ago?',
    voz: 'Confiado y engañoso',
    ficha: [
      { etiqueta: 'Edad', valor: '32 años' },
      { etiqueta: 'Profesión', valor: 'Diseñador industrial, dueño de Studio Manyar' },
      { etiqueta: 'Visto por última vez', valor: 'Junto a la cristalera, al teléfono, 3:27' },
      { etiqueta: 'Tono de voz', valor: 'Confiado y engañoso' },
    ],
    relacion:
      'Apenas un conocido lejano de Puyana. Aun así, desde lo de la Gran Vía, cada vez que se cruzan se nota la tensión.',
    motivo: 'Puyana le llamó Pirri en plena Gran Vía.',
    coartada: 'Estaba hablando con su pareja por teléfono.',
    secreto: 'Se enteró de que Puyana fue quién le robó el paddle.',
    pistaInocente:
      'el registro de llamadas demuestra que Kike el verde estuvo al teléfono con su pareja de 3:28 a 3:58, y varios invitados le oyeron repetir «que sí, que ya voy»',
    comoFue:
      'Kike el verde nunca olvidó aquel «Pirri» en plena Gran Vía. Cuando se fue la luz, colgó el teléfono un segundo y decidió que esa noche el camino lo hacía solo.',
  },
  {
    id: 'jack',
    categoria: 'sospechoso',
    nombre: 'Jack Poth',
    nombreCompleto: 'Albert Jakob Liñán Maho',
    monograma: 'JP',
    tono: '#22d3ee',
    lema: 'Esto se puede tirar al suelo porque es biodegradable.',
    voz: 'Tranquilo y pausado',
    ficha: [
      { etiqueta: 'Edad', valor: '33 años' },
      { etiqueta: 'Profesión', valor: 'Polivalente: domina el puente de diciembre y las vacaciones de verano' },
      { etiqueta: 'Visto por última vez', valor: 'Hall de entrada, 3:26' },
      { etiqueta: 'Tono de voz', valor: 'Tranquilo y pausado' },
    ],
    relacion:
      'Conoce a Puyana de haber coincidido con él en las fiestas de Juanky. Desde entonces se disputan, para desgracia de los dos, el mismo callejón para aparcar.',
    motivo: 'Puyana le robó el sitio para aparcar la furgoneta en su callejón favorito.',
    coartada: 'Estaba discutiendo con unos hombres por el color de sus zapatos.',
    secreto: 'Aparca en callejones oscuros para llevarse a chicas.',
    pistaInocente:
      'tres invitados confirman que Jack Poth pasó todo el apagón discutiendo con ellos sobre el color de sus zapatos, con toda la calma del mundo',
    comoFue:
      'Jack Poth llevaba meses dándole vueltas a lo del callejón. Sin prisa, como hace todo, decidió que esa plaza de aparcamiento volvía a ser suya.',
  },
  {
    id: 'juaky',
    categoria: 'sospechoso',
    nombre: 'Juaky el cojo',
    nombreCompleto: 'Joaquín Borrego Fernández',
    monograma: 'JC',
    tono: '#a855f7',
    lema: 'Óleme el dedo.',
    voz: 'Agresivo e hiriente',
    ficha: [
      { etiqueta: 'Edad', valor: '32 años' },
      { etiqueta: 'Profesión', valor: 'Desarrollador web, profesor de informática y pajero de élite' },
      { etiqueta: 'Visto por última vez', valor: 'Paseando por la terraza, 3:29' },
      { etiqueta: 'Tono de voz', valor: 'Agresivo e hiriente' },
    ],
    relacion:
      'En público, Juaky y Puyana se pasan la noche lanzándose pullas. Lo que pasa en privado es otra historia.',
    motivo: 'Puyana le quitó a su hombre peludo (Juan Carlos).',
    coartada: 'Estaba dándose un paseo.',
    secreto:
      'Puyana y él se llevan bien en secreto. Si se supiera, a Juaky lo tacharían de hipócrita.',
    pistaInocente:
      'las cámaras de la pasarela muestran a Juaky el cojo dando vueltas por la terraza de 3:30 a 4:00, cojeando, pero sin acercarse nunca a Puyana',
    comoFue:
      'Juaky el cojo no soportó que Puyana le quitara a Juan Carlos. Mientras todos cantaban a oscuras, dejó de disimular.',
  },
  {
    id: 'plakito',
    categoria: 'sospechoso',
    nombre: 'Plakito',
    nombreCompleto: 'Francisco Gago Medina, «M de Medina»',
    monograma: 'M',
    tono: '#f6b93b',
    lema: 'Esta noche, la ruta de la ermita.',
    voz: 'Fiestero y alegre',
    ficha: [
      { etiqueta: 'Edad', valor: '32 años' },
      { etiqueta: 'Profesión', valor: 'Abogado laboralista y chatarrero de la noche' },
      { etiqueta: 'Visto por última vez', valor: 'Pista de baile, 3:29' },
      { etiqueta: 'Tono de voz', valor: 'Fiestero y alegre' },
    ],
    relacion: 'Plakito y Puyana comparten amigo, Juan, pero solo uno de los dos puede ser el favorito.',
    motivo:
      'Puyana es el único amigo de Juan que sigue considerándose amigo de Juan y no de Plakito.',
    coartada: 'Estaba en la pista de baile haciendo el calzonas con su pareja.',
    secreto: 'Puyana ha estado con él en fiestas hasta altas horas de la noche.',
    pistaInocente:
      'media pista vio a Plakito haciendo el calzonas con su pareja durante todo «Pájaros de barro» y lo que sonó después',
    comoFue:
      'Plakito estaba harto de ser el segundo amigo de Juan. Entre canción y canción, decidió quedarse con el puesto.',
  },
  {
    id: 'paula',
    categoria: 'sospechoso',
    nombre: 'Paularios',
    nombreCompleto: 'Paula Pérez Tinajero',
    monograma: 'PP',
    tono: '#ff6b6b',
    lema: 'Cómo odio que Juanky haga eso.',
    voz: 'Clara y certera',
    ficha: [
      { etiqueta: 'Edad', valor: '29 años' },
      { etiqueta: 'Profesión', valor: 'Inspectora de Hacienda y futura esposa de Juanky' },
      { etiqueta: 'Vista por última vez', valor: 'Guardarropa, 3:31' },
      { etiqueta: 'Tono de voz', valor: 'Clara y certera' },
    ],
    relacion: 'La novia de la fiesta. Para ella, Puyana es la mayor amenaza para su boda.',
    motivo: 'Puyana es el amor platónico de su futuro marido.',
    coartada:
      'Como su novio no le hacía caso y le ponía ojitos a Puyana, fue a por el abrigo para marcharse.',
    secreto:
      'Ha encontrado en el cajón de Juanky dos billetes de avión a la isla Mauricio, a nombre de Juanky y de Puyana, para las mismas fechas que su luna de miel.',
    pistaInocente:
      'la encargada del guardarropa atendió a Paularios a las 3:31 y la tuvo delante hasta que volvió la luz, buscando su abrigo entre doscientos',
    comoFue:
      'Paularios encontró los billetes a Mauricio y lo vio clarísimo: en esa luna de miel sobraba alguien, y no era ella.',
  },
];

export const ARMAS: Arma[] = [
  {
    id: 'ginebra',
    categoria: 'arma',
    nombre: 'Botella de ginebra premium',
    conArticulo: 'la botella de ginebra premium',
    monograma: 'I',
    tono: '#5ef2ff',
    lema: 'Edición limitada. Final ilimitado.',
    ficha: [
      { etiqueta: 'Material', valor: 'Cristal grueso, edición limitada' },
      { etiqueta: 'Peso', valor: '1,8 kg' },
      { etiqueta: 'Procedencia', valor: 'Estantería iluminada de la Barra' },
      { etiqueta: 'Estado', valor: 'Sin abrir' },
    ],
    descripcion:
      'Botella de cristal grueso de edición limitada, de 1,8 kg y sin abrir, sacada de la estantería iluminada de la Barra.',
    relacion: 'Puyana la estuvo señalando toda la noche: «esa nos la bebemos en el brindis».',
    forense: 'Su base maciza deja traumatismos limpios y restos de etiqueta húmeda.',
    pistaInocente:
      'la botella de ginebra premium que faltaba apareció precintada en la nevera del DJ, sin un solo arañazo ni una huella',
    comoFue:
      'El arma fue la botella de ginebra premium: un golpe seco con la base maciza y la etiqueta húmeda como única testigo.',
  },
  {
    id: 'cordon',
    categoria: 'arma',
    nombre: 'Cordón de terciopelo',
    conArticulo: 'el cordón de terciopelo',
    monograma: 'II',
    tono: '#ff2e93',
    lema: 'Ordena la cola. Y también la vida.',
    ficha: [
      { etiqueta: 'Color', valor: 'Burdeos, con mosquetones de latón' },
      { etiqueta: 'Peso', valor: '1,2 kg' },
      { etiqueta: 'Procedencia', valor: 'Postes del Hall de entrada' },
      { etiqueta: 'Uso posible', valor: 'Estrangular o golpear' },
    ],
    descripcion:
      'Grueso cordón burdeos con mosquetones de latón dorado en los extremos (1,2 kg), arrancado de los postes del Hall de entrada.',
    relacion: 'Al llegar, Puyana se coló por debajo de ese cordón como si la fiesta fuera suya.',
    forense: 'Sirve tanto para estrangular como para golpear; los mosquetones dejan marcas redondas.',
    pistaInocente:
      'el cordón de terciopelo que falta lo retiró el personal a las tres porque tenía un mosquetón roto, y estuvo toda la noche en el guardarropa con la etiqueta de reparación',
    comoFue:
      'El arma fue el cordón de terciopelo: rápido, silencioso y devuelto a su poste antes de que volviera la luz.',
  },
  {
    id: 'cable',
    categoria: 'arma',
    nombre: 'Cable XLR de sonido',
    conArticulo: 'el cable XLR de sonido',
    monograma: 'III',
    tono: '#a855f7',
    lema: 'Tres metros de sonido. Y de silencio.',
    ficha: [
      { etiqueta: 'Longitud', valor: '3 m, reforzado' },
      { etiqueta: 'Clavija', valor: 'Metálica y pesada' },
      { etiqueta: 'Procedencia', valor: 'Cabina del DJ, Pista de baile' },
      { etiqueta: 'Estado', valor: 'Desconectado de golpe' },
    ],
    descripcion:
      'Cable grueso y reforzado de 3 metros con una clavija metálica pesada, desconectado de la cabina del DJ en la Pista de baile.',
    relacion: 'Puyana se pasó la noche pidiéndole al DJ «una más, la última».',
    forense: 'Apenas deja marcas visibles en el cuello.',
    pistaInocente:
      'el cable XLR de sonido lo desconectó el propio DJ cuando saltaron los plomos, y lo tuvo en la mano, enrollado, hasta que volvió la luz',
    comoFue:
      'El arma fue el cable XLR de sonido: tres metros que cortaron la música de Puyana para siempre.',
  },
  {
    id: 'copa',
    categoria: 'arma',
    nombre: 'Copa de cóctel envenenada',
    conArticulo: 'la copa de cóctel envenenada',
    monograma: 'IV',
    tono: '#3ee07a',
    lema: 'Un combinado de autor. El último.',
    ficha: [
      { etiqueta: 'Recipiente', valor: 'Copa de cristal fino' },
      { etiqueta: 'Contenido', valor: 'Combinado de autor' },
      { etiqueta: 'Añadido', valor: 'Unas gotas de sedante inodoro' },
      { etiqueta: 'Efecto', valor: 'Simula un colapso' },
    ],
    descripcion:
      'Copa de cristal fino con un combinado de autor y unas gotas de sedante líquido inodoro.',
    relacion: 'Puyana nunca rechaza una copa, y menos si es gratis.',
    forense: 'Simula un colapso por exceso de alcohol y estrés.',
    pistaInocente:
      'el análisis de la última copa de Puyana sale limpio: solo había ginebra, tónica y demasiado hielo',
    comoFue:
      'El arma fue la copa de cóctel envenenada: Puyana brindó por los novios sin saber que brindaba por última vez.',
  },
  {
    id: 'toallero',
    categoria: 'arma',
    nombre: 'Barra metálica de toallero',
    conArticulo: 'la barra metálica del toallero',
    monograma: 'V',
    tono: '#c7d2fe',
    lema: 'Fría, cromada y contundente.',
    ficha: [
      { etiqueta: 'Material', valor: 'Acero cromado macizo' },
      { etiqueta: 'Procedencia', valor: 'Lavabos de piedra negra, Baños' },
      { etiqueta: 'Estado', valor: 'Arrancada de la pared' },
      { etiqueta: 'Rastro', valor: 'No deja astillas' },
    ],
    descripcion: 'Tubo macizo de acero cromado arrancado de los lavabos de piedra negra de los Baños.',
    relacion: 'Puyana pasó por los baños tres veces esa noche.',
    forense: 'Un objeto contundente y frío que no deja astillas.',
    pistaInocente:
      'la barra del toallero no se usó: la arrancó el personal de limpieza a las 2:00 porque se había soltado, y desde entonces estaba guardada bajo llave en su taquilla',
    comoFue:
      'El arma fue la barra metálica del toallero: fría, cromada y escondida después entre toallas mojadas.',
  },
  {
    id: 'abridor',
    categoria: 'arma',
    nombre: 'Abridor de botellas de latón',
    conArticulo: 'el abridor de botellas de latón',
    monograma: 'VI',
    tono: '#f6b93b',
    lema: 'Abre botellas. Y otras cosas.',
    ficha: [
      { etiqueta: 'Forma', valor: 'Llave antigua de coleccionista' },
      { etiqueta: 'Material', valor: 'Latón pesado' },
      { etiqueta: 'Procedencia', valor: 'Merchandising VIP de la Terraza' },
      { etiqueta: 'Detalle', valor: 'Punta afilada' },
    ],
    descripcion:
      'Abridor pesado con forma de llave antigua de coleccionista, parte del merchandising VIP de la Terraza.',
    relacion: 'Puyana se guardó dos en el bolsillo nada más llegar a la zona VIP.',
    forense: 'Su punta afilada permite una estocada precisa y discreta.',
    pistaInocente:
      'los abridores de latón del merchandising VIP están todos contados: los dos de Puyana seguían en su bolsillo y el resto, en su caja precintada',
    comoFue:
      'El arma fue el abridor de botellas de latón: una estocada precisa con la punta, y de vuelta a la caja del merchandising.',
  },
];

export const LUGARES: Lugar[] = [
  {
    id: 'hall',
    categoria: 'lugar',
    nombre: 'Hall de entrada',
    conArticulo: 'el Hall de entrada',
    enLugar: 'en el Hall de entrada',
    monograma: 'H',
    tono: '#f6b93b',
    lema: 'Todo el que entra sale en cámara.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Baja' },
      { etiqueta: 'Acceso', valor: 'Puerta principal desde Plaza de España' },
      { etiqueta: 'Vigilancia', valor: 'Cámaras hacia el acceso' },
      { etiqueta: 'Ambiente', valor: 'Mármol brillante y luz tenue' },
    ],
    descripcion:
      'Mármol brillante, mostrador de recepción con luz tenue y cámaras apuntando al acceso principal desde Plaza de España.',
    relacion: 'Por aquí entró Puyana a medianoche gritando «¡que empiece la fiesta!».',
    detalle:
      'Los cordones de terciopelo que ordenan el paso están sueltos y uno de ellos ha desaparecido de su poste.',
    pistaInocente:
      'las cámaras del Hall de entrada tienen batería propia y grabaron todo el apagón sin cortes: Puyana no vuelve a aparecer en ellas',
    comoFue:
      'Todo ocurrió en el Hall de entrada, en el único rincón que las cámaras no cubren. Después sacaron el cuerpo por la puerta de servicio hasta el contenedor.',
  },
  {
    id: 'barra',
    categoria: 'lugar',
    nombre: 'Barra',
    conArticulo: 'la Barra',
    enLugar: 'en la Barra',
    monograma: 'B',
    tono: '#ff9f1c',
    lema: 'Última ronda a las 3:45.',
    ficha: [
      { etiqueta: 'Planta', valor: '27, parte oeste de la terraza' },
      { etiqueta: 'Iluminación', valor: 'Retroiluminada en ámbar' },
      { etiqueta: 'Protección', valor: 'Cristalera cortavientos' },
      { etiqueta: 'Ambiente', valor: 'Botellas de alta gama y relámpagos' },
    ],
    descripcion:
      'Barra retroiluminada en tonos ámbar, cristalera cortavientos y botellas de alta gama reflejando los relámpagos sobre Madrid.',
    relacion: 'El sitio favorito de Puyana: siempre pedía de dos en dos, «por si acaso».',
    detalle:
      'Falta una botella de ginebra premium sin abrir y bajo el mostrador hay una servilleta manchada de tinta.',
    pistaInocente:
      'en la Barra no dejó de haber gente pidiendo en todo el apagón: los camareros sirvieron a oscuras con la linterna del móvil y nadie vio a Puyana por allí',
    comoFue:
      'Todo ocurrió detrás de la Barra, a oscuras, entre cubiteras y gente pidiendo a gritos. Después bajaron el cuerpo por el montacargas hasta el contenedor.',
  },
  {
    id: 'pista',
    categoria: 'lugar',
    nombre: 'Pista de baile',
    conArticulo: 'la Pista de baile',
    enLugar: 'en la Pista de baile',
    monograma: 'DJ',
    tono: '#ff2e93',
    lema: 'Aquí nadie se queda quieto.',
    ficha: [
      { etiqueta: 'Planta', valor: '27, centro de la terraza' },
      { etiqueta: 'Suelo', valor: 'Iluminado, a cielo abierto' },
      { etiqueta: 'Cabina', valor: 'DJ con luces burdeos' },
      { etiqueta: 'Sonido', valor: 'Altavoces vibrando bajo la tormenta' },
    ],
    descripcion:
      'Suelo iluminado bajo el cielo abierto, cabina de DJ con luces burdeos y altavoces vibrando bajo la tormenta.',
    relacion: 'Puyana abrió la pista con Juanky y no la soltó en toda la noche.',
    detalle: 'Un cable de sonido está desconectado de golpe y hay marcas de arrastre recientes junto a los altavoces.',
    pistaInocente:
      'la Pista de baile estaba llena: decenas de invitados abrazados cantando «Pájaros de barro» a oscuras; allí nadie pudo hacer nada sin que lo vieran',
    comoFue:
      'Todo ocurrió en la Pista de baile, en plena oscuridad, mientras la terraza entera cantaba «Pájaros de barro». Las marcas de arrastre llevan hasta la salida de servicio y el contenedor.',
  },
  {
    id: 'terraza',
    categoria: 'lugar',
    nombre: 'Terraza',
    conArticulo: 'la Terraza',
    enLugar: 'en la Terraza',
    monograma: '27',
    tono: '#22d3ee',
    lema: 'Madrid a tus pies. Literalmente.',
    ficha: [
      { etiqueta: 'Planta', valor: 'Última: zona VIP y pasarela de cristal' },
      { etiqueta: 'Vistas', valor: '360°, con la Gran Vía a los pies' },
      { etiqueta: 'Barandillas', valor: 'De vidrio' },
      { etiqueta: 'Peculiaridad', valor: 'Pasarela suspendida en el vacío' },
    ],
    descripcion:
      'Vistas panorámicas de 360 grados a la Gran Vía, barandillas de vidrio y la famosa pasarela suspendida en el vacío.',
    relacion: 'Puyana se hizo veinte fotos en la pasarela de cristal para el grupo de la boda.',
    detalle: 'Uno de los paneles de cristal de la barandilla tiene una grieta reciente a la altura de un hombro.',
    pistaInocente:
      'la zona VIP y la pasarela de cristal de la Terraza estaban cerradas con cadena desde las 3:15 por el viento, y el vigilante no se movió de la entrada',
    comoFue:
      'Todo ocurrió en la Terraza, junto a la pasarela de cristal; la grieta del panel lo dice todo. Después bajaron el cuerpo hasta el contenedor por la escalera de emergencia.',
  },
  {
    id: 'banos',
    categoria: 'lugar',
    nombre: 'Baños',
    conArticulo: 'los Baños',
    enLugar: 'en los Baños',
    monograma: 'WC',
    tono: '#c7d2fe',
    lema: 'Lo que pasa en el baño se queda en el baño.',
    ficha: [
      { etiqueta: 'Planta', valor: '26 (penúltima)' },
      { etiqueta: 'Espejos', valor: 'De suelo a techo' },
      { etiqueta: 'Lavabos', valor: 'Piedra negra' },
      { etiqueta: 'Ambiente', valor: 'Luz dorada y música que amortigua los pasos' },
    ],
    descripcion:
      'Espejos de suelo a techo, luz indirecta dorada, lavabos de piedra negra y música ambiental que amortigua los pasos.',
    relacion: 'Puyana subió y bajó a los baños varias veces durante la noche.',
    detalle:
      'Un cubículo está cerrado por dentro sin nadie dentro y el reloj digital de la pared se paró justo a las 3:30.',
    pistaInocente:
      'la persona de limpieza de los Baños no se movió de la puerta en todo el apagón y jura que solo entraron dos invitadas a retocarse',
    comoFue:
      'Todo ocurrió en los Baños de la planta 26, con la música ambiental tapando cualquier ruido. Después bajaron el cuerpo por la escalera de servicio hasta el contenedor.',
  },
  {
    id: 'ascensor',
    categoria: 'lugar',
    nombre: 'Ascensor',
    conArticulo: 'el Ascensor',
    enLugar: 'en el Ascensor',
    monograma: '↑',
    tono: '#a855f7',
    lema: 'Planta 27: todo el mundo fuera.',
    ficha: [
      { etiqueta: 'Recorrido', valor: 'Directo del hall a la terraza' },
      { etiqueta: 'Cabina', valor: 'Panorámica, acristalada' },
      { etiqueta: 'Acabados', valor: 'Paneles dorados' },
      { etiqueta: 'Sonido', valor: 'Hilo musical con estática de los rayos' },
    ],
    descripcion:
      'Cabina panorámica acristalada con paneles dorados y un hilo musical que se corta con la estática de los rayos. Sube directo desde el hall hasta la terraza.',
    relacion: 'Puyana subió en el ascensor panorámico grabando vídeos para el grupo.',
    detalle:
      'El ascensor se quedó detenido entre la planta 26 y la 27, y el botón de emergencia tiene el cristal roto.',
    pistaInocente:
      'cuando se quedó atascado entre la 26 y la 27, el Ascensor estaba vacío: la cámara interior lo confirma y nadie volvió a usarlo hasta que lo revisó el técnico',
    comoFue:
      'Todo ocurrió en el Ascensor, atascado entre la planta 26 y la 27; el cristal roto del botón de emergencia fue el último intento de Puyana. Al bajar, el cuerpo acabó en el contenedor.',
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

/** Nombre tal y como se usa dentro de una frase (los apodos no llevan artículo). */
export function conTratamiento(nombre: string): string {
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


/** En la historia predeterminada, sospechosos cuyas pistas exculpatorias salen las últimas. */
export const ULTIMOS_EN_EXCULPARSE: readonly string[] = ['juaky', 'paula'];

/** Historia predeterminada: siempre la misma solución. */
export const HISTORIA_PREDETERMINADA = {
  solucion: { sospechoso: 'kike', arma: 'copa', lugar: 'terraza' },
  /** Semilla fija: los puzles y las pistas también son siempre los mismos. */
  semilla: 20261127,
  resolucion: [
    'Kike el verde nunca olvidó aquel «Pirri» en plena Gran Vía. Toda la noche intentó desahogarse con su pareja, pero la llamada la colgó en cuanto se fue la luz.',
    'A oscuras, mientras la terraza entera cantaba «Pájaros de barro», le ofreció a Puyana un combinado de autor «para hacer las paces». Llevaba unas gotas de sedante inodoro.',
    'Puyana, mareado, salió a la pasarela de cristal a tomar el aire. Se apoyó en la barandilla, justo donde ahora hay una grieta a la altura del hombro, y cayó al vacío.',
    'Su reloj se paró a las 3:50 con el golpe. A las 4, con la terraza ya cerrada, el personal del hotel lo encontró en el contenedor del callejón, veintisiete plantas más abajo.',
  ],
};

export const HISTORIA = {
  titulo: '¿Quién mató a Puyana?',
  fecha: 'Hotel Riu Plaza España · Pre boda de Juanky y Paula · 3:30 h',
  secciones: [
    {
      etiqueta: 'La pre boda',
      texto:
        'Terraza del Hotel Riu Plaza España, planta 27, con todo Madrid a los pies. Juanky y Paula celebran su pre boda con el grupo al completo: copas, música, una tormenta de verano iluminando la Gran Vía y Puyana, como siempre, convertido en el alma de la fiesta.',
    },
    {
      etiqueta: 'El apagón',
      texto:
        'Son las 3:30 y la terraza cierra a las 4. Justo entonces se va la luz. Nadie se asusta: alguien arranca con «Pájaros de barro» y la terraza entera se pone a cantar a oscuras, abrazada.',
    },
    {
      etiqueta: 'El cuerpo',
      texto:
        'Cuando vuelve la luz, nadie encuentra a Puyana. A las 4, con la terraza ya cerrada, aparece sin vida dentro de un contenedor de basura. Su reloj se ha parado a las 3:50.',
    },
    {
      etiqueta: 'Tu misión',
      texto:
        'Seis sospechosos, seis armas y seis lugares. Doce misiones por el hotel, tres rondas de testimonios y una sola acusación antes de que llegue la policía.',
    },
  ],
};
