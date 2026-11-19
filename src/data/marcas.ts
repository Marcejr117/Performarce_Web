// Marcas con las que trabaja el taller (logos de src/assets/marcas/).
// Las destacadas llevan su web oficial y no se repiten en las listas del resto.
import type { ImageMetadata } from 'astro';
import macbor from '../assets/marcas/moto/macbor.svg';
import symTexto from '../assets/marcas/moto/sym_texto.png';
import husqvarnaTexto from '../assets/marcas/forestal/husqvarna_logo_texto.png';
import benzaBlack from '../assets/marcas/forestal/benza_black.png';
import zanon from '../assets/marcas/forestal/zanon.png';

export interface Brand {
  name: string;
  logo: ImageMetadata;
  /** Web oficial de la marca (solo las destacadas). */
  href?: string;
}

// Logos del resto de marcas: fichero -> nombre de la marca (alt)
const logos = import.meta.glob<{ default: ImageMetadata }>('../assets/marcas/{moto,forestal}/*.{png,jpg,jpeg}', {
  eager: true,
});
const brands = (cat: 'moto' | 'forestal', list: [string, string][]): Brand[] =>
  list.map(([file, name]) => ({ name, logo: logos[`../assets/marcas/${cat}/${file}`].default }));

export const DESTACADAS_MOTO: Brand[] = [
  { name: 'Macbor', href: 'https://www.macbor.com/', logo: macbor },
  { name: 'SYM', href: 'https://www.sym.com.es/', logo: symTexto },
];

export const DESTACADAS_FORESTAL: Brand[] = [
  { name: 'Husqvarna', href: 'https://www.husqvarna.com/es/', logo: husqvarnaTexto },
  { name: 'Benza', href: 'https://benza.es/', logo: benzaBlack },
  { name: 'Zanon', href: 'https://www.zanon.it/en/', logo: zanon },
];

export const MARCAS_MOTO: Brand[] = brands('moto', [
  ['Arrow_Logo.jpg', 'Arrow'],
  ['barikit-logo.png', 'Barikit'],
  ['Dellorto_logo.jpg', "Dell'Orto"],
  ['elf-logo.png', 'Elf'],
  ['euromoto.jpg', 'Euromoto'],
  ['italkit.png', 'Italkit'],
  ['logo_ng.png', 'NG'],
  ['logo_shad.jpg', 'Shad'],
  ['logo-gro.jpg', 'GRO'],
  ['logo-jjuan.png', 'J.Juan'],
  ['logo-polini.png', 'Polini'],
  ['logo-rainers.png', 'Rainers'],
  ['logo-shiro.jpg', 'Shiro'],
  ['malossi_logo.png', 'Malossi'],
  ['MT_Helmets.jpg', 'MT Helmets'],
  ['NGK_logo.png', 'NGK'],
  ['nzi.jpg', 'NZI'],
  ['rq.png', 'RQ'],
  ['TJT_logo.png', 'TJT'],
  ['tk.png', 'TK'],
  ['vicma.jpg', 'Vicma'],
]);

export const MARCAS_FORESTAL: Brand[] = brands('forestal', [
  ['biss_stratton.png', 'Briggs & Stratton'],
  ['Echo_logo.jpg', 'Echo'],
  ['Honda_logo.png', 'Honda'],
  ['MTD.png', 'MTD'],
  ['oleomac-logo.png', 'Oleo-Mac'],
  ['oregon.png', 'Oregon'],
  ['Snapper.jpg', 'Snapper'],
]);
