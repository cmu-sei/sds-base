<template>
  <OriginalSdsTopFiveChart
    v-bind="{ ...$attrs, ...forwardedProps }"
    :entries="internalEntries"
    :view-all-url="effectiveViewAllUrl"
  />
</template>

<script setup lang="ts">
import { SdsTopFiveChart as OriginalSdsTopFiveChart } from '@cmu-sei/sei-design-system'
import type { TopFiveChartResult } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsTopFiveChart',
  inheritAttrs: false,
})

/**
 * Extended TopFiveChartResult that supports Vue Router navigation via `to`.
 * When `to` is set, the entry link resolves to a client-side href.
 */
export interface NuxtTopFiveChartResult extends TopFiveChartResult {
  /**
   * Vue Router route location. When provided, the entry link resolves
   * to a client-side href. Since the original component renders <a> tags
   * directly, the resolved path is set as `url`.
   */
  to?: RouteLocationRaw | null
}

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtTopFiveChartProps {
  entries?: NuxtTopFiveChartResult[]
  /**
   * Forwarded from original: URL for the "View All" link.
   * The wrapper reads this as the fallback when viewAllTo is not provided.
   */
  viewAllUrl?: string | null
  /**
   * Vue Router route location for the "View All" link. When provided,
   * takes precedence over viewAllUrl.
   */
  viewAllTo?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtTopFiveChartProps>(), {
  entries: () => [],
  viewAllUrl: null,
  viewAllTo: null,
})

const router = useRouter()

// Transform entries: resolve `to` into `url` for the original component.
const internalEntries = computed(() => {
  return props.entries.map((entry) => {
    if (entry.to) {
      const resolved = router.resolve(entry.to)
      const { to, ...rest } = entry
      return { ...rest, url: resolved.href }
    }
    const { to, ...rest } = entry
    return rest
  })
})

// Resolve viewAllTo into a URL string, falling back to viewAllUrl.
const effectiveViewAllUrl = computed(() => {
  if (props.viewAllTo) {
    return router.resolve(props.viewAllTo).href
  }
  return props.viewAllUrl
})

const forwardedProps = computed(() => {
  const { entries, viewAllUrl, viewAllTo, ...rest } = props
  return rest
})
</script>
