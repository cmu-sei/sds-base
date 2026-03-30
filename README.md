# @cmu-sei/sds-base-layer

A Nuxt 4 layer that provides a one-line installation of the [SEI Design System](https://designsystem.sei.cmu.edu/) for any Nuxt application. It handles global component registration, CSS setup (including Open Sans and Tailwind CSS), build transpilation, and client-side routing wrappers for SDS navigation components.

## What's Included

- **Global SDS component registration** via a Nuxt plugin — all 54+ SDS components are available in templates without explicit imports
- **Volar type support** for SDS components in your IDE
- **CSS configuration** — Open Sans font, SDS component styles, and Tailwind CSS (with `@tailwindcss/forms`)
- **Build transpilation** for `@cmu-sei/sei-design-system`
- **sds-nuxt-link layer** — NuxtLink-aware wrappers for `SdsLink`, `SdsNavigationItem`, `SdsActionButton`, and `SdsDropdownItem` that enable client-side routing while preserving external link behavior

## Quick Start

```bash
npm install @cmu-sei/sds-base-layer
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@cmu-sei/sds-base-layer']
})
```

That's it. All SDS components, styles, and NuxtLink wrappers are now available in your application.

## Setting Up a New Project from Scratch

Below is a complete walkthrough for creating a new Nuxt app that uses `sds-base-layer`. These are the exact steps used to create and verify the initial test project.

### 1. Create the project directory

```bash
mkdir my-sds-app && cd my-sds-app
```

### 2. Set the Node version

Create an `.nvmrc` file to pin Node 22:

```
22.21.1
```

Then switch to that version:

```bash
nvm use
```

### 3. Configure the npm registry

Create an `.npmrc` file so the `@cmu-sei` scoped packages resolve correctly:

```ini
strict-ssl=true
registry=https://artifacts.sei.cmu.edu/artifactory/api/npm/npm-virtual/
@cmu-sei:registry=https://artifacts.sei.cmu.edu/artifactory/api/npm/sei-design-system-remote/
```

### 4. Create `package.json`

```json
{
  "name": "my-sds-app",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "npx nuxi dev",
    "build": "npx nuxt build"
  },
  "dependencies": {
    "@cmu-sei/sds-base-layer": "^0.1.0"
  },
  "devDependencies": {
    "nuxt": "^4.1.2",
    "typescript": "^5.9.3",
    "vue": "latest"
  }
}
```

### 5. Create `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  extends: ['@cmu-sei/sds-base-layer'],
  compatibilityDate: '2025-01-22',
  devtools: { enabled: true },
})
```

### 6. Install dependencies and run

```bash
npm install
npm run dev
```

The dev server will start (typically on `http://localhost:3000`). You'll see the default Nuxt welcome page, which confirms the project is running.

### 7. Add your own `app.vue`

Create `app/app.vue` to start building your application with SDS components:

```vue
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">My SDS App</h1>
    <SdsActionButton kind="primary" variant="default">
      Hello SDS
    </SdsActionButton>
  </div>
</template>
```

All 54+ SDS components are available in templates without imports. The `sds-theme-forge` theme is applied automatically.

## Using with Other Layers

When combining `sds-base-layer` with other Nuxt layers, list it first in the `extends` array so that higher-level layers can build on the SDS foundation it provides:

```ts
export default defineNuxtConfig({
  extends: [
    '@cmu-sei/sds-base-layer',
    // additional layers here
  ]
})
```

## What This Layer Does NOT Include

This layer provides only the SDS foundation. It does not include:

- Pages, layouts, or content
- Nuxt Content module or markdown processing
- Search functionality
- Sitemap generation
- Documentation-specific components or templates

For a full documentation site setup, use `@cmu-sei/sds-documentation-site` which provides all of the above.

## NuxtLink Wrappers (sds-nuxt-link)

The embedded `sds-nuxt-link` sub-layer automatically wraps four SDS components to use `<NuxtLink>` for internal routes, enabling client-side navigation without full-page reloads.

### Wrapped Components

| Component | Strategy |
|---|---|
| `SdsLink` | Renders `<NuxtLink>` directly for internal routes; falls back to the original for external links |
| `SdsNavigationItem` | Renderless NuxtLink (`custom` mode) injects client-side navigation into click handlers |
| `SdsActionButton` | Same renderless NuxtLink approach as SdsNavigationItem |
| `SdsDropdownItem` | Intercepts `href` from `$attrs` and uses renderless NuxtLink for internal routes |

All wrappers add a `to` prop accepting a Vue Router `RouteLocationRaw`:

```vue
<SdsLink to="/about">About</SdsLink>
<SdsActionButton :to="{ name: 'settings' }">Settings</SdsActionButton>
```

The existing `href` prop continues to work. Internal hrefs (e.g., `/about`, `features/overview`) are automatically detected and routed through NuxtLink. External URLs, `mailto:`, `tel:`, and anchor links behave normally.

## File Structure

```
sds-base-layer/
  nuxt.config.ts                              # Layer config (CSS, transpile, Tailwind, extends sds-nuxt-link)
  package.json                                # @cmu-sei/sds-base-layer
  app/
    plugins/
      sei-design-system.ts                    # Global SDS registration + Volar types
    assets/
      css/
        main.css                              # Tailwind CSS entry point
  layers/
    sds-nuxt-link/                            # NuxtLink wrapper sub-layer
      nuxt.config.ts
      composables/
        useIsInternalRoute.ts                 # Route classification composable
      components/
        SdsLink.vue
        SdsNavigationItem.vue
        SdsActionButton.vue
        SdsDropdownItem.vue
```

## Dependencies

| Package | Purpose |
|---|---|
| `@cmu-sei/sei-design-system` | SDS component library |
| `tailwindcss` | Utility-first CSS framework |
| `@tailwindcss/vite` | Tailwind CSS Vite plugin |
| `@tailwindcss/forms` | Form element reset (required by SDS Tailwind config) |

## Requirements

- Nuxt 4+
- Node 22+ (see `.nvmrc`)
