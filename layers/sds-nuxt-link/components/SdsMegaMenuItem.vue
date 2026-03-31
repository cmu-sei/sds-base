<template>
  <SdsNuxtLink
    v-if="shouldUseNuxtLink"
    :to="routeTarget!"
    v-slot="{ navigate }"
  >
    <OriginalSdsMegaMenuItem
      v-bind="{ ...$attrs, ...forwardedProps }"
      :external="false"
      @click="navigate"
    >
      <template v-if="$slots.top" #top>
        <slot name="top" />
      </template>
      <template v-if="$slots.left" #left>
        <slot name="left" />
      </template>
      <slot />
    </OriginalSdsMegaMenuItem>
  </SdsNuxtLink>

  <OriginalSdsMegaMenuItem
    v-else
    v-bind="{ ...$attrs, ...forwardedProps }"
    :external="external"
  >
    <template v-if="$slots.top" #top>
      <slot name="top" />
    </template>
    <template v-if="$slots.left" #left>
      <slot name="left" />
    </template>
    <slot />
  </OriginalSdsMegaMenuItem>
</template>

<script setup lang="ts">
import { SdsMegaMenuItem as OriginalSdsMegaMenuItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'
import { useIsInternalRoute } from '../composables/useIsInternalRoute'
import { useAttrs } from 'vue'

defineOptions({
  name: 'SdsMegaMenuItem',
  inheritAttrs: false
})

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtSdsMegaMenuItemProps {
  /**
   * Vue Router route location. When provided, the wrapper routes via NuxtLink.
   */
  to?: RouteLocationRaw | null
  /**
   * Forwarded from original: controls external link behaviour.
   * The wrapper reads this to decide whether to use NuxtLink.
   */
  external?: boolean
}

const props = withDefaults(defineProps<NuxtSdsMegaMenuItemProps>(), {
  to: null,
  external: false,
})

const attrs = useAttrs()

// Determine the effective route target: explicit `to` takes priority, then `href` from attrs
const routeTarget = computed<RouteLocationRaw | null>(() => {
  if (props.to !== null) return props.to
  const href = attrs.href as string | undefined
  if (href) return href
  return null
})

// Use NuxtLink when: we have a route target, it's internal, and not explicitly marked external
const shouldUseNuxtLink = computed(() => {
  if (props.external || routeTarget.value === null) return false
  return useIsInternalRoute(routeTarget).value
})

// Forward all props except `to` (wrapper-only) to the original component
const forwardedProps = computed(() => {
  const { to, ...rest } = props
  return rest
})
</script>
