// Folletos PDF de ofertas: se leen de public/ofertasPDF/<categoria>/ en el build (los sube la app Java).
import fs from 'node:fs';
import path from 'node:path';
import { webpSize } from '../../scripts/pdf-covers.mjs';
import { SITE } from '../data/business';

export type Categoria = 'moto' | 'forestal';
export const CATEGORIAS = {
  moto: { nombre: 'Motos y scooters', ruta: '/ofertas_moto', servicio: '/tienda-de-motos',
          whatsapp: 'Hola, ¿qué ofertas de motos y scooters tenéis ahora?' },
  forestal: { nombre: 'Jardín y forestal', ruta: '/ofertas_forestal', servicio: '/jardin-y-forestal',
              whatsapp: 'Hola, ¿qué ofertas de jardín y forestal tenéis ahora?' },
} as const;

export interface Folleto {
  categoria: Categoria;
  id: string;             // ancla única `${categoria}-${slug}` (el mismo PDF puede estar en las dos categorías)
  titulo: string;         // nombre del fichero sin .pdf; «Husqvarma» → «Husqvarna»; «_» → espacio
  href: string;           // /ofertasPDF/<cat>/<fichero codificado con encodeURIComponent>
  peso: string;           // «43 KB» si pesa menos de 1 MB; si no, «11,5 MB»
  paginas: number | null; // del .json de la portada
  portada: { src: string; width: number; height: number; srcset?: string } | null; // srcset: + copia de 320 px
  url: string;            // para compartir: `${SITE}${CATEGORIAS[cat].ruta}#${id}`
}

/** NFD, sin tildes, minúsculas y todo lo que no sea letra o número → «-». */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const peso = (bytes: number) =>
  bytes < 1048576
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1048576).toLocaleString('es-ES', { maximumFractionDigits: 1 })} MB`;

// Datos de la portada: el .json que escribe scripts/pdf-covers.mjs o, si falta, el tamaño del .webp
function leerPortada(cat: Categoria, base: string) {
  const dir = path.join(process.cwd(), 'public/portadas', cat);
  let meta: { width?: number; height?: number; pages?: number } = {};
  try {
    meta = JSON.parse(fs.readFileSync(path.join(dir, `${base}.json`), 'utf8'));
  } catch {
    // sin .json: se sigue con el .webp si existe
  }
  const webp = path.join(dir, `${base}.webp`);
  if (!fs.existsSync(webp)) return { portada: null, paginas: null };
  const size =
    meta.width && meta.height ? { width: meta.width, height: meta.height } : webpSize(fs.readFileSync(webp));
  const src = `/portadas/${cat}/${encodeURIComponent(base)}.webp`;
  // Copia de 320 px (scripts/pdf-covers.mjs) para las miniaturas: en móvil la carátula mide unos 80 px de ancho
  const mini = fs.existsSync(path.join(dir, 'mini', `${base}.webp`)) && size
    ? `/portadas/${cat}/mini/${encodeURIComponent(base)}.webp 320w, ${src} ${size.width}w`
    : undefined;
  return {
    portada: size ? { src, ...size, srcset: mini } : null,
    paginas: typeof meta.pages === 'number' ? meta.pages : null,
  };
}

function leerCategoria(cat: Categoria): Folleto[] {
  const dir = path.join(process.cwd(), 'public/ofertasPDF', cat);
  const ficheros = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.pdf$/i.test(f)) : [];
  const ids = new Set<string>();
  return ficheros
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map((f) => {
      const base = f.replace(/\.pdf$/i, '');
      const titulo = base.replace(/husqvarma/gi, 'Husqvarna').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      // Ancla única aunque dos nombres den el mismo slug («Oferta» y «oferta»)
      let id = `${cat}-${slugify(titulo) || 'folleto'}`;
      for (let n = 2; ids.has(id); n++) id = `${cat}-${slugify(titulo) || 'folleto'}-${n}`;
      ids.add(id);
      return {
        categoria: cat,
        id,
        titulo,
        href: `/ofertasPDF/${cat}/${encodeURIComponent(f)}`, // espacios, acentos, #, ?
        peso: peso(fs.statSync(path.join(dir, f)).size),
        ...leerPortada(cat, base),
        url: `${SITE}${CATEGORIAS[cat].ruta}#${id}`,
      };
    });
}

/** Folletos de una categoría, o de las dos (primero motos); orden alfabético dentro de cada una. */
export function getFolletos(cat?: Categoria): Folleto[] {
  return cat ? leerCategoria(cat) : [...leerCategoria('moto'), ...leerCategoria('forestal')];
}
