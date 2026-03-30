import '@cmu-sei/sei-design-system/volar'
import SdsComponents from '@cmu-sei/sei-design-system'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(SdsComponents)
  // Apply the default SDS theme class to <html> so component styles resolve.
  // Consuming apps can override this by setting their own sds-theme-* class.
  useHead({
    htmlAttrs: {
      class: 'sds-theme-forge',
    },
  })
})
