/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';

// Paleta de marca. Usa siempre estos tokens; los grises son los `neutral-*` de Tailwind.
const brand = {
	50: '#FDF4EE',
	100: '#FBE5D6',
	200: '#F6C8AB',
	300: '#F0A475',
	400: '#EA8547',
	500: '#E36B22', // naranja de la marca (mismo en claro y oscuro)
	600: '#C95518',
	700: '#A74116',
	800: '#863619',
	900: '#6D2E18',
	950: '#3B150A',
	DEFAULT: '#E36B22',
};
const ink = { DEFAULT: '#0E1D20', 800: '#172A2E', 700: '#22393E', 600: '#2F4A50' };
const paper = { DEFAULT: '#FAF8F7', 200: '#F1ECE9', 300: '#E4DCD7' };

export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
	theme: {
		extend: {
			colors: { brand, ink, paper },
			fontFamily: {
				sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
				display: ['"Barlow Condensed"', '"Arial Narrow"', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [daisyui],
	// Temas de daisyUI con la paleta de marca. Layout pone data-theme="light|dark" junto a la clase .dark.
	daisyui: {
		logs: false,
		darkTheme: 'dark',
		themes: [
			{
				light: {
					'color-scheme': 'light',
					primary: brand[500],
					'primary-content': ink.DEFAULT,
					secondary: ink.DEFAULT,
					'secondary-content': paper.DEFAULT,
					accent: brand[700],
					neutral: ink.DEFAULT,
					'neutral-content': paper.DEFAULT,
					'base-100': paper.DEFAULT,
					'base-200': paper[200],
					'base-300': paper[300],
					'base-content': ink.DEFAULT,
				},
			},
			{
				dark: {
					'color-scheme': 'dark',
					primary: brand[500],
					'primary-content': ink.DEFAULT,
					secondary: paper.DEFAULT,
					'secondary-content': ink.DEFAULT,
					accent: brand[400],
					neutral: ink[700],
					'neutral-content': paper.DEFAULT,
					'base-100': ink.DEFAULT,
					'base-200': ink[800],
					'base-300': ink[700],
					'base-content': '#E7E2DF',
				},
			},
		],
	},
};
