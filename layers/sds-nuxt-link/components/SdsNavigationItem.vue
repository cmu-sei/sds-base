<template>
  <template v-if="type === 'back'">
    <OriginalSdsNavigationItem
      v-bind="{ ...$attrs, ...forwardedProps }"
      :external="external"
      :on-click="onClick"
    >
      <template v-if="$slots.default" #default>
        <slot />
      </template>
      <template v-if="$slots.left" #left>
        <slot name="left" />
      </template>
      <template v-if="$slots.children" #children>
        <slot name="children" />
      </template>
    </OriginalSdsNavigationItem>
  </template>
  <template v-else>
    <SdsNuxtLink
      v-if="shouldUseNuxtLink"
      :to="routeTarget!"
      v-slot="{ navigate }"
    >
      <OriginalSdsNavigationItem
        v-bind="{ ...$attrs, ...forwardedProps }"
        :external="false"
        :on-click="(e: Event) => { onClick?.(e); if (navigate) navigate(e as MouseEvent) }"
      >
        <template v-if="$slots.default" #default>
          <slot />
        </template>
        <template v-if="$slots.left" #left>
          <slot name="left" />
        </template>
        <template v-if="$slots.children" #children>
          <slot name="children" />
        </template>
      </OriginalSdsNavigationItem>
    </SdsNuxtLink>

    <OriginalSdsNavigationItem
      v-else
      v-bind="{ ...$attrs, ...forwardedProps }"
      :external="external"
      :on-click="onClick"
    >
      <template v-if="$slots.default" #default>
        <slot />
      </template>
      <template v-if="$slots.left" #left>
        <slot name="left" />
      </template>
      <template v-if="$slots.children" #children>
        <slot name="children" />
      </template>
    </OriginalSdsNavigationItem>
  </template>
</template>

<script setup lang="ts">
import { SdsNavigationItem as OriginalSdsNavigationItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'
import { useIsInternalRoute } from '../composables/useIsInternalRoute'

defineOptions({
  name: 'SdsNavigationItem',
  inheritAttrs: false
})

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtNavigationItemProps {
  /**
   * Vue Router route location. When provided, the wrapper routes via NuxtLink.
   */
  to?: RouteLocationRaw | null
  /**
   * Forwarded from original: provides the "href" link.
   * The wrapper reads this to determine the route target.
   */
  href?: string | null
  /**
   * Forwarded from original: controls external link behaviour.
   * The wrapper reads this to decide whether to use NuxtLink.
   */
  external?: boolean
  /**
   * Forwarded from original: determines the interaction type.
   * The wrapper reads this to skip NuxtLink for 'back' type items.
   */
  type?: 'back' | 'expand' | 'simple' | 'slide' | 'title'
  /**
   * Forwarded from original: override the default event handler.
   * The wrapper reads this to compose with navigate().
   */
  onClick?: ((event: Event) => void) | null
}

const props = withDefaults(defineProps<NuxtNavigationItemProps>(), {
  to: null,
  href: null,
  external: false,
  type: 'simple',
  onClick: null,
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

// Forward all props except `to` (wrapper-only)
const forwardedProps = computed(() => {
  const { to, ...rest } = props
  return rest
})
</script>
