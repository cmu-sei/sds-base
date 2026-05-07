# @cmu-sei/sds-base

A Nuxt 4 layer that provides a one-line installation of the [SEI Design System](https://designsystem.sei.cmu.edu/) for any Nuxt application. It handles global component registration, CSS setup (including Open Sans and Tailwind CSS), build transpilation, and client-side routing wrappers for SDS navigation components.

## What's Included

- **Global SDS component registration** via a Nuxt plugin — all 54+ SDS components are available in templates without explicit imports
- **Volar type support** for SDS components in your IDE
- **CSS configuration** — Open Sans font, SDS component styles, and Tailwind CSS (with `@tailwindcss/forms`)
- **Build transpilation** for `@cmu-sei/sei-design-system`

## Quick Start

```bash
npm install @cmu-sei/sds-base
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@cmu-sei/sds-base']
})
```

That's it. All SDS components and styles are now available in your application.

## Setting Up a New Project from Scratch

Below is a complete walkthrough for creating a new Nuxt app that uses `sds-base`. These are the exact steps used to create and verify the initial test project.

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
    "@cmu-sei/sds-base: "^0.1.0"
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
  extends: ['@cmu-sei/sds-base'],
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

When combining `sds-base` with other Nuxt layers, list it first in the `extends` array so that higher-level layers can build on the SDS foundation it provides:

```ts
export default defineNuxtConfig({
  extends: [
    '@cmu-sei/sds-base',
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

## File Structure

```
sds-base/
  nuxt.config.ts                              # Layer config (CSS, transpile, Tailwind)
  package.json                                # @cmu-sei/sds-base
  app/
    plugins/
      sei-design-system.ts                    # Global SDS registration + Volar types
    assets/
      css/
        main.css                              # Tailwind CSS entry point
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
