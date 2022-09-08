import { glsl } from 'esbuild-plugin-glsl';
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/GopherGfx.ts'],
  format: ['esm'],
  outDir: 'build',
  ignoreWatch: ['build', 'examples', 'assignments'],
  splitting: true,
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [glsl()]
})