// Genera los iconos de la web y la imagen para redes. Uso, desde la raíz del repo: node scripts/iconos.mjs
// No forma parte del build: se ejecuta a mano si cambian el escudo o la foto, y los ficheros generados se suben al repo.
//   public/favicon.ico           PNG de 48 px dentro de un ICO
//   public/favicon-96.png        96 px
//   public/apple-touch-icon.png  180 px (también es el `logo` del JSON-LD)
//   public/og.jpg                1200 × 630: foto real de la tienda, con el escudo abajo a la izquierda
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ruta = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const ESCUDO = ruta('src/assets/logo/escudo.png');
const FONDO = '#111827'; // `page` oscuro: el de la cabecera y el de theme-color
// Imagen para redes: foto, recorte (2048 × 1075, la proporción de 1200 × 630) y zonas que se difuminan, en píxeles de
// la foto original. Con otra foto, cambia estas tres constantes. La foto actual ya trae tapadas las cifras de las
// etiquetas de precio (la web no publica precios sin confirmar), así que no hay nada que difuminar.
const FOTO = ruta('src/assets/fotos/tienda-motos-motosierras-husqvarna-albacete.jpg');
const RECORTE = { left: 0, top: 150, width: 2048, height: 1075 };
const ETIQUETAS = []; // p. ej. { left: 300, top: 380, width: 165, height: 190 }

// Escudo centrado sobre un cuadrado oscuro. Ocupa el 86 % del lado: iOS redondea las esquinas del icono.
async function icono(lado) {
  const max = Math.round(lado * 0.86);
  const escudo = await sharp(ESCUDO).resize(max, max, { fit: 'inside' }).toBuffer();
  const png = await sharp({ create: { width: lado, height: lado, channels: 3, background: FONDO } })
    .composite([{ input: escudo }]) // centrado (gravity por defecto)
    .png()
    .toBuffer();
  // Segunda pasada sin canal alfa: el compuesto lo añade y Apple pide iconos opacos
  return sharp(png).removeAlpha().png({ compressionLevel: 9 }).toBuffer();
}

// ICO con un solo PNG dentro: cabecera de 6 bytes + una entrada de 16 + el PNG. Los campos que no se escriben valen 0.
function ico(png, lado) {
  const cab = Buffer.alloc(22);
  cab.writeUInt16LE(1, 2); // tipo: icono
  cab.writeUInt16LE(1, 4); // número de imágenes
  cab.writeUInt8(lado, 6); // ancho
  cab.writeUInt8(lado, 7); // alto
  cab.writeUInt16LE(1, 10); // planos
  cab.writeUInt16LE(32, 12); // bits por píxel
  cab.writeUInt32LE(png.length, 14); // tamaño del PNG
  cab.writeUInt32LE(cab.length, 18); // dónde empieza el PNG
  return Buffer.concat([cab, png]);
}

await writeFile(ruta('public/favicon.ico'), ico(await icono(48), 48));
await writeFile(ruta('public/favicon-96.png'), await icono(96));
await writeFile(ruta('public/apple-touch-icon.png'), await icono(180));

// og.jpg. Primero se difuminan las etiquetas sobre la foto original, en una pasada aparte, porque sharp aplica composite()
// después de resize(). Cada parche se desvanece en los BORDE px de alrededor para que no se vea un recuadro.
const BORDE = 24;
const tapadas = await Promise.all(
  ETIQUETAS.map(async ({ left, top, width, height }) => {
    const zona = { left: left - BORDE, top: top - BORDE, width: width + 2 * BORDE, height: height + 2 * BORDE };
    const mascara = `<svg xmlns="http://www.w3.org/2000/svg" width="${zona.width}" height="${zona.height}"><filter id="f"><feGaussianBlur stdDeviation="8"/></filter><rect x="${BORDE}" y="${BORDE}" width="${width}" height="${height}" rx="8" fill="#fff" filter="url(#f)"/></svg>`;
    const parche = await sharp(FOTO)
      .extract(zona)
      .blur(12)
      .composite([{ input: Buffer.from(mascara), blend: 'dest-in' }]) // solo queda opaco donde la máscara es blanca
      .png()
      .toBuffer();
    return { input: parche, left: zona.left, top: zona.top };
  }),
);
const foto = await sharp(FOTO).composite(tapadas).png().toBuffer(); // PNG para no comprimir dos veces en JPEG

// El escudo (plateado y blanco) va sobre una placa oscura: en esa esquina la foto es el panel blanco.
const MARGEN = 32, PLACA = 148;
const { data: escudo, info } = await sharp(ESCUDO).resize({ height: 120 }).toBuffer({ resolveWithObject: true });
const placa = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PLACA}" height="${PLACA}"><rect width="100%" height="100%" rx="16" fill="${FONDO}"/></svg>`,
);
const arriba = 630 - MARGEN - PLACA;
await sharp(foto)
  .extract(RECORTE)
  .resize(1200, 630)
  .composite([
    { input: placa, left: MARGEN, top: arriba },
    { input: escudo, left: MARGEN + Math.round((PLACA - info.width) / 2), top: arriba + (PLACA - info.height) / 2 },
  ])
  .jpeg({ quality: 82 })
  .toFile(ruta('public/og.jpg'));
