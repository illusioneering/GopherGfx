import { glsl } from 'esbuild-plugin-glsl';
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  outDir: 'dist',
  ignoreWatch: ['dist'],
  splitting: true,
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [glsl()]
})