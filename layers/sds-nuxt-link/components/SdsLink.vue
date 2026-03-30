<template>
  <NuxtLink
    v-if="isInternal && !external"
    :to="to ?? href ?? undefined"
    v-bind="$attrs"
    :class="['link', kindClass, typeClass, variantClass, decorationClass, sizeClass, disabledClass]"
    :tabindex="disabled ? -1 : undefined"
    data-id="sds-link"
  >
    <slot />
  </NuxtLink>
  <OriginalSdsLink
    v-else
    v-bind="$attrs"
    :kind="kind"
    :type="type"
    :variant="variant"
    :decoration="decoration"
    :size="size"
    :external="external"
    :disabled="disabled"
    :href="href"
  >
    <slot />
  </OriginalSdsLink>
</template>

<script setup lang="ts">
import { SdsLink as OriginalSdsLink } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsLink',
  inheritAttrs: false
})

interface NuxtSdsLinkProps {
  /**
   * Determines the purpose and particular function of the component.
   */
  kind?: 'primary' | 'secondary' | 'tertiary'
  /**
   * Determines the type of the component.
   */
  type?: 'standalone' | 'inline' | 'cta'
  /**
   * Determines the color variant of the component.
   */
  variant?: 'blue' | 'red' | 'white'
  /**
   * Determines whether to display a decorated underline.
   */
  decoration?: 'underline'
  /**
   * Determines the size of the component.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Applies the appropriate attributes for external links and opens them in a new tab.
   */
  external?: boolean
  /**
   * Disables the component to prevent user interaction.
   */
  disabled?: boolean
  /**
   * URL for the link. When internal, NuxtLink handles client-side navigation.
   */
  href?: string | null
  /**
   * Vue Router route location. When provided, always uses NuxtLink.
   */
  to?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtSdsLinkProps>(), {
  kind: 'primary',
  type: 'standalone',
  variant: 'blue',
  decoration: undefined,
  size: undefined,
  external: false,
  disabled: false,
  href: null,
  to: null
})

// Determine if this is an internal route
const resolvedHref = computed(() => props.to ?? props.href)
const isInternal = useIsInternalRoute(resolvedHref)

// Replicate the class computations from the original SdsLink so that
// the NuxtLink path renders with identical styling.
const kindClass = computed(() => {
  switch (props.kind) {
    case 'secondary': return 'link-secondary'
    case 'tertiary': return 'link-tertiary'
    default: return 'link-primary'
  }
})

const typeClass = computed(() => {
  switch (props.type) {
    case 'inline': return 'link-inline'
    case 'cta': return 'link-cta'
    default: return ''
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'red': return 'link-red'
    case 'white': return 'link-white'
    default: return 'link-blue'
  }
})

const decorationClass = computed(() => {
  if (!props.decoration) return ''
  switch (props.variant) {
    case 'red': return 'underline underline-offset-2 decoration-red-500'
    case 'white': return 'underline underline-offset-2 decoration-white'
    default: return 'underline underline-offset-2 decoration-blue-500'
  }
})

const sizeClass = computed(() => {
  if (!props.size) return ''
  switch (props.size) {
    case 'xs': return 'text-xs'
    case 'sm': return 'text-sm'
    case 'lg': return 'text-lg'
    case 'xl': return 'text-xl'
    default: return 'text-base'
  }
})

const disabledClass = computed(() => props.disabled ? 'disabled' : '')
</script>
