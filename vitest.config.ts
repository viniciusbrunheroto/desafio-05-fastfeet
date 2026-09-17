import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
  },
 
  plugins: [
    swc.vite({
      module: { type: 'es6'},
    }) 
  ],
})
