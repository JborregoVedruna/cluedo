// Paneles superpuestos al lienzo de Phaser: cuaderno de deducción, pista, descarte,
// acusación y resolución. Se construyen con DOM + Tailwind para que sean cómodos en móvil.

import {
  CATEGORIAS,
  ELEMENTOS,
  NOMBRE_CATEGORIA,
  porId,
  type Categoria,
  type Sospechoso,
} from '../../data/caso.ts';
import {
  acusar,
  alternarMarca,
  candidatos,
  eventos,
  guardarNotas,
  intentarDescarte,
  nuevaPartida,
  obtener,
  puedeAcusar,
} from '../core/estado.ts';
import { busUi } from '../core/eventos.ts';
import type { Marca, Seleccion } from '../core/tipos.ts';
import { MISIONES } from '../misiones.ts';
import { ruta } from '../../lib/ruta.ts';
import { $, h } from './dom.ts';

const ETIQUETA_MARCA: Record<Marca, string> = { ninguna: 'Marcar', sospecha: 'Sospecho', principal: 'Principal' };

const BTN_PRIMARIO =
  'min-h-12 w-full rounded-xl bg-dorado-500 px-5 font-sans text-base font-bold text-carbon-950 shadow-lg shadow-black/30 transition active:scale-[0.98] active:bg-dorado-600 disabled:cursor-not-allowed disabled:bg-carbon-700 disabled:text-crema/40';
const BTN_SECUNDARIO =
  'min-h-12 w-full rounded-xl border border-dorado-500/50 bg-burdeos-900/60 px-5 font-sans text-base font-semibold text-dorado-400 transition active:scale-[0.98]';
const BTN_FANTASMA =
  'min-h-11 rounded-lg px-3 font-sans text-sm font-semibold text-dorado-400 underline-offset-4 hover:underline';

// ---------------------------------------------------------------- Modal

let cerrarActual: (() => void) | null = null;

function abrirModal(contenido: HTMLElement, etiqueta: string): () => void {
  cerrarActual?.();
  const raiz = $('#modal-raiz');
  const panel = h(
    'div',
    {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': etiqueta,
      class:
        'modal-panel relative max-h-[88svh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-3xl border border-dorado-500/25 bg-carbon-900 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl sm:rounded-3xl',
    },
    h('div', { class: 'mx-auto mb-4 h-1 w-12 rounded-full bg-dorado-500/40 sm:hidden', 'aria-hidden': 'true' }),
    contenido,
  );
  const fondo = h(
    'div',
    { class: 'modal-fondo fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6' },
    panel,
  );
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) cerrar();
  });
  const alTeclado = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cerrar();
  };
  document.addEventListener('keydown', alTeclado);
  raiz.append(fondo);
  requestAnimationFrame(() => fondo.classList.add('abierto'));
  panel.querySelector<HTMLElement>('button, [href], textarea')?.focus({ preventScroll: true });

  function cerrar() {
    document.removeEventListener('keydown', alTeclado);
    fondo.remove();
    if (cerrarActual === cerrar) cerrarActual = null;
  }
  cerrarActual = cerrar;
  return cerrar;
}

function aviso(mensaje: string): void {
  const t = $('#toast');
  t.textContent = mensaje;
  t.classList.remove('opacity-0', 'translate-y-4');
  window.clearTimeout(Number(t.dataset.timer));
  t.dataset.timer = String(window.setTimeout(() => t.classList.add('opacity-0', 'translate-y-4'), 2600));
}

function encabezado(antetitulo: string, titulo: string): HTMLElement {
  return h(
    'header',
    { class: 'mb-4' },
    h('p', { class: 'font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-dorado-500' }, antetitulo),
    h('h2', { class: 'mt-1 font-display text-2xl leading-tight text-crema' }, titulo),
  );
}

// ---------------------------------------------------------------- Pista

