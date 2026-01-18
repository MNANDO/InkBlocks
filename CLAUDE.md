# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install              # Install dependencies
pnpm run dev:basic        # Run example app with HMR
pnpm build                # Build all packages
pnpm build:clean          # Clean and rebuild
pnpm lint                 # Run ESLint across all packages
pnpm test                 # Run Vitest tests
pnpm format               # Format with Prettier
pnpm graph                # Visualize Nx dependency graph
```

## Architecture

InkBlocks is a Lexical-based rich text editor with a two-package monorepo structure:

### Package Hierarchy

```
@inkblocks/core   →   @inkblocks/react   →   App
(headless)            (UI components)         (examples/basic)
```

- **@inkblocks/core**: Lexical editor configuration, node definitions, and core extension. No React dependencies.
- **@inkblocks/react**: React components, hooks, and plugins. Depends on core via `workspace:*`.

### Extension System

Built on Lexical's extension pattern using `defineExtension()`:
- `InkBlocksCoreExtension` (core): Defines nodes and dependencies
- `InkBlocksReactExtension` (react): Wraps core with React-specific configuration

### Block Definition Pattern

Blocks are defined via `ReactBlockDefinition` type in `packages/react/src/blocks.tsx`:
- Properties: `id`, `title`, `icon` (Lucide), `keywords`, `category`
- `insert()` callback executes Lexical commands
- Categories: basic, headings, lists, quotes, dividers, alignment, advanced

### Plugin Architecture

Plugins live in `packages/react/src/plugins/`:
- `BlockPickerPlugin`: Slash-command menu triggered with `/`
- `FloatingToolbarPlugin`: Text formatting toolbar
- `DraggableBlockPlugin`: Block drag-and-drop

### Editor Instantiation Flow

1. App calls `useCreateInkBlocks()` hook
2. Creates `InkBlocksReactEditor` instance
3. Initializes extensions with block definitions
4. Renders via `InkBlocksEditorView` component wrapped in `LexicalExtensionComposer`

## Build System

- **Nx** for task orchestration with Vite and ESLint plugins
- **Vite** library builds outputting ES + CJS with TypeScript declarations
- Outputs: `/dist/`, `/types/`, bundled `style.css`

## Styling

- CSS class prefix: `ib-*` for editor elements
- Theme classes: `InkBlocksTheme__*`
- Each package bundles its own `style.css`

## Code Style Rules

- **No `any` type**: Never use the `any` type in TypeScript. Use proper types, generics, `unknown`, or specific type definitions instead.
- **Icons**: Only use `lucide-react` for icons. Do not use other icon libraries.
