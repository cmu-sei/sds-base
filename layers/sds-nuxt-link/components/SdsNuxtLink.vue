<template>
  <NuxtLink
    custom
    :to="to"
    v-slot="link"
  >
    <slot
      v-bind="{ ...link }"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsNuxtLink',
  inheritAttrs: false,
})

type SdsNuxtLinkSlotProps = {
  href?: string
  navigate?: (e?: MouseEvent) => void
  isActive?: boolean
  isExactActive?: boolean
}

defineSlots<{
  default(props: SdsNuxtLinkSlotProps): any
}>()

interface SdsNuxtLinkProps {
  to: RouteLocationRaw
}

defineProps<SdsNuxtLinkProps>()
</script>
