<template>
  <!--
    When the DropdownItem's tag is "a" (default) and an internal href is passed
    via attrs, intercept with NuxtLink for client-side navigation.
    Otherwise, delegate entirely to the original component.
  -->
  <NuxtLink
    v-if="tag === 'a' && isInternal"
    :to="to ?? attrHref!"
    custom
    v-slot="{ navigate, href: resolvedHref }"
  >
    <OriginalSdsDropdownItem
      v-bind="filteredAttrs"
      :variant="variant"
      tag="a"
      :close-on-click="closeOnClick"
      :active="active"
      :disabled="disabled"
      :href="resolvedHref"
      @click="navigate"
    >
      <slot />
    </OriginalSdsDropdownItem>
  </NuxtLink>

  <OriginalSdsDropdownItem
    v-else
    v-bind="$attrs"
    :variant="variant"
    :tag="tag"
    :close-on-click="closeOnClick"
    :active="active"
    :disabled="disabled"
  >
    <slot />
  </OriginalSdsDropdownItem>
</template>

<script setup lang="ts">
import { SdsDropdownItem as OriginalSdsDropdownItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsDropdownItem',
  inheritAttrs: false
})

interface NuxtDropdownItemProps {
  variant?: 'gray' | 'red'
  tag?: string
  closeOnClick?: boolean
  active?: boolean
  disabled?: boolean
  /**
   * Vue Router route location. When provided, always uses NuxtLink.
   */
  to?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtDropdownItemProps>(), {
  variant: 'gray',
  tag: 'a',
  closeOnClick: true,
  active: false,
  disabled: false,
  to: null
})

const attrs = useAttrs()

// Extract href from attrs (since original DropdownItem receives it via fallthrough)
const attrHref = computed(() => (attrs.href as string | undefined) ?? null)
const resolvedHref = computed(() => props.to ?? attrHref.value)
const isInternal = useIsInternalRoute(resolvedHref)

// Filter out href from attrs when we're handling it ourselves via NuxtLink
const filteredAttrs = computed(() => {
  const { href, ...rest } = attrs
  return rest
})
</script>
