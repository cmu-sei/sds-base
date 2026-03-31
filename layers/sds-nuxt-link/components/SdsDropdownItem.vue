<template>
  <SdsNuxtLink
    v-if="shouldUseNuxtLink"
    :to="routeTarget!"
    v-slot="{ navigate, isActive, isExactActive }"
  >
    <OriginalSdsDropdownItem
      v-bind="{ ...$attrs, ...forwardedProps }"
      :active="!!(isActive || isExactActive)"
      @click="navigate"
    >
      <slot />
    </OriginalSdsDropdownItem>
  </SdsNuxtLink>

  <OriginalSdsDropdownItem
    v-else
    v-bind="{ ...$attrs, ...forwardedProps }"
  >
    <slot />
  </OriginalSdsDropdownItem>
</template>

<script setup lang="ts">
import { SdsDropdownItem as OriginalSdsDropdownItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'
import { useIsInternalRoute } from '../composables/useIsInternalRoute'
import { useAttrs } from 'vue'

defineOptions({
  name: 'SdsDropdownItem',
  inheritAttrs: false
})

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
// Note: href is read from $attrs (not props) in this component.
// DropdownItem has no `external` prop in SDS; it also doesn't need one
// since the wrapper only checks isInternal for shouldUseNuxtLink.
interface NuxtDropdownItemProps {
  /**
   * Vue Router route location. When provided, the wrapper routes via NuxtLink.
   */
  to?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtDropdownItemProps>(), {
  to: null
})

const attrs = useAttrs()

// Determine the effective route target: explicit `to` takes priority, then `href` from attrs
const routeTarget = computed<RouteLocationRaw | null>(() => {
  if (props.to !== null) return props.to
  const href = attrs.href as string | undefined
  if (href) return href
  return null
})

// Use NuxtLink when: we have a route target and it's internal
const shouldUseNuxtLink = computed(() => {
  if (routeTarget.value === null) return false
  return useIsInternalRoute(routeTarget).value
})

// Forward all props except `to` (wrapper-only)
const forwardedProps = computed(() => {
  const { to, ...rest } = props
  return rest
})
</script>
