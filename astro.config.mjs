import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { generateCovers } from './scripts/pdf-covers.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.performarce.com',
  // Una sola forma de URL: sin barra final (canonical, sitemap y enlaces). Vercel redirige /contact/ → /contact.
  trailingSlash: 'never',
  integrations: [
    // Los estilos base se cargan desde src/styles/global.css (Layout)
    tailwind({ applyBaseStyles: false }),
    // /gracias solo se ve tras enviar el formulario: fuera del sitemap
    sitemap({ filter: (page) => !page.includes('/gracias') }),
    {
      // Genera las portadas de los PDF de ofertas antes de que Vite copie public/
      name: 'pdf-covers',
      hooks: {
        'astro:config:setup': async ({ config, logger }) => {
          await generateCovers(fileURLToPath(config.root), logger);
        },
      },
    },
  ],
});
