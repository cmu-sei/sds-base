<template>
  <OriginalSdsMegaMenu
    v-model="internalTopLinks"
    v-bind="{ ...$attrs, ...forwardedProps }"
  >
    <!--
      Forward all dynamic slots: `link(key)`, `panel(key)`, and default.
    -->
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </OriginalSdsMegaMenu>
</template>

<script setup lang="ts">
import { SdsMegaMenu as OriginalSdsMegaMenu } from '@cmu-sei/sei-design-system'
import type { MegaMenuItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsMegaMenu',
  inheritAttrs: false,
})

/**
 * Extended MegaMenuItem that supports Vue Router navigation via `to`.
 * When `to` is set, the top-level link uses client-side routing instead of
 * native href navigation.
 */
export type NuxtMegaMenuItem<T = Record<string, unknown>> = MegaMenuItem<T> & {
  /**
   * Vue Router route location. When provided, the link routes via client-side
   * navigation instead of using the native href.
   */
  to?: RouteLocationRaw | null
}

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtMegaMenuProps {
  modelValue?: NuxtMegaMenuItem[]
}

const props = withDefaults(defineProps<NuxtMegaMenuProps>(), {
  modelValue: () => [],
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

// Transform NuxtMegaMenuItems into standard MegaMenuItems.
// Items with `to` get tag:'a' and a resolved href. The onClick handler
// is wrapped to intercept navigation and use client-side routing.
const internalTopLinks = computed({
  get() {
    return props.modelValue.map((item) => {
      if (item.to) {
        const resolved = router.resolve(item.to)
        const originalOnClick = item.onClick
        const route = item.to
        const { to, ...rest } = item
        return {
          ...rest,
          tag: 'a' as const,
          href: resolved.href,
          external: false,
          onClick: (...args: any[]) => {
            // Call the original onClick if present
            originalOnClick?.(...args)
            // Get the event from args — the MegaMenu passes (topLink, event) to onClick
            const event = args.find((a) => a instanceof Event)
            if (event) {
              event.preventDefault()
            }
            router.push(route)
          },
        }
      }
      const { to, ...rest } = item
      return rest
    })
  },
  set(newLinks) {
    // Reattach `to` from the original model when emitting updates
    const updated = newLinks.map((link) => {
      const original = props.modelValue.find((t) => t.key === link.key)
      if (original?.to) {
        return { ...link, to: original.to }
      }
      return link
    })
    emit('update:modelValue', updated)
  },
})

const forwardedProps = computed(() => {
  const { modelValue, ...rest } = props
  return rest
})
</script>
