# Web de Talleres Marcelino

Web de [performarce.com](https://www.performarce.com): taller y tienda de motos, jardín y forestal en Albacete.
Hecha con Astro 5, Tailwind CSS 3 y daisyUI 4. Se publica en Vercel desde la rama `main` de GitHub: cada cambio que llega
a `main` se compila y está en la web en uno o dos minutos.

## Trabajar en local

Necesitas Node 22 y pnpm 9 (si no tienes pnpm, ejecuta `corepack enable` o escribe `corepack pnpm …`).

| Comando | Para qué |
|---|---|
| `pnpm install` | Instala las dependencias (la primera vez) |
| `pnpm dev` | Abre la web en http://localhost:4321 y la recarga con cada cambio |
| `pnpm build` | Comprueba el código (`astro check`) y genera la web en `dist/`. Tiene que terminar sin errores antes de publicar |
| `pnpm preview` | Sirve `dist/` en http://localhost:4321, tal como quedará publicada |

Dónde está cada cosa:

- `src/data/business.ts`: **todos los datos del negocio** (teléfono, WhatsApp, email, dirección, enlaces de mapas, redes y
  horario). Si cambia alguno, cámbialo solo aquí: se actualiza en toda la web y en los datos para Google.
- `src/data/marcas.ts`: las marcas y sus logos (`src/assets/marcas/`).
- `src/pages/`: una página por fichero (la dirección es el nombre del fichero).
- `src/components/`: piezas comunes (cabecera, pie, botones de contacto, mapa…).
- `src/lib/ofertas.ts` y `scripts/pdf-covers.mjs`: folletos en PDF y sus portadas.
- `scripts/iconos.mjs`: iconos de la web e imagen para redes.

## Publicar folletos de ofertas (PDF)

Los folletos se publican con el programa **Ofertas en PDF** (`PerformarceWebManager.jar`), sin tocar el código. Sus
instrucciones completas están en su `LEEME.txt`.

1. Elige la pestaña «Motos» o «Jardín y Forestal».
2. Arrastra los PDF a la zona naranja o pulsa «Añadir PDF...». Si ya hay uno con el mismo nombre, se reemplaza. También
   puedes renombrarlos y quitarlos.
3. Pulsa «Publicar cambios». En uno o dos minutos están en la web; compruébalo con «Ver en la web».

Qué hace la web con ellos:

- El programa los deja en `public/ofertasPDF/moto/` y `public/ofertasPDF/forestal/`. En cada compilación la web lee esas
  dos carpetas: no hay ninguna lista que mantener a mano.
- Salen en `/ofertas`, en la página de su categoría (`/ofertas_moto` u `/ofertas_forestal`) y en la portada. Si no hay
  ninguno, esas páginas lo dicen e invitan a preguntar por WhatsApp.
- **El nombre del fichero es el título que ve el cliente**: «Husqvarna otoño 2026.pdf» sale como «Husqvarna otoño 2026».
  Los «_» se cambian por espacios. Usa nombres claros y sin erratas.
- La portada de cada folleto es su primera página. `scripts/pdf-covers.mjs` la genera en cada compilación en
  `public/portadas/` (un WebP de 640 px, una copia de 320 px en `mini/` para las miniaturas y un `.json` con el tamaño y
  el número de páginas); esa carpeta no se guarda en git. Si un PDF no se puede leer, su tarjeta sale con un icono en lugar de la portada.
- Mejor PDF comprimidos de menos de 5 MB: se abren antes en el móvil.
- Google no indexa los PDF (cabecera `noindex` en `vercel.json`): posiciona las páginas de ofertas, que tienen los datos
  de contacto.

> **No cambies las líneas 1 a 11 de `src/pages/ofertas_moto.astro` ni de `src/pages/ofertas_forestal.astro`, ni el
> nombre de esos ficheros.** El programa antiguo «PDF Performarce» sobrescribe a ciegas su línea 10. La web ya no la usa,
> pero si se movieran las líneas, ese programa rompería el fichero. Además fuerza la subida y puede deshacer la web:
> desinstálalo de todos los equipos.

Para probar en local sin el programa, copia un PDF en `public/ofertasPDF/moto/` (o `forestal/`) y ejecuta `pnpm dev`; no
lo subas desde ahí. Si cambias un PDF por otro con el mismo nombre y la portada no se actualiza, borra
`public/portadas/`: se vuelve a generar.

## Horario

El horario está en `HOURS`, en `src/data/business.ts`. Mientras valga `null` (sin confirmar), **no aparece en ningún
sitio**: ni en la web ni en los datos para Google.

Para publicarlo, sustituye `null` por la lista de tramos: un objeto por cada horario distinto, con los días del 1 (lunes)
al 7 (domingo) y las horas en formato `HH:MM`. Por ejemplo (no es el horario real):

```ts
export const HOURS: { days: number[]; opens: string; closes: string }[] | null = [
  { days: [1, 2, 3, 4, 5], opens: '09:00', closes: '14:00' }, // de lunes a viernes, por la mañana
  { days: [1, 2, 3, 4, 5], opens: '16:00', closes: '20:00' }, // de lunes a viernes, por la tarde
  { days: [6], opens: '10:00', closes: '13:30' }, // sábado
];
```

Los días sin tramos salen como «Cerrado». Con eso, el horario aparece solo:

- en el pie de todas las páginas y en los bloques de contacto que lo usan (portada, Contacto, Cómo llegar y Taller de
  motos), con el día de hoy resaltado y una nota para festivos y puentes;
- en los datos estructurados para Google (`openingHoursSpecification`).

Pon el mismo horario en la ficha de Google, en Facebook y en Páginas Amarillas.

## Iconos e imagen para redes

Desde la raíz del repo, `node scripts/iconos.mjs` vuelve a generar con sharp:

| Fichero | Qué es |
|---|---|
| `public/favicon.ico` | Icono de la pestaña del navegador: un PNG de 48 px dentro de un ICO |
| `public/favicon-96.png` | El mismo icono a 96 px |
| `public/apple-touch-icon.png` | 180 px, para la pantalla de inicio del móvil. También es el logo de los datos para Google |
| `public/og.jpg` | Imagen de 1200 × 630 que sale al compartir la web por WhatsApp, Facebook, etc. |

- Los iconos son el escudo (`src/assets/logo/escudo.png`) centrado sobre el fondo oscuro de la web (#111827).
- La imagen para redes es la foto real de la tienda (`src/assets/fotos/tienda-motos-motosierras-husqvarna-albacete.jpg`),
  recortada, con el escudo abajo a la izquierda sobre una placa oscura. Para usar otra foto (por ejemplo, una de la
  fachada), cambia `FOTO`, `RECORTE` y `ETIQUETAS` al principio del script. El recorte debe tener la proporción de
  1200 × 630 (unos 1,9 de ancho por 1 de alto).
- `ETIQUETAS` es la lista de zonas que se difuminan, en píxeles de la foto original. Con otra foto, pon ahí lo que no
  deba leerse (precios, matrículas…); con la actual está vacía (`[]`), porque la foto ya viene retocada (siguiente punto).
- En la propia foto de `src/assets/fotos/` las cajas naranjas de las etiquetas de precio de las motosierras están
  repintadas con su mismo naranja, sin las cifras, porque la web no publica precios sin confirmar. La web la usa en la
  portada, en Tienda, en Jardín y forestal y en Quiénes somos. Si la cambias por otra, tapa también lo que no deba
  leerse.
- No forma parte de la compilación: ejecútalo cuando cambien el escudo o la foto y sube los ficheros generados.
- WhatsApp y Facebook guardan la imagen anterior durante un tiempo. Para que Facebook la vuelva a leer, pega la dirección
  en https://developers.facebook.com/tools/debug/ y pulsa «Volver a extraer».

## Mapa

El mapa es el de Google Maps incrustado, como en la web original (`src/components/Map.astro`), y sale en la portada, en
Contacto y en Cómo llegar. No hay que regenerar nada. Si cambiara la dirección, actualiza `src/data/business.ts` y el
`embedUrl` de `Map.astro` (en Google Maps: Compartir → Insertar un mapa → copia la dirección del `src` del iframe).
