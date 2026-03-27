# Vera Monorepo

A full-stack monorepo starter **specialized for Next.js + Bun/Elysia** stacks, built with **NX**, **Next.js 16**, **Elysia** (Bun), **Drizzle ORM**, and **Shadcn UI** — wired up and ready to ship.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Workspace Packages](#workspace-packages)
- [Getting Started](#getting-started)
- [NX: Running Tasks](#nx-running-tasks)
- [NX: Generators](#nx-generators)
- [NX: Useful Commands](#nx-useful-commands)
- [Path Aliases](#path-aliases)
- [Elysia Tooling](#elysia-tooling)

---

## Tech Stack

### Frontend — `apps/vera-ai`

| Technology | Version | Role |
| --- | --- | --- |
| [Next.js](https://nextjs.org) | 16.x | React framework, App Router, RSC |
| [React](https://react.dev) | 19.x | UI library |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS (v4 with CSS-first config) |
| [Shadcn UI](https://ui.shadcn.com) | 4.x | Accessible component primitives |

### Backend — `apps/vera-api`

| Technology | Version | Role |
| --- | --- | --- |
| [Elysia](https://elysiajs.com) | latest | Type-safe HTTP framework |
| [Bun](https://bun.sh) | latest | JS runtime + package manager for API |

### Shared / Tooling

| Technology | Version | Role |
| --- | --- | --- |
| [NX](https://nx.dev) | 22.x | Monorepo build system, caching, task graph |
| [pnpm](https://pnpm.io) | latest | Workspace package manager |
| [TypeScript](https://typescriptlang.org) | 5.9.x | Strict mode across the stack |
| [Vite](https://vitejs.dev) | 7.x | Library build tool |
| [Vitest](https://vitest.dev) | 4.x | Unit testing |
| [Playwright](https://playwright.dev) | latest | End-to-end testing |
| [ESLint](https://eslint.org) | 9.x | Flat config linting |
| [Prettier](https://prettier.io) | 3.x | Code formatting |

---

## Project Structure

Inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react). Features are co-located, shared code lives in `libs/`, apps stay thin.

```text
vera-monorepo/
│
├── apps/                          # Deployable applications
│   ├── vera-ai/                   # Next.js frontend (App Router)
│   │   ├── src/
│   │   │   └── app/               # Next.js App Router pages & layouts
│   │   ├── public/                # Static assets
│   │   ├── next.config.js
│   │   └── postcss.config.js
│   │
│   ├── vera-ai-e2e/               # Playwright E2E tests for vera-ai
│   │
│   └── vera-api/                  # Elysia API (runs on Bun)
│       └── src/
│           └── index.ts           # API entrypoint
│
├── libs/                          # Shared workspace libraries
│   ├── ui/                        # @vera-common/ui
│   │   └── src/
│   │       ├── lib/               # Shadcn components (50+ components)
│   │       └── styles/            # globals.css (Tailwind v4 entry)
│   │
│   ├── hooks/                     # @vera-common/hooks
│   │   └── src/lib/               # Shared React hooks
│   │
│   ├── utils/                     # @vera-common/utils
│   │   └── src/lib/               # Shared utility functions (cn, etc.)
│   │
│   └── lib/                       # @vera-common/lib
│       └── src/lib/               # Shared business logic helpers
│
├── tools/                         # Workspace tooling
│   └── elysia/                    # Custom NX plugin for Elysia apps
│       ├── src/
│       │   ├── executors/         # Custom NX executors
│       │   └── plugins/           # NX project graph plugin
│       └── plugin.ts
│
├── components.json                # Shadcn UI configuration
├── nx.json                        # NX workspace configuration
├── tsconfig.base.json             # Shared TypeScript config + path aliases
├── pnpm-workspace.yaml            # pnpm workspace definition
└── package.json                   # Root dependencies
```

### Feature Co-location Pattern (inside apps)

When building features inside an app, follow this structure:

```text
apps/vera-ai/src/
├── app/                           # Next.js routing (pages, layouts, routes)
│   ├── (auth)/                    # Route groups
│   ├── dashboard/
│   └── layout.tsx
│
├── features/                      # Feature modules (co-located)
│   └── [feature-name]/
│       ├── components/            # Feature-specific components
│       ├── hooks/                 # Feature-specific hooks
│       ├── actions/               # Server actions
│       └── types.ts               # Feature types
│
├── components/                    # App-wide shared components
└── lib/                           # App-wide utilities
```

**Rule of thumb:** If it's used in only one feature → put it in `features/`. If shared across features → put it in `components/` or `lib/`. If shared across apps → promote it to `libs/`.

---

## Workspace Packages

| Package | Path | Import |
| --- | --- | --- |
| UI Components | `libs/ui` | `@vera-common/ui` or `@vera-common/ui/<component>` |
| Global Styles | `libs/ui/src/styles` | `@vera-common/styles/globals.css` |
| React Hooks | `libs/hooks` | `@vera-common/hooks` |
| Utilities | `libs/utils` | `@vera-common/utils` |
| Shared Logic | `libs/lib` | `@vera-common/lib` |

All packages resolve to source files in development via the `@vera-monorepo/source` custom condition in `tsconfig.base.json` — no build step needed during local dev.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 9
- [Bun](https://bun.sh) ≥ 1.x (for the API)

### Install

```sh
pnpm install
```

### Start Development

```sh
# Frontend (Next.js)
pnpm nx dev vera-ai

# Backend API (Elysia + Bun)
pnpm nx dev vera-api

# Both in parallel
pnpm nx run-many -t dev -p vera-ai,vera-api
```

---

## NX: Running Tasks

All tasks run through NX. **Never** call underlying tools (e.g. `next build`, `vitest`) directly — NX handles caching, dependency ordering, and parallelism.

> Prefix all `nx` commands with `pnpm` to avoid relying on a global install.

### Common targets

| Command | Description |
| --- | --- |
| `pnpm nx dev <project>` | Start dev server |
| `pnpm nx build <project>` | Production build |
| `pnpm nx start <project>` | Start production server |
| `pnpm nx test <project>` | Run unit tests |
| `pnpm nx lint <project>` | Run ESLint |
| `pnpm nx typecheck <project>` | Run TypeScript type checking |
| `pnpm nx e2e <project>-e2e` | Run E2E tests |

### Run across multiple projects

```sh
# Run a target on all projects
pnpm nx run-many -t build

# Run a target on specific projects
pnpm nx run-many -t test -p vera-ai,@vera-common/ui

# Run only on projects affected by current changes (great for CI)
pnpm nx affected -t build
pnpm nx affected -t test
pnpm nx affected -t lint
```

### Show available targets for a project

```sh
pnpm nx show project vera-ai
pnpm nx show project @vera-common/ui
```

### Visualize the project dependency graph

```sh
pnpm nx graph
```

---

## NX: Generators

Generators scaffold code consistently. Always use them instead of creating files manually.

> **Tip:** Install the [NX Console VSCode extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) for a GUI over all generators.

### Applications

```sh
# Generate a new Next.js app
pnpm nx g @nx/next:app apps/<name>

# Generate a new Node app (for additional API services)
pnpm nx g @nx/node:app apps/<name>
```

### Libraries

```sh
# Generate a new React library (Vite, Vitest)
pnpm nx g @nx/react:lib libs/<name>

# Generate a new TypeScript library (no framework)
pnpm nx g @nx/js:lib libs/<name>
```

### Components & Code

```sh
# Generate a React component inside a library
pnpm nx g @nx/react:component --project=<lib-name> --name=<ComponentName>

# Add Shadcn components to the UI library
pnpm nx g @nx/react:component --project=ui --directory=src/lib --name=<name>

# Or use the shadcn CLI directly (components land in libs/ui/src/lib)
pnpm shadcn add <component-name>
```

### Shadcn Components

The workspace is pre-configured for Shadcn via `components.json` at the repository root. The configuration is compatible with any component source — the official [shadcn/ui registry](https://ui.shadcn.com/docs/components), third-party registries, and community registries all work out of the box.

> **Always run the shadcn CLI from the workspace root.** The `components.json` at the root tells the CLI where to place files (`libs/ui/src/lib/`), which aliases to use, and which Tailwind config applies. Running it from inside a sub-directory will miss this config.

```sh
# Add a single component (official registry)
pnpm shadcn add button

# Add multiple components
pnpm shadcn add dialog sheet command

# Add all available components
pnpm shadcn add --all

# Add a component from a third-party / community registry URL
pnpm shadcn add https://ui.aceternity.com/registry/moving-cards.json
```

Components land in `libs/ui/src/lib/` and are immediately importable via `@vera-common/ui/<component-name>`.

See the [shadcn CLI docs](https://ui.shadcn.com/docs/cli) and [registry docs](https://ui.shadcn.com/docs/registry) for the full list of options.

### E2E Test Projects

```sh
# Playwright E2E (for Next.js apps)
pnpm nx g @nx/playwright:configuration --project=<app-name>
```

### List all available generators

```sh
# List all installed plugins and their generators
pnpm nx list

# List generators for a specific plugin
pnpm nx list @nx/react
pnpm nx list @nx/next
pnpm nx list @nx/js
```

---

## NX: Useful Commands

### Cache

NX caches task outputs automatically. Cached tasks show `[local cache]` in output.

```sh
# Clear the local NX cache
pnpm nx reset

# Skip cache for a single run
pnpm nx build vera-ai --skip-nx-cache
```

### Project info & dependencies

```sh
# Show all projects in the workspace
pnpm nx show projects

# Show project details and all targets
pnpm nx show project <name> --web

# Check what is affected by changes on this branch
pnpm nx show projects --affected

# Print the dependency graph as JSON
pnpm nx graph --file=output.json
```

### CI setup

```sh
# Connect to Nx Cloud (remote caching + task distribution)
pnpm nx connect

# Generate a CI workflow (GitHub Actions, CircleCI, etc.)
pnpm nx g ci-workflow
```

---

## Elysia Tooling

The workspace ships with a custom Nx plugin at `tools/elysia/` that auto-wires Elysia apps into the Nx task graph — no manual `project.json` target configuration needed.

The plugin is **modelled after `@nx/next/plugin`**: it implements the `CreateNodesV2` API, globs for `package.json` files, detects projects that depend on `elysia`, and injects the three standard targets automatically.

### How it works

1. **Project detection** — scans every `package.json` in the workspace; skips `node_modules` and any project that does not list `elysia` as a dependency.
2. **Target injection** — for every matched Elysia project three targets are registered in the Nx task graph:

| Target | Command | Notes |
| --- | --- | --- |
| `dev` | `bun run --hot <entry>` | Hot-reload dev server, `continuous: true` |
| `build` | `bun build --compile --minify-* --target bun --outfile dist/server <entry>` | Compiles to a standalone binary, cached, depends on `^build` |
| `start` | `./dist/server` | Runs the compiled binary, depends on `build` |

3. **Entry point resolution** — prefers `src/main.ts`; falls back to `src/index.ts`.
4. **Result caching** — target configs are hashed and stored in `workspaceDataDirectory` so repeated Nx runs skip recalculation.

### Plugin options (`nx.json`)

```json
{
  "plugin": "@vera-monorepo/elysia/plugin",
  "options": {
    "devTargetName": "dev",
    "buildTargetName": "build",
    "startTargetName": "start",
    "port": 3000
  }
}
```

All option keys are optional — the defaults above apply when omitted.

### Plugin structure

```text
tools/elysia/
├── src/
│   ├── plugins/
│   │   ├── plugin.ts          # CreateNodesV2 implementation
│   │   └── plugin.spec.ts     # Vitest unit tests
│   └── executors/
│       └── echo/              # Example custom executor
├── plugin.ts                  # Public entry point
└── executors.json             # Executor manifest
```

---

## Path Aliases

Defined in `tsconfig.base.json`. All source files in `libs/` are available with zero build step in development.

```ts
// UI components — import individual files (tree-shakeable)
import { Button } from '@vera-common/ui/button'
import { Card, CardContent } from '@vera-common/ui/card'

// Global styles
import '@vera-common/styles/globals.css'

// Utilities
import { cn } from '@vera-common/utils'

// Hooks
import { useIsMobile } from '@vera-common/hooks'

// Shared business logic
import { something } from '@vera-common/lib'
```

