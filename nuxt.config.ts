import tailwindcss from '@tailwindcss/vite'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@cmu-sei/sei-design-system/open-sans/index.css',
    join(currentDir, 'app/assets/css/main.css'),
    '@cmu-sei/sei-design-system/dist/style.css',
  ],
  build: {
    transpile: ['@cmu-sei/sei-design-system'],
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    css: {
      devSourcemap: false,
    },
    build: {
      sourcemap: false,
    },
  },
  sourcemap: {
    server: false,
    client: false,
  },
  compatibilityDate: '2025-01-22',
})
