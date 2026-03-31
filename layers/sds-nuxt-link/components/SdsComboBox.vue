<template>
  <OriginalSdsComboBox
    v-bind="{ ...$attrs, ...forwardedProps }"
    :suggestions="internalSuggestions"
    :option-type="effectiveOptionType"
  >
    <!--
      Forward all slots: default, optionGroup, option, customOption.
    -->
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </OriginalSdsComboBox>
</template>

<script setup lang="ts">
import { SdsComboBox as OriginalSdsComboBox } from '@cmu-sei/sei-design-system'
import type { ComboBoxSuggestion } from '@cmu-sei/sei-design-system'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'SdsComboBox',
  inheritAttrs: false,
})

/**
 * Extended suggestion type that supports Vue Router navigation via `to`.
 * When a suggestion has `to`, clicking it triggers client-side routing
 * instead of native href navigation.
 */
export type NuxtComboBoxSuggestion = (ComboBoxSuggestion & {
  to?: RouteLocationRaw | null
}) | string

// Only the props the wrapper's own logic reads are declared here.
// All other original SDS props pass through via $attrs.
interface NuxtComboBoxProps {
  suggestions?: NuxtComboBoxSuggestion[]
  /**
   * Forwarded from original: determines the tag type for options.
   * The wrapper reads this to auto-upgrade to 'a' when route suggestions exist.
   */
  optionType?: 'a' | 'button' | 'custom'
}

const props = withDefaults(defineProps<NuxtComboBoxProps>(), {
  suggestions: () => [],
})

const router = useRouter()

// When any suggestion has a `to` property and optionType is 'button',
// upgrade to 'a' so the original component renders anchors.
const effectiveOptionType = computed(() => {
  if (props.optionType && props.optionType !== 'button') {
    return props.optionType
  }
  const hasRouteSuggestion = props.suggestions.some(
    (s) => typeof s === 'object' && s !== null && 'to' in s && s.to
  )
  return hasRouteSuggestion ? 'a' : (props.optionType ?? 'button')
})

// Transform suggestions: resolve `to` into `href` for the original component.
const internalSuggestions = computed(() => {
  return props.suggestions.map((suggestion) => {
    if (typeof suggestion === 'string') return suggestion
    if (suggestion.to) {
      const resolved = router.resolve(suggestion.to as RouteLocationRaw)
      const { to, ...rest } = suggestion
      return { ...rest, href: resolved.href }
    }
    const { to, ...rest } = suggestion
    return rest
  })
})

const forwardedProps = computed(() => {
  const { suggestions, optionType, ...rest } = props
  return rest
})
</script>
