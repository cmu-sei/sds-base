import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@cmu-sei/sei-design-system/open-sans/index.css',
    '../app/assets/css/main.css',
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
