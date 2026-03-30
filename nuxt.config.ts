import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Include the sds-nuxt-link layer for client-side routing of SDS components
  extends: [
    './layers/sds-nuxt-link',
  ],

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