function mostrarPista(i: number): void {
  const p = obtener();
  const m = p.misiones[i];
  if (!m.pista) return;
  const pista = m.pista;
  const pendiente = m.estado === 'descarte';
  let cerrar = () => {};

  const cuerpo = h(
    'div',
    {},
    encabezado(`Pista ${MISIONES[i].numeral} de V`, pista.titulo),
    h(
      'div',
      { class: 'space-y-3 rounded-2xl border border-dorado-500/20 bg-carbon-800/70 p-4 font-display text-[17px] leading-relaxed text-crema/95' },
      pista.parrafos.map((t, k) => h('p', { class: k === 0 ? 'italic text-crema/75' : '' }, t)),
      pista.condicionales?.length
        ? h(
            'ol',
            { class: 'mt-2 space-y-3' },
            pista.condicionales.map((t, k) =>
              h(
                'li',
                { class: 'flex gap-3 rounded-xl bg-burdeos-950/60 p-3' },
                h('span', { class: 'font-sans text-sm font-bold text-dorado-500' }, `${k + 1}`),
                h('span', {}, t),
              ),
            ),
          )
        : null,
    ),
    pendiente
      ? h(
          'p',
          { class: 'mt-4 font-sans text-sm text-crema/70' },
          'Ahora descarta exactamente un sospechoso, un arma y un lugar que esta pista deje fuera de sospecha.',
        )
      : null,
    !pendiente && i === MISIONES.length - 1 && !p.resuelta
      ? h(
          'p',
          { class: 'mt-4 font-sans text-sm text-crema/70' },
          'Cruza estas afirmaciones con los dos candidatos que te quedan en cada categoría: solo una combinación las cumple todas.',
        )
      : null,
    h(
      'div',
      { class: 'mt-5 grid gap-3' },
      pendiente
        ? h('button', { class: BTN_PRIMARIO, onclick: () => mostrarDescarte(i) }, 'Pasar al descarte')
        : null,
      !pendiente && puedeAcusar()
        ? h('button', { class: BTN_PRIMARIO, onclick: () => mostrarAcusacion() }, 'Resolver el caso: Acusar')
        : null,
      h('button', { class: BTN_SECUNDARIO, onclick: () => cerrar() }, pendiente ? 'Descartar más tarde' : 'Volver a la mansión'),
    ),
  );
  cerrar = abrirModal(cuerpo, pista.titulo);
}

// ---------------------------------------------------------------- Selector de chips

interface Selector {
  el: HTMLElement;
  valor(): string | null;
  bloquear(id: string): void;
  limpiar(): void;
}

function selector(cat: Categoria, ids: string[], alCambiar: () => void, nombreGrupo: string): Selector {
  let elegido: string | null = null;
  const bloqueados = new Set<string>();
  const botones = new Map<string, HTMLButtonElement>();

  const pintar = () => {
    for (const [id, b] of botones) {
      const activo = elegido === id;
      const bloq = bloqueados.has(id);
      b.setAttribute('aria-checked', String(activo));
      b.disabled = bloq;
      b.className = [
        'min-h-12 rounded-xl border px-3 py-2 text-left font-sans text-sm font-semibold transition active:scale-[0.98]',
        bloq
          ? 'border-burdeos-600 bg-burdeos-950/70 text-crema/40 line-through'
          : activo
            ? 'border-dorado-400 bg-dorado-500 text-carbon-950'
            : 'border-carbon-600 bg-carbon-800 text-crema',
      ].join(' ');
    }
  };

  const lista = h(
    'div',
    { class: 'grid grid-cols-2 gap-2', role: 'radiogroup', 'aria-label': nombreGrupo },
    ids.map((id) => {
      const b = h(
        'button',
        {
          type: 'button',
          role: 'radio',
          onclick: () => {
            elegido = elegido === id ? null : id;
            pintar();
            alCambiar();
          },
        },
        porId(id).nombre,
      );
      botones.set(id, b);
      return b;
    }),
  );
  pintar();

  return {
    el: h(
      'fieldset',
      { class: 'mt-4' },
      h(
        'legend',
        { class: 'mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-dorado-500' },
        NOMBRE_CATEGORIA[cat].plural,
      ),
      lista,
    ),
    valor: () => elegido,
    bloquear(id) {
      bloqueados.add(id);
      if (elegido === id) elegido = null;
      pintar();
    },
    limpiar() {
      elegido = null;
      pintar();
    },
  };
}

// ---------------------------------------------------------------- Descarte

