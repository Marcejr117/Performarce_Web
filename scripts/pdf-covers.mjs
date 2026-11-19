// Genera la portada de cada PDF de ofertas (primera página en WebP) y un .json con sus datos.
// Entrada: public/ofertasPDF/<cat>/<nombre>.pdf
// Salida:  public/portadas/<cat>/<nombre>.webp y <nombre>.json → { "width": 640, "height": 905, "pages": 24 }
//          public/portadas/<cat>/mini/<nombre>.webp: copia de 320 px para las miniaturas (tarjetas en móvil y portada)
// Se rehacen si falta alguno o si alguno es más antiguo que el PDF.
// Nunca rompe el build: si algo falla, la página muestra el respaldo con icono.
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
export const CATS = ['moto', 'forestal'];
const WIDTH = 640; // ancho de la portada; el alto sale de la proporción real de la página
const MINI = 320; // ancho de la copia para miniaturas

export async function generateCovers(root, log = console) {
  let pdfjs, sharp;
  try {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs'); // en Node usa @napi-rs/canvas
    sharp = (await import('sharp')).default; // aquí dentro: src/lib/ofertas.ts importa webpSize de este fichero
  } catch (e) {
    log.warn(`[portadas] pdfjs no disponible, se usará el respaldo: ${e.message}`);
    return;
  }
  // En Windows hay que pasar rutas con "/" y barra final, o getDocument falla
  const dir = path.dirname(require.resolve('pdfjs-dist/package.json')).split(path.sep).join('/');
  const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => -1);
  for (const cat of CATS) {
    const srcDir = path.join(root, 'public/ofertasPDF', cat);
    const outDir = path.join(root, 'public/portadas', cat);
    const files = (await readdir(srcDir).catch(() => [])).filter((f) => /\.pdf$/i.test(f));
    for (const f of files) { // en serie: poca RAM
      const base = f.replace(/\.pdf$/i, '');
      const out = path.join(outDir, `${base}.webp`);
      const mini = path.join(outDir, 'mini', `${base}.webp`);
      const json = path.join(outDir, `${base}.json`);
      try {
        const [pdf, webp, small, meta] = await Promise.all([mtime(path.join(srcDir, f)), mtime(out), mtime(mini), mtime(json)]);
        if (Math.min(webp, small, meta) >= pdf) continue; // ya generadas (y -1 = falta)
        await mkdir(path.dirname(mini), { recursive: true });
        const doc = await pdfjs.getDocument({
          data: new Uint8Array(await readFile(path.join(srcDir, f))),
          verbosity: 0,
          isEvalSupported: false,
          standardFontDataUrl: `${dir}/standard_fonts/`,
          cMapUrl: `${dir}/cmaps/`,
          cMapPacked: true,
          wasmUrl: `${dir}/wasm/`, // sin esto las fotos JPEG2000 salen en blanco
          iccUrl: `${dir}/iccs/`,
        }).promise;
        try {
          const page = await doc.getPage(1);
          const vp = page.getViewport({ scale: WIDTH / page.getViewport({ scale: 1 }).width });
          const width = Math.round(vp.width);
          const height = Math.round(vp.height);
          const { canvas, context } = doc.canvasFactory.create(width, height);
          await page.render({ canvas, canvasContext: context, viewport: vp }).promise;
          const portada = await canvas.encode('webp', 80);
          await writeFile(out, portada);
          await sharp(portada).resize(MINI).webp({ quality: 80 }).toFile(mini);
          await writeFile(json, JSON.stringify({ width, height, pages: doc.numPages }));
          log.info(`[portadas] ${cat}/${f} -> ${width}x${height}, ${doc.numPages} páginas`);
        } finally {
          await doc.destroy();
        }
      } catch (e) {
        log.warn(`[portadas] ${cat}/${f}: ${e.message} (se usará el respaldo)`);
      }
    }
  }
}

// Lee ancho y alto de la cabecera de un WebP (VP8, VP8L o VP8X). Devuelve null si no lo reconoce.
// Respaldo de src/lib/ofertas.ts si falta el .json de una portada.
export function webpSize(buf) {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  return null;
}
