<template>
  <OriginalSdsTabs
    v-model="internalTabs"
    v-bind="{ ...$attrs, ...forwardedProps }"
    @change="onChange"
  >
    <!--
      Forward all dynamic tab slots. Consumers use `tab(key)`, `tabIconLeft(key)`,
      `tabIconRight(key)`, `panel(key)`, and the default `panel` slot.
      We re-expose them via useSlots() passthrough.
    -->
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </OriginalSdsTabs>
</template>

<script setup lang="ts">
import { SdsTabs as OriginalSdsTabs } from '@cmu-sei/sei-design-system'
import type { TabItem } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsTabs',
  inheritAttrs: false,
})

/**
 * Extended tab item that supports Vue Router navigation via `to`.
 * When `to` is set, the tab uses client-side routing instead of native href.
 */
export interface NuxtTabItem extends TabItem {
  /**
   * Vue Router route location. When provided, the tab routes via NuxtLink
   * instead of using the native href. Automatically sets tag to 'a'.
   */
  to?: RouteLocationRaw | null
}

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtTabsProps {
  modelValue?: NuxtTabItem[]
}

const props = withDefaults(defineProps<NuxtTabsProps>(), {
  modelValue: () => [],
})

const emit = defineEmits(['update:modelValue', 'change'])

const router = useRouter()

// Safe accessor: modelValue may be undefined or a non-array at runtime
// (e.g. if the consumer doesn't provide it, or the original SdsTabs
// emits an unexpected shape during initialisation).
const tabs = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue : []
)

// Map from tab key to its `to` route, used for navigation on click
const routeMap = computed(() => {
  const map = new Map<string, RouteLocationRaw>()
  for (const tab of tabs.value) {
    if (tab.to) {
      map.set(tab.key, tab.to)
    }
  }
  return map
})

// Transform NuxtTabItems into standard TabItems for the original component.
// Items with `to` get tag:'a' and a resolved href so the original component
// renders them as <a> tags. The actual navigation is intercepted in onChange.
const internalTabs = computed({
  get() {
    return tabs.value.map((tab) => {
      if (tab.to) {
        const resolved = router.resolve(tab.to)
        const { to, ...rest } = tab
        return {
          ...rest,
          tag: 'a' as const,
          href: resolved.href,
          external: false,
        }
      }
      const { to, ...rest } = tab
      return rest
    })
  },
  set(newTabs) {
    // Reattach `to` from the original model when emitting updates
    const newTabsArr = Array.isArray(newTabs) ? newTabs : []
    const updated = newTabsArr.map((tab) => {
      const original = tabs.value.find((t) => t.key === tab.key)
      if (original?.to) {
        return { ...tab, to: original.to }
      }
      return tab
    })
    emit('update:modelValue', updated)
  },
})

const forwardedProps = computed(() => {
  const { modelValue, ...rest } = props
  return rest
})

const onChange = (tab: { key: string; [k: string]: unknown }) => {
  const route = routeMap.value.get(tab.key)
  if (route) {
    router.push(route)
  }
  emit('change', tab)
}
</script>
