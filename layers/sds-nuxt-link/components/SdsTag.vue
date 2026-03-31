<template>
  <SdsNuxtLink
    v-if="shouldUseNuxtLink"
    :to="routeTarget!"
    v-slot="{ navigate }"
  >
    <OriginalSdsTag
      v-bind="{ ...$attrs, ...forwardedProps }"
      :href="'#'"
      :external="false"
      @click="navigate"
    >
      <template v-if="$slots.leftSlot" #leftSlot>
        <slot name="leftSlot" />
      </template>
      <template v-if="$slots.label" #label>
        <slot name="label" />
      </template>
      <template v-if="$slots.action" #action>
        <slot name="action" />
      </template>
      <slot />
    </OriginalSdsTag>
  </SdsNuxtLink>

  <OriginalSdsTag
    v-else
    v-bind="{ ...$attrs, ...forwardedProps }"
    :external="external"
  >
    <template v-if="$slots.leftSlot" #leftSlot>
      <slot name="leftSlot" />
    </template>
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
    <slot />
  </OriginalSdsTag>
</template>

<script setup lang="ts">
import { SdsTag as OriginalSdsTag } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'
import { useIsInternalRoute } from '../composables/useIsInternalRoute'

defineOptions({
  name: 'SdsTag',
  inheritAttrs: false
})

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtSdsTagProps {
  /**
   * Vue Router route location. When provided, the wrapper routes via NuxtLink
   * instead of using the native href.
   */
  to?: RouteLocationRaw | null
  /**
   * Forwarded from original: provides the "href" link for the tag.
   * The wrapper reads this to determine the route target.
   */
  href?: string | null
  /**
   * Forwarded from original: controls external link behaviour.
   * The wrapper reads this to decide whether to use NuxtLink.
   */
  external?: boolean
}

const props = withDefaults(defineProps<NuxtSdsTagProps>(), {
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

// Check if the route target is internal
const isInternal = useIsInternalRoute(routeTarget)

// Use NuxtLink when: we have a route target, it's internal, and not explicitly marked external
const shouldUseNuxtLink = computed(() => {
  if (props.external) return false
  return routeTarget.value !== null && isInternal.value
})

// Forward all props except `to` (wrapper-only) to the original component
const forwardedProps = computed(() => {
  const { to, ...rest } = props
  return rest
})
</script>