function mostrarDescarte(i: number): void {
  const mensaje = h('div', { class: 'mt-4 space-y-2', 'aria-live': 'polite' });
  const confirmar = h('button', { class: BTN_PRIMARIO, disabled: true }, 'Confirmar descarte') as HTMLButtonElement;
  const actualizar = () => {
    confirmar.disabled = !CATEGORIAS.every((c) => selectores[c].valor());
  };
  const selectores = Object.fromEntries(
    CATEGORIAS.map((c) => [c, selector(c, candidatos(c), actualizar, `Descartar ${NOMBRE_CATEGORIA[c].singular}`)]),
  ) as Record<Categoria, Selector>;

  let cerrar = () => {};
  confirmar.addEventListener('click', () => {
    const sel = Object.fromEntries(CATEGORIAS.map((c) => [c, selectores[c].valor()])) as Partial<Seleccion>;
    const r = intentarDescarte(i, sel);
    mensaje.replaceChildren();
    if (r.ok) {
      cerrar();
      const siguiente = MISIONES[i + 1];
      aviso(siguiente ? `Descarte anotado. Desbloqueada la misión ${siguiente.numeral}.` : 'Descarte anotado.');
      return;
    }
    if (r.motivo === 'contradice') {
      for (const cat of r.conflictos) {
        const id = sel[cat]!;
        selectores[cat].bloquear(id);
        mensaje.append(
          h(
            'p',
            { class: 'rounded-xl border border-burdeos-600 bg-burdeos-950/80 p-3 font-sans text-sm text-crema', role: 'alert' },
            h('strong', { class: 'text-[#f07a8c]' }, 'Las evidencias lo contradicen. '),
            `Descartar ${porId(id).nombre} contradice las evidencias del caso Puyana. Elige ${NOMBRE_CATEGORIA[cat].otro}.`,
          ),
        );
      }
      actualizar();
    } else {
      mensaje.append(h('p', { class: 'font-sans text-sm text-[#f07a8c]' }, 'Elige exactamente un elemento de cada categoría.'));
    }
  });

  const cuerpo = h(
    'div',
    {},
    encabezado(`Misión ${MISIONES[i].numeral} · Fase de descarte`, 'Descarta 1 de cada categoría'),
    h(
      'p',
      { class: 'font-sans text-sm leading-relaxed text-crema/70' },
      'Elige un sospechoso, un arma y un lugar que todavía estén en juego. Si eliges algo que las evidencias señalan, el caso te avisará.',
    ),
    CATEGORIAS.map((c) => selectores[c].el),
    mensaje,
    h(
      'div',
      { class: 'mt-5 grid gap-3' },
      confirmar,
      h('button', { class: BTN_SECUNDARIO, onclick: () => mostrarPista(i) }, 'Releer la pista'),
    ),
  );
  cerrar = abrirModal(cuerpo, 'Fase de descarte');
}

// ---------------------------------------------------------------- Acusación

function mostrarAcusacion(): void {
  if (obtener().resuelta) {
    mostrarVictoria();
    return;
  }
  if (!puedeAcusar()) {
    aviso('Todavía faltan pistas por reunir.');
    return;
  }
  const acusarBtn = h('button', { class: BTN_PRIMARIO, disabled: true }, 'Acusar') as HTMLButtonElement;
  const actualizar = () => {
    acusarBtn.disabled = !CATEGORIAS.every((c) => selectores[c].valor());
  };
  const selectores = Object.fromEntries(
    CATEGORIAS.map((c) => [c, selector(c, candidatos(c), actualizar, `Acusar: ${NOMBRE_CATEGORIA[c].singular}`)]),
  ) as Record<Categoria, Selector>;

  acusarBtn.addEventListener('click', () => {
    const sel = Object.fromEntries(CATEGORIAS.map((c) => [c, selectores[c].valor()!])) as Seleccion;
    const r = acusar(sel);
    if (r.correcto) mostrarVictoria();
    else mostrarDerrota(sel, r.fallos);
  });

  const condicionales = obtener().misiones[MISIONES.length - 1].pista?.condicionales ?? [];
  const cuerpo = h(
    'div',
    {},
    encabezado('Resolver el caso', '¿Quién mató a Puyana?'),
    h(
      'p',
      { class: 'font-sans text-sm leading-relaxed text-crema/70' },
      'Señala al culpable, el arma y el lugar entre los candidatos que siguen en pie.',
    ),
    condicionales.length
      ? h(
          'details',
          { class: 'mt-3 rounded-xl border border-dorado-500/20 bg-carbon-800/60 p-3 font-sans text-sm text-crema/80' },
          h('summary', { class: 'cursor-pointer font-semibold text-dorado-400' }, 'Declaración del careo final'),
          h('ol', { class: 'mt-2 list-decimal space-y-1 pl-5' }, condicionales.map((t) => h('li', {}, t))),
        )
      : null,
    CATEGORIAS.map((c) => selectores[c].el),
    h('div', { class: 'mt-5 grid gap-3' }, acusarBtn, h('button', { class: BTN_SECUNDARIO, onclick: () => cerrar() }, 'Seguir pensando')),
  );
  const cerrar = abrirModal(cuerpo, 'Acusación final');
}

