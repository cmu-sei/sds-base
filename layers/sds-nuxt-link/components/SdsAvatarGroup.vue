<template>
  <OriginalSdsAvatarGroup
    v-bind="{ ...$attrs, ...forwardedProps }"
    :srcset="internalSrcset"
  />
</template>

<script setup lang="ts">
import { SdsAvatarGroup as OriginalSdsAvatarGroup } from '@cmu-sei/sei-design-system'
import type { AvatarGroupItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsAvatarGroup',
  inheritAttrs: false,
})

/**
 * Extended AvatarGroupItem that supports Vue Router navigation via `to`.
 * When `to` is set, the avatar link uses a resolved client-side href.
 */
export interface NuxtAvatarGroupItem extends AvatarGroupItem {
  /**
   * Vue Router route location. When provided, the avatar link resolves
   * to a client-side href. Since the original component renders <a> tags
   * directly, the resolved path is set as href.
   */
  to?: RouteLocationRaw | null
}

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtAvatarGroupProps {
  srcset?: NuxtAvatarGroupItem[]
}

const props = withDefaults(defineProps<NuxtAvatarGroupProps>(), {
  srcset: () => [],
})

const router = useRouter()

// Transform items: resolve `to` into `href` for the original component.
// The original SdsAvatarGroup renders <a> tags directly when `href` is present,
// so we resolve the Vue Router route to its href string.
const internalSrcset = computed(() => {
  return props.srcset.map((item) => {
    if (item.to) {
      const resolved = router.resolve(item.to)
      const { to, ...rest } = item
      return { ...rest, href: resolved.href }
    }
    const { to, ...rest } = item
    return rest
  })
})

const forwardedProps = computed(() => {
  const { srcset, ...rest } = props
  return rest
})
</script>
