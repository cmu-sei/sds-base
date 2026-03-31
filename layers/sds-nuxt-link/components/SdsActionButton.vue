<template>
  <SdsNuxtLink
    v-if="shouldUseNuxtLink"
    :to="routeTarget!"
    v-slot="{ navigate, href, isActive, isExactActive }"
  >
    <OriginalSdsActionButton
      v-bind="{ ...$attrs, ...forwardedProps }"
      :href="href"
      :external="false"
      :active="!!(isActive || isExactActive)"
      @click="navigate"
    >
      <slot />
    </OriginalSdsActionButton>
  </SdsNuxtLink>

  <OriginalSdsActionButton
    v-else
    v-bind="{ ...$attrs, ...forwardedProps }"
    :external="external"
  >
    <slot />
  </OriginalSdsActionButton>
</template>

<script setup lang="ts">
import { SdsActionButton as OriginalSdsActionButton } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'
import { useIsInternalRoute } from '../composables/useIsInternalRoute'

defineOptions({
  name: 'SdsActionButton',
  inheritAttrs: false
})

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtActionButtonProps {
  /**
   * Vue Router route location. When provided, the wrapper routes via NuxtLink.
   */
  to?: RouteLocationRaw | null
  /**
   * Forwarded from original: determines the HTML tag (renders as <a> when set).
   * The wrapper reads this to determine the route target.
   */
  href?: string | null
  /**
   * Forwarded from original: controls external link behaviour.
   * The wrapper reads this to decide whether to use NuxtLink.
   */
  external?: boolean
}

const props = withDefaults(defineProps<NuxtActionButtonProps>(), {
  to: null,
  href: null,
  external: false,
})

// Determine the effective route target: explicit `to` takes priority, then `href`
const routeTarget = computed<RouteLocationRaw | null>(() => {
  if (props.to !== null) return props.to
  if (props.href) return props.href
  return null
})

// Use NuxtLink when: we have a route target, it's internal, and not explicitly marked external
const shouldUseNuxtLink = computed(() => {
  if (props.external || routeTarget.value == null) return false
  return useIsInternalRoute(routeTarget).value
})

// Forward all wrapper props except `to` (wrapper-only)
const forwardedProps = computed(() => {
  const { to, ...rest } = props
  return rest
})
</script>
