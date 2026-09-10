import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  platform: 'browser',
  target: 'esnext',
  dts: true,
  sourcemap: true,
  loader: {
    '.vert': 'text',
    '.frag': 'text',
  },
})
