# ¿Quién mató a Puyana?

Misterio jugable de deducción inspirado en el Cluedo, ambientado en la pre boda de Juanky y Paula en la terraza del Hotel Riu Plaza España, hecho con **Astro**, **Tailwind CSS 4**, **Phaser 3**, **GSAP** y **Lenis**, y pensado primero para móvil.

## Puesta en marcha

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # genera ./dist
```

## Rutas

| Ruta          | Contenido                                                                      |
| :------------ | :----------------------------------------------------------------------------- |
| `/`           | Portada atmosférica, historia del crimen y accesos al juego y al expediente    |
| `/personajes` | Scrollytelling de los 6 sospechosos (relación, motivo, coartada, secreto)      |
| `/armas`      | Scrollytelling de las 6 armas (descripción, relación, informe forense)         |
| `/lugares`    | Scrollytelling de los 6 lugares                                                |
| `/jugar`   ## Cómo funciona una partida

1. Al empezar se elige una solución secreta (sospechoso + arma + lugar) con una semilla aleatoria.
   La partida se guarda en `localStorage`, así que recargar la página no cambia los puzles.
2. **12 misiones** (una en cada lugar y una por cada arma), en el orden que quieras. Cada una
   da una pista que exculpa un elemento; las categorías se alternan (sospechoso, arma, lugar…),
   así que se descartan 4 de cada una y quedan 2 candidatos. Si intentas descartar algo que forma
   parte de la solución, el juego te avisa y te pide que elijas otro.
3. **3 testimonios** (invitados, seguridad del hotel y camareros), que se abren al terminar las 12.
   Sus afirmaciones condicionales, juntas, solo encajan con una combinación.
4. Con todo resuelto se habilita **«Resolver el caso: Acusar»**.

| Misión                        | Relación                    | Tipo de puzle                         |
| :---------------------------- | :-------------------------- | :------------------------------------ |
| El guardarropa                | Hall de entrada             | Emparejar objetos con invitados       |
| La servilleta manchada        | Barra                       | Cifrado por desplazamiento            |
| La nota rasgada               | Pista de baile              | Reconstruir un mensaje                |
| El reflejo en la cristalera   | Terraza                     | Línea de visión en un plano           |
| La llamada perdida            | Baños                       | Teclado y pantalla del móvil          |
| El registro del ascensor      | Ascensor                    | Cálculo con el sensor de peso         |
| Las cámaras de seguridad      | Cordón de terciopelo        | Ordenar fotogramas                    |
| El ticket de la barra         | Botella de ginebra premium  | Reconstruir una cuenta                |
| La sesión del DJ              | Cable XLR de sonido         | Ordenar canciones por duración        |
| Los vasos sin dueño           | Copa de cóctel envenenada   | Emparejar copas por sus rasgos        |
| La taquilla de limpieza       | Barra metálica de toallero  | Candado de 3 dígitos                  |
| La lista de reservados        | Abridor de botellas de latón| Sillones en fila (lógica de posición) |
| El reloj de Puyana            | Testimonio de los invitados | Ordenar sucesos                       |
| El contenedor                 | Testimonio de seguridad     | Emparejar restos con su procedencia   |
| El careo de los camareros     | Testimonio de los camareros | Uno miente                            |

El guion completo (sospechosos, armas, lugares e historia) está en `src/data/caso.ts`.

## Estructura

```text
src/
├── data/caso.ts              Los 18 elementos y la historia
├── styles/global.css         Tema Tailwind (burdeos, carbón, dorado)
├── scripts/cine.ts           Scrollytelling: GSAP ScrollTrigger + Lenis
├── layouts/Layout.astro
├── components/               BotonPrincipal, NavExpediente, Scrollytelling,
│                             PortadaExpediente, FichaCinematica, SiguienteExpediente
├── pages/                    index, personajes, armas, lugares, jugar
└── game/
    ├── main.ts · config.ts · misiones.ts
    ├── core/                 rng (con semilla), tipos, eventos, estado, pistas
    ├── puzzles/              un generador puro por misión (con solución única garantizada)
    ├── scenes/               MapaScene + escenas genéricas: Ordenar, Emparejar, Diales,
    │                         Elegir (careo, llamada, reflejo), Cifrado y Nota
    ├── ui/phaserUi.ts        Botones, textos nítidos, paneles
    └── overlay/              Cuaderno, pista, descarte, acusación y resolución (DOM)
```

Los generadores de `puzzles/` y `core/` no dependen de Phaser ni del DOM: cada puzle se genera
comprobando por fuerza bruta que tiene una única solución.

## Despliegue en GitHub Pages

La pipeline está en `.github/workflows/deploy.yml` y se ejecuta en cada push a `master`
(o a mano desde la pestaña **Actions → Desplegar en GitHub Pages → Run workflow**).

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz push a `master`. La web queda en `https://<usuario>.github.io/<repositorio>/`.

La pipeline pasa a Astro `ASTRO_SITE` y `ASTRO_BASE` (los obtiene de `actions/configure-pages`),
así que funciona con cualquier nombre de repositorio. Todos los enlaces internos usan
`ruta()` (`src/lib/ruta.ts`) para respetar esa subcarpeta. En local no hace falta configurar nada.
