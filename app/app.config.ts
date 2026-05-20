export default defineAppConfig({
  sdsBase: {
    // SDS theme to apply on the <html> element. One of: 'forge' | 'plaid'.
    theme: 'forge',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    sdsBase?: {
      theme?: 'forge' | 'plaid'
    }
  }
}
