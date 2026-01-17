import { defineConfig } from 'vite';
import pkg from './package.json';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	build: {
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'inkblocks',
			formats: ['es', 'cjs'],
			cssFileName: 'style',
			fileName: (format) =>
				format === 'es' ? 'inkblocks.js' : 'inkblocks.cjs',
		},
		rollupOptions: {
			external: [
				...Object.keys(pkg.dependencies ?? {}),
				...Object.keys(
					(pkg as { peerDependencies?: Record<string, string> })
						.peerDependencies ?? {}
				),
			],
			output: {
				interop: 'compat',
			},
		},
	},
});
