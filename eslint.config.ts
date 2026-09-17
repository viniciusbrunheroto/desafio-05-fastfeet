import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js }, 
    extends: ['js/recommended'], 
    languageOptions: { globals: globals.browser },
    rules: {
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-useless-constructor': 'off',
      'no-explicit-any': 'off',

      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
    }, },
  tseslint.configs.recommended,
])