function mostrarVictoria(): void {
  const p = obtener();
  const s = porId(p.solucion.sospechoso) as Sospechoso;
  const a = porId(p.solucion.arma);
  const l = porId(p.solucion.lugar);

  const resumen = p.misiones.map((m, i) => {
    const info = MISIONES[i];
    const texto = m.descarte
      ? `Descartaste a ${porId(m.descarte.sospechoso).nombre}, ${porId(m.descarte.arma).nombre} y ${porId(m.descarte.lugar).nombre}.`
      : 'Sus afirmaciones condicionales solo eran compatibles con una combinación.';
    return h(
      'li',
      { class: 'rounded-xl bg-carbon-800/70 p-3' },
      h('p', { class: 'font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-dorado-500' }, `Misión ${info.numeral} · ${info.titulo}`),
      h('p', { class: 'mt-1 font-sans text-sm text-crema/80' }, texto),
    );
  });

  const cuerpo = h(
    'div',
    {},
    encabezado('Caso cerrado', `${s.nombre}, con ${'conArticulo' in a ? a.conArticulo : a.nombre}, ${'enLugar' in l ? l.enLugar : l.nombre}.`),
    h(
      'div',
      { class: 'space-y-3 font-display text-[17px] leading-relaxed text-crema/95' },
      h('p', {}, s.comoFue),
      h('p', {}, a.comoFue),
      h('p', {}, l.comoFue),
      h(
        'p',
        { class: 'italic text-crema/70' },
        p.acusaciones === 1
          ? 'Lo resolviste a la primera. Al amanecer, la policía solo tuvo que firmar tu informe.'
          : `Necesitaste ${p.acusaciones} acusaciones, pero la verdad salió a la luz antes del amanecer.`,
      ),
    ),
    h('h3', { class: 'mt-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-dorado-500' }, 'Cómo encajaron las pistas'),
    h('ol', { class: 'mt-3 space-y-2' }, resumen),
    h(
      'div',
      { class: 'mt-6 grid gap-3' },
      h('button', { class: BTN_PRIMARIO, onclick: () => empezarDeNuevo() }, 'Nueva partida con otro misterio'),
      h('a', { class: `${BTN_SECUNDARIO} grid place-items-center`, href: ruta('/') }, 'Volver al inicio'),
    ),
  );
  abrirModal(cuerpo, 'Caso cerrado');
}

function mostrarDerrota(sel: Seleccion, fallos: Categoria[]): void {
  const frases: Record<Categoria, (n: string) => string> = {
    sospechoso: (n) => `El sospechoso no coincide: ${n} no es quien mató a Puyana.`,
    arma: (n) => `El arma no coincide: ${n} no fue el arma del crimen.`,
    lugar: (n) => `El lugar no coincide: el crimen no ocurrió en ${n}.`,
  };
  const cuerpo = h(
    'div',
    {},
    encabezado('La acusación no se sostiene', 'El asesino sigue libre'),
    h(
      'ul',
      { class: 'space-y-2' },
      fallos.map((c) =>
        h(
          'li',
          { class: 'rounded-xl border border-burdeos-600 bg-burdeos-950/70 p-3 font-sans text-sm text-crema' },
          frases[c](porId(sel[c]).nombre),
        ),
      ),
    ),
    h(
      'p',
      { class: 'mt-4 font-sans text-sm text-crema/70' },
      'Vuelve a leer la declaración del careo final: cada condición descarta combinaciones.',
    ),
    h(
      'div',
      { class: 'mt-5 grid gap-3' },
      h('button', { class: BTN_PRIMARIO, onclick: () => mostrarAcusacion() }, 'Reintentar acusación'),
      h('button', { class: BTN_SECUNDARIO, onclick: () => empezarDeNuevo() }, 'Nueva partida con un misterio distinto'),
    ),
  );
  abrirModal(cuerpo, 'Acusación fallida');
}

