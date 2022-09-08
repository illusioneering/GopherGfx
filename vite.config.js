import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 8080
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  plugins: [
    glsl()
  ],
  //root: './examples/TestApp',
  root: './assignments/Assignment-1',
})