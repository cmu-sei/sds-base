import type { RouteLocationRaw } from 'vue-router'

/**
 * Determines whether a given href/to value should be handled by NuxtLink
 * (internal route) or by a native <a> tag (external link).
 *
 * Internal routes:
 * - Relative paths (e.g. "about", "./about")
 * - Absolute paths starting with "/" (e.g. "/about")
 * - Vue Router route location objects (e.g. { name: 'about' })
 *
 * External/native links:
 * - Absolute URLs with a protocol (e.g. "https://example.com")
 * - mailto: / tel: links
 * - Hash-only anchors (e.g. "#section")
 * - javascript: URIs
 * - null / undefined / empty string
 */
export function useIsInternalRoute(href: MaybeRefOrGetter<string | RouteLocationRaw | null | undefined>) {
  return computed(() => {
    const value = toValue(href)

    // No href — not a link at all
    if (value == null || value === '') {
      return false
    }

    // Route location objects are always internal
    if (typeof value === 'object') {
      return true
    }

    // Protocol-relative URLs are external
    if (value.startsWith('//')) {
      return false
    }

    // Absolute URLs with a scheme are external
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
      return false
    }

    // Hash-only anchors stay native
    if (value.startsWith('#')) {
      return false
    }

    // Everything else (/, ./relative, relative) is internal
    return true
  })
}
