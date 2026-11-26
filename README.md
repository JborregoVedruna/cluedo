# ¿Quién mató a Puyana?

Misterio jugable de deducción inspirado en el Cluedo, hecho con **Astro**, **Tailwind CSS 4**, **Phaser 3**, **GSAP** y **Lenis**, y pensado primero para móvil.

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
| `/jugar`      | El juego en Phaser con cuaderno, descartes y acusación en paneles superpuestos |

## Cómo funciona una partida

1. Al empezar se elige una solución secreta (sospechoso + arma + lugar) con una semilla aleatoria.
   La partida se guarda en `localStorage`, así que recargar la página no cambia los puzles.
2. **Misiones 1–4**: al resolver el puzle se obtiene una pista que exculpa un elemento de cada
   categoría. Después hay que descartar exactamente 1 sospechoso, 1 arma y 1 lugar. Si intentas
   descartar algo que forma parte de la solución, el juego te avisa y te pide que elijas otro.
3. **Misión 5 (careo)**: da afirmaciones condicionales, generadas a partir de tus candidatos
   restantes, que solo se cumplen en una combinación.
4. Con 2 candidatos por categoría se habilita **«Resolver el caso: Acusar»**.

> Con 6 elementos por categoría, descartar en las 5 misiones dejaría 1 solo candidato.
> Por eso el descarte es obligatorio en las misiones 1–4 y la acusación hace de descarte final.
> Se cambia con `MISIONES_CON_DESCARTE` en `src/game/core/estado.ts`.

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
    ├── puzzles/              generadores puros: reloj, candado, inventario, nota, careo
    ├── scenes/               MapaScene + una escena por misión (MisionBase)
    ├── ui/phaserUi.ts        Botones, textos nítidos, paneles
    └── overlay/              Cuaderno, pista, descarte, acusación y resolución (DOM)
```

Los generadores de `puzzles/` y `core/` no dependen de Phaser ni del DOM: cada puzle tiene
garantizada una solución única (el candado, el inventario, el careo y las afirmaciones finales
se generan comprobando la unicidad por fuerza bruta).

## Despliegue en GitHub Pages

La pipeline está en `.github/workflows/deploy.yml` y se ejecuta en cada push a `master`
(o a mano desde la pestaña **Actions → Desplegar en GitHub Pages → Run workflow**).

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz push a `master`. La web queda en `https://<usuario>.github.io/<repositorio>/`.

La pipeline pasa a Astro `ASTRO_SITE` y `ASTRO_BASE` (los obtiene de `actions/configure-pages`),
así que funciona con cualquier nombre de repositorio. Todos los enlaces internos usan
`ruta()` (`src/lib/ruta.ts`) para respetar esa subcarpeta. En local no hace falta configurar nada.
