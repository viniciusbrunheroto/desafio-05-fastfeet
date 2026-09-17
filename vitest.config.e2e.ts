import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'


export default defineConfig({
  test: {
    hookTimeout: 100_000,
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts']
  },
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    swc.vite({
      module: { type: 'es6'}
    })
  ]
})
