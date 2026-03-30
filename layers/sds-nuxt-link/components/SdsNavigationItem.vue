<template>
  <!--
    Back button type is always a button — never a link, so no NuxtLink needed.
    For non-back types: if href is internal and not marked external, use NuxtLink
    to enable client-side navigation, otherwise delegate to the original component.
  -->
  <OriginalSdsNavigationItem
    v-if="type === 'back' || !isInternal || external"
    v-bind="$attrs"
    :selected="selected"
    :label="label"
    :href="href"
    :external="external"
    :disabled="disabled"
    :type="type"
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

  <template v-else>
    <NuxtLink
      :to="to ?? href!"
      custom
      v-slot="{ navigate }"
    >
      <OriginalSdsNavigationItem
        v-bind="$attrs"
        :selected="selected"
        :label="label"
        :href="href"
        :external="false"
        :disabled="disabled"
        :type="type"
        :on-click="(e: Event) => { onClick?.(e); navigate(e as MouseEvent); }"
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
    </NuxtLink>
  </template>
</template>

<script setup lang="ts">
import { SdsNavigationItem as OriginalSdsNavigationItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsNavigationItem',
  inheritAttrs: false
})

interface NuxtNavigationItemProps {
  selected?: boolean
  label?: string
  href?: string | null
  external?: boolean
  disabled?: boolean
  type?: 'back' | 'expand' | 'simple' | 'slide' | 'title'
  onClick?: ((event: Event) => void) | null
  /**
   * Vue Router route location. When provided, always uses NuxtLink.
   */
  to?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtNavigationItemProps>(), {
  selected: false,
  label: '',
  href: null,
  external: false,
  disabled: false,
  type: 'simple',
  onClick: null,
  to: null
})

const resolvedHref = computed(() => props.to ?? props.href)
const isInternal = useIsInternalRoute(resolvedHref)
</script>
