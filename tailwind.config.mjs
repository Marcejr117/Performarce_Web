/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'
export default {
	darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {animation: {
				'infinite-scroll': 'infinite-scroll 20s linear infinite',
				'infinite-scroll-inverse': 'infinite-scroll-inverse 35s linear infinite',
			},
			keyframes: {
				'infinite-scroll': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				},
				'infinite-scroll-inverse': {
					from: { transform: 'translateX(0%)' },
					to: { transform: 'translateX(100%)' },
				},
			}, 
			boxShadow:{
				neon: "0 0 5px theme('colors.purple.200'), 0 0 20px theme('colors.purple.700')"
			},
			colors: {
        		'Custom_White': '#F1D2DB',
				'Custom_Brown_light': '#CA765F',
				'Custom_Blue': '#66A1A7',
				'Custom_Brown': '#816F61',
				'Custom_Black': '#0E1D20',
				'Light_white':'#FAF8F7',
				'Light_Blue_Acent':'#106CE8',
				'Light_Blue':'#1EC7D0',
				'Light_Orange':'#E36B22',
				'Light_Blue_deep':'#283252',
				'primary': {
					'50': '#f4f6fa',
					'100': '#e6eaf3',
					'200': '#d4d9e9',
					'300': '#b6c0da',
					'400': '#92a0c8',
					'500': '#7885b9',
					'600': '#666eaa',
					'700': '#5a5f9b',
					'800': '#4e507f',
					'900': '#414467',
					'950': '#2d2e43',
				},
      		},
		},
	},
	plugins: [animations,require("daisyui")],
}
