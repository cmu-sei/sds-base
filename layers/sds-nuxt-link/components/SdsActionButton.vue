<template>
  <!--
    When href is present, internal, and not marked external: use NuxtLink's
    custom renderless mode to handle client-side navigation while preserving
    the original ActionButton's full rendering (styles, pending state, etc.).
  -->
  <NuxtLink
    v-if="isInternal && !external"
    :to="to ?? href ?? undefined"
    custom
    v-slot="{ navigate, href: resolvedHref }"
  >
    <OriginalSdsActionButton
      v-bind="$attrs"
      :kind="kind"
      :variant="variant"
      :href="resolvedHref"
      :external="false"
      :type="type"
      :size="size"
      :active="active"
      :disabled="disabled"
      :block="block"
      :pending="pending"
      @click="navigate"
    >
      <slot />
    </OriginalSdsActionButton>
  </NuxtLink>

  <OriginalSdsActionButton
    v-else
    v-bind="$attrs"
    :kind="kind"
    :variant="variant"
    :href="href"
    :external="external"
    :type="type"
    :size="size"
    :active="active"
    :disabled="disabled"
    :block="block"
    :pending="pending"
  >
    <slot />
  </OriginalSdsActionButton>
</template>

<script setup lang="ts">
import { SdsActionButton as OriginalSdsActionButton } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsActionButton',
  inheritAttrs: false
})

interface NuxtActionButtonProps {
  kind?: 'primary' | 'secondary' | 'ghost'
  variant?: 'gray' | 'blue' | 'red' | 'white'
  href?: string | null
  external?: boolean
  type?: 'button' | 'submit'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  active?: boolean
  disabled?: boolean
  block?: boolean
  pending?: boolean
  /**
   * Vue Router route location. When provided, always uses NuxtLink.
   */
  to?: RouteLocationRaw | null
}

const props = withDefaults(defineProps<NuxtActionButtonProps>(), {
  kind: 'ghost',
  variant: 'gray',
  href: null,
  external: false,
  type: 'button',
  size: 'sm',
  active: false,
  disabled: false,
  block: false,
  pending: false,
  to: null
})

const resolvedHref = computed(() => props.to ?? props.href)
const isInternal = useIsInternalRoute(resolvedHref)
</script>
