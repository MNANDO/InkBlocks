import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig((conf) => ({
	plugins: [react()],
	resolve: {
		alias:
			conf.command === 'build'
				? ({} as Record<string, string>)
				: ({
						'@inkblocks/core': path.resolve(
							__dirname,
							'../core/src/'
						),
				  } as Record<string, string>),
	},
	build: {
		sourcemap: true,
		lib: {
			entry: {
				'inkblocks-react': path.resolve(__dirname, 'src/index.ts'),
			},
			name: 'inkblocks-react',
			formats: ['es', 'cjs'],
			cssFileName: 'style',
			fileName: (format, entryName) =>
				format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
		},
		rollupOptions: {
			external: (source) => {
				if (
					Object.keys({
						...pkg.dependencies,
						...(pkg.peerDependencies || {}),
						...pkg.devDependencies,
					}).includes(source)
				) {
					return true;
				}
				return (
					source === 'react' ||
					source === 'react-dom' ||
					source === 'react/jsx-runtime' ||
					source.startsWith('react/') ||
					source.startsWith('react-dom/') ||
					source === 'lexical' ||
					source.startsWith('@lexical/') ||
					source.startsWith('@inkblocks/') ||
					source.startsWith('node:')
				);
			},
			output: {
				interop: 'compat',
			},
		},
	},
}));
