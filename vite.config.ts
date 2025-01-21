import { defineConfig } from 'vite'
import stylelint from 'vite-plugin-stylelint'
import react from '@vitejs/plugin-react-swc'
import precss from 'precss'
import EnvironmentPlugin from 'vite-plugin-environment'
import svgr from 'vite-plugin-svgr'
export default defineConfig({
	plugins: [
		react(),
		stylelint({
			fix: true,
			include: ['./src/**/*.css', './src/**/*.pcss'],
			configFile: './.stylelintrc.json',
			emitErrorAsWarning: true,
		}),
		EnvironmentPlugin('all'),
		svgr(),
	],
	css: {
		postcss: {
			plugins: [precss()],
		},
	},
	build: {
		outDir: './dist',
		emptyOutDir: true,
	},
})
