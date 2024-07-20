import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['seven sans', ...defaultTheme.fontFamily.sans],
				serif: ['seven serif', ...defaultTheme.fontFamily.serif],
			}
		},
	},
	plugins: [],
} satisfies Config