function empezarDeNuevo(): void {
  cerrarActual?.();
  cerrarCuaderno();
  nuevaPartida();
  aviso('Nuevo misterio en Villa Puyana. Suerte, detective.');
}

// ---------------------------------------------------------------- Cuaderno

let confirmandoReinicio = false;

function pintarCuaderno(): void {
  const p = obtener();
  const cuerpo = $('#cuaderno-cuerpo');
  const misionDeDescarte = (cat: Categoria, id: string) => p.descartados[cat].indexOf(id) + 1;

  const secciones = CATEGORIAS.map((cat) =>
    h(
      'section',
      { class: 'mb-6' },
      h(
        'h3',
        { class: 'mb-2 flex items-baseline justify-between font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-dorado-500' },
        NOMBRE_CATEGORIA[cat].plural,
        h('span', { class: 'font-normal normal-case tracking-normal text-crema/50' }, `${candidatos(cat).length} en juego`),
      ),
      h(
        'ul',
        { class: 'divide-y divide-carbon-700 overflow-hidden rounded-xl border border-carbon-700 bg-carbon-800/60' },
        ELEMENTOS[cat].map((e) => {
          const n = misionDeDescarte(cat, e.id);
          const marca = p.marcas[e.id] ?? 'ninguna';
          return h(
            'li',
            { class: 'flex min-h-12 items-center gap-3 px-3 py-2' },
            h(
              'span',
              {
                class: `flex-1 font-display text-[16px] ${n ? 'text-crema/35 line-through decoration-burdeos-600 decoration-2' : 'text-crema'}`,
              },
              e.nombre,
            ),
            n
              ? h('span', { class: 'font-sans text-[11px] font-semibold text-crema/45' }, `Descartado · M${MISIONES[n - 1].numeral}`)
              : h(
                  'button',
                  {
                    type: 'button',
                    class: [
                      'min-h-9 rounded-full border px-3 font-sans text-xs font-bold transition',
                      marca === 'principal'
                        ? 'border-burdeos-600 bg-burdeos-700 text-crema'
                        : marca === 'sospecha'
                          ? 'border-dorado-500 bg-dorado-500/15 text-dorado-400'
                          : 'border-carbon-600 text-crema/50',
                    ].join(' '),
                    'aria-label': `Marca para ${e.nombre}: ${ETIQUETA_MARCA[marca]}`,
                    onclick: () => alternarMarca(e.id),
                  },
                  marca === 'principal' ? '★ Principal' : marca === 'sospecha' ? '? Sospecho' : 'Marcar',
                ),
          );
        }),
      ),
    ),
  );

  const pistas = p.misiones
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.pista)
    .map(({ m, i }) =>
      h(
        'li',
        {},
        h(
          'button',
          {
            type: 'button',
            class: 'flex min-h-12 w-full items-center justify-between rounded-xl bg-carbon-800/70 px-3 text-left font-sans text-sm text-crema',
            onclick: () => {
              cerrarCuaderno();
              mostrarPista(i);
            },
          },
          h('span', {}, `${MISIONES[i].numeral} · ${MISIONES[i].titulo}`),
          h('span', { class: m.estado === 'descarte' ? 'text-[#f07a8c]' : 'text-dorado-400' }, m.estado === 'descarte' ? 'Descartar ›' : 'Leer ›'),
        ),
      ),
    );

  const notas = h('textarea', {
    class:
      'mt-2 min-h-28 w-full rounded-xl border border-carbon-600 bg-carbon-950 p-3 font-sans text-sm text-crema placeholder:text-crema/30 focus:border-dorado-500 focus:outline-none',
    placeholder: 'Escribe aquí tus deducciones…',
    'aria-label': 'Notas libres',
  }) as HTMLTextAreaElement;
  notas.value = p.notasLibres;
  let temporizador = 0;
  notas.addEventListener('input', () => {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => guardarNotas(notas.value), 300);
  });

  const reinicio = h(
    'button',
    {
      type: 'button',
      class: `${BTN_FANTASMA} mt-2 ${confirmandoReinicio ? 'text-[#f07a8c]' : ''}`,
      onclick: () => {
        if (confirmandoReinicio) {
          confirmandoReinicio = false;
          empezarDeNuevo();
        } else {
          confirmandoReinicio = true;
          pintarCuaderno();
        }
      },
    },
    confirmandoReinicio ? 'Pulsa otra vez para abandonar este caso y empezar otro' : 'Abandonar y empezar una nueva partida',
  );

  cuerpo.replaceChildren(
    ...secciones,
    h(
      'section',
      { class: 'mb-6' },
      h('h3', { class: 'mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-dorado-500' }, 'Pistas obtenidas'),
      pistas.length
        ? h('ul', { class: 'space-y-2' }, pistas)
        : h('p', { class: 'font-sans text-sm italic text-crema/50' }, 'Aún no has resuelto ninguna misión.'),
    ),
    h(
      'section',
      { class: 'mb-4' },
      h('h3', { class: 'font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-dorado-500' }, 'Notas libres'),
      notas,
    ),
    reinicio,
  );
}

