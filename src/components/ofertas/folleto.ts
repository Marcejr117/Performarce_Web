// Textos de un folleto que comparten la tarjeta y el diseño destacado.
import { waLink } from '../../data/business';
import type { Folleto } from '../../lib/ofertas';

/** «PDF · 24 páginas · 11,5 MB» (las páginas, solo si se conocen). Espacios duros ( ) para no dejar «MB» solo
 *  en otra línea: en la tarjeta de 360 px solo se parte detrás de un «·». */
export const meta = (f: Folleto) =>
  ['PDF', f.paginas && `${f.paginas} ${f.paginas === 1 ? 'página' : 'páginas'}`, f.peso.replace(' ', ' ')]
    .filter(Boolean)
    .join(' · ');

/** Botones de la tarjeta (WhatsApp, Descargar y Compartir): icono con su rótulo debajo, en tres columnas iguales.
 *  `!` en el texto: el ajuste global de `.btn` (16 px en negrita) va detrás de las utilidades y les ganaría. */
export const BTN_APILADO = 'btn btn-ghost h-12 w-full flex-col flex-nowrap gap-0.5 px-1 !text-[0.8125rem] !font-semibold';

/** WhatsApp con el título del folleto ya escrito. */
export const waFolleto = (f: Folleto) => waLink(`Hola, me interesa el folleto «${f.titulo}» que he visto en la web.`);
