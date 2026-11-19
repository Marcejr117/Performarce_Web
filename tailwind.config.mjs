/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';

// Colores = variables CSS de global.css; cambian solos por tema y dentro de data-theme="dark".
// No se llama `accent` a ningún token propio: chocaría con el color `accent` de daisyUI.
const v = (n) => `rgb(var(--c-${n}) / <alpha-value>)`;
// Valores fijos para los temas de daisyUI (botones, casillas, color-scheme). Iguales que global.css.
const ORANGE = '#E36B22';
const L = { page: '#F7F9FB', surface: '#ECF0F4', line: '#D3DBE3', fg: '#111821', link: '#B4430E' };
const D = { page: '#111827', surface: '#1A2330', raised: '#25303E', line: '#3A4656', fg: '#DDE2E8', link: '#FF9655' };
const shape = { '--rounded-btn': '0.5rem', '--rounded-box': '0.75rem', '--rounded-badge': '9999px',
  '--animation-btn': '0.15s', '--btn-focus-scale': '1', '--border-btn': '1.5px' };

export default {
  darkMode: ['selector', '[data-theme="dark"]'], // `dark:` = tema más cercano (también en zonas oscuras)
  content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
  theme: {
    extend: {
      colors: {
        page: v('page'), surface: v('surface'), raised: v('raised'), line: v('line'), field: v('field'),
        fg: v('fg'), muted: v('muted'), link: v('link'), focus: v('focus'), chip: v('chip'), 'logo-tile': v('logo-tile'),
        brand: { DEFAULT: v('brand'), hover: v('brand-hover') }, 'on-brand': v('on-brand'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Barlow Condensed"', '"Arial Narrow"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: { base: ['1.0625rem', { lineHeight: '1.65' }] }, // 17 px
      maxWidth: { measure: '68ch' },
      boxShadow: {
        card: '0 1px 2px rgb(17 24 33 / 0.06), 0 2px 8px rgb(17 24 33 / 0.06)',
        'card-hover': '0 4px 10px rgb(17 24 33 / 0.08), 0 12px 28px rgb(17 24 33 / 0.10)',
        cover: '0 2px 4px rgb(0 0 0 / 0.12), 0 10px 24px rgb(0 0 0 / 0.18)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    // Sin tema oscuro automático por media query: el tema lo pone siempre el script de <head> en <html data-theme>.
    // Con 'dark', un visitante sin JavaScript y con el sistema en oscuro vería botones oscuros sobre la página clara.
    darkTheme: false,
    themes: [
      { light: { 'color-scheme': 'light', primary: ORANGE, 'primary-content': L.fg, secondary: D.page, 'secondary-content': L.page,
          accent: L.link, neutral: D.page, 'neutral-content': D.fg, 'base-100': L.page, 'base-200': L.surface, 'base-300': L.line,
          'base-content': L.fg, ...shape } },
      { dark: { 'color-scheme': 'dark', primary: ORANGE, 'primary-content': D.page, secondary: D.fg, 'secondary-content': D.page,
          accent: D.link, neutral: D.raised, 'neutral-content': D.fg, 'base-100': D.page, 'base-200': D.surface, 'base-300': D.line,
          'base-content': D.fg, ...shape } },
    ],
  },
};
