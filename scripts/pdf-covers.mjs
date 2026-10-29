// Genera una imagen WebP con la primera página de cada PDF de ofertas.
// Entrada: public/ofertasPDF/<cat>/<nombre>.pdf  ->  Salida: public/portadas/<cat>/<nombre>.webp
// Nunca rompe el build: si algo falla, la página muestra el respaldo con icono.
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
export const CATS = ['moto', 'forestal'];
const WIDTH = 640; // ancho de la portada; el alto sale de la proporción real de la página

export async function generateCovers(root, log = console) {
  let pdfjs;
  try {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs'); // en Node usa @napi-rs/canvas
  } catch (e) {
    log.warn(`[portadas] pdfjs no disponible, se usará el respaldo: ${e.message}`);
    return;
  }
  // En Windows hay que pasar rutas con "/" y barra final, o getDocument falla
  const dir = path.dirname(require.resolve('pdfjs-dist/package.json')).split(path.sep).join('/');
  for (const cat of CATS) {
    const srcDir = path.join(root, 'public/ofertasPDF', cat);
    const outDir = path.join(root, 'public/portadas', cat);
    const files = (await readdir(srcDir).catch(() => [])).filter((f) => /\.pdf$/i.test(f));
    if (files.length) await mkdir(outDir, { recursive: true });
    for (const f of files) { // en serie: poca RAM
      const src = path.join(srcDir, f);
      const out = path.join(outDir, f.replace(/\.pdf$/i, '.webp'));
      try {
        const [s, o] = await Promise.all([stat(src), stat(out).catch(() => null)]);
        if (o && o.mtimeMs >= s.mtimeMs) continue; // ya generada
        const doc = await pdfjs.getDocument({
          data: new Uint8Array(await readFile(src)),
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
          const { canvas, context } = doc.canvasFactory.create(Math.round(vp.width), Math.round(vp.height));
          await page.render({ canvas, canvasContext: context, viewport: vp }).promise;
          await writeFile(out, await canvas.encode('webp', 80));
          log.info(`[portadas] ${cat}/${f} -> ${Math.round(vp.width)}x${Math.round(vp.height)}`);
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
