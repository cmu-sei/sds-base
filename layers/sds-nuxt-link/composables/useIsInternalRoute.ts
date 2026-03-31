import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Patterns that indicate a URL should NOT be routed via NuxtLink:
 * - Absolute URLs with protocol (https://, http://, ftp://, etc.)
 * - Protocol-relative URLs (//example.com)
 * - Special protocol URIs (mailto:, tel:, javascript:)
 * - Hash-only anchors (#section)
 */
const EXTERNAL_PATTERN = /^(https?:|ftp:|\/\/|mailto:|tel:|javascript:|#)/i

/**
 * Determines whether a given href or route location should be treated as an
 * internal route (handled by Vue Router / NuxtLink) or an external link
 * (handled natively by the browser).
 *
 * @param href - A string URL, Vue Router location object, ref, getter, null, or undefined
 * @returns A computed ref that is `true` when the value represents an internal route
 */
export function useIsInternalRoute(
  href: MaybeRefOrGetter<string | RouteLocationRaw | null | undefined>
) {
  return computed(() => {
    const value = toValue(href)

    // Null, undefined, and empty strings are not links at all
    if (value == null || value === '') {
      return false
    }

    // Route location objects ({ path: '...', name: '...' }) are always internal
    if (typeof value === 'object') {
      return true
    }

    // String values: check against external patterns
    if (typeof value === 'string') {
      return !EXTERNAL_PATTERN.test(value)
    }

    return false
  })
}
