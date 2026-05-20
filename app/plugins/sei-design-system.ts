import '@cmu-sei/sei-design-system/volar'
import SdsComponents from '@cmu-sei/sei-design-system'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(SdsComponents)

  // Apply the configured SDS theme class to <html> so component styles resolve.
  // Consuming apps can override the theme via app.config.ts:
  //   export default defineAppConfig({ sdsBase: { theme: 'plaid' } })
  const appConfig = useAppConfig()
  const theme = appConfig.sdsBase?.theme ?? 'forge'

  useHead({
    htmlAttrs: {
      class: `sds-theme-${theme}`,
    },
  })
})