function abrirCuaderno(): void {
  confirmandoReinicio = false;
  pintarCuaderno();
  const panel = $('#cuaderno');
  panel.classList.remove('translate-x-full');
  panel.setAttribute('aria-hidden', 'false');
  panel.removeAttribute('inert');
  $('#capa-cuaderno').classList.remove('pointer-events-none', 'opacity-0');
  $('#abrir-cuaderno').setAttribute('aria-expanded', 'true');
  $('#cerrar-cuaderno').focus({ preventScroll: true });
}

function cerrarCuaderno(): void {
  const panel = $('#cuaderno');
  panel.classList.add('translate-x-full');
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('inert', '');
  $('#capa-cuaderno').classList.add('pointer-events-none', 'opacity-0');
  $('#abrir-cuaderno').setAttribute('aria-expanded', 'false');
}

function cuadernoAbierto(): boolean {
  return !$('#cuaderno').classList.contains('translate-x-full');
}

// ---------------------------------------------------------------- Barra de acusación

function pintarBarra(): void {
  const p = obtener();
  const barra = $('#barra-acusar');
  const btn = $('#btn-acusar');
  const pendientes = p.misiones.filter((m) => m.estado !== 'completada').length;
  const visible = p.resuelta || puedeAcusar();
  barra.classList.toggle('hidden', !visible);
  btn.textContent = p.resuelta ? 'Ver la resolución del caso' : 'Resolver el caso: Acusar';
  $('#estado-caso').textContent = p.resuelta
    ? 'Caso resuelto'
    : pendientes === 0
      ? 'Listo para acusar'
      : `${MISIONES.length - pendientes}/5 misiones`;
}

// ---------------------------------------------------------------- Arranque

export function iniciarOverlay(): void {
  $('#abrir-cuaderno').addEventListener('click', () => (cuadernoAbierto() ? cerrarCuaderno() : abrirCuaderno()));
  $('#cerrar-cuaderno').addEventListener('click', cerrarCuaderno);
  $('#capa-cuaderno').addEventListener('click', cerrarCuaderno);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cuadernoAbierto() && !cerrarActual) cerrarCuaderno();
  });
  $('#btn-acusar').addEventListener('click', mostrarAcusacion);

  eventos.on('cambio', () => {
    pintarBarra();
    if (cuadernoAbierto()) pintarCuaderno();
  });
  eventos.on('pista', ({ mision }) => mostrarPista(mision));
  busUi.on('ver-pista', ({ mision }) => mostrarPista(mision));

  pintarBarra();
}
