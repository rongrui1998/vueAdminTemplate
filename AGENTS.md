# AGENTS.md

This file is for Codex / Claude / other coding agents that open this repository in a fresh window. Read it before making changes.

## Project Positioning

This repository is a Vue admin template workspace.

- `front/V3` is the Base version. It is the more mature Base baseline.
- `front/V2` is the Standard version workspace. This is the current main development target.
- `backend` is a minimal Node.js backend that stores data in JSON files for validating real account, role, menu, and permission flows.

When the user asks to continue product work, assume the active target is usually `front/V2` plus `backend`, unless they explicitly mention `V3`.

## Important Directories

- `front/V2/src/views/system`: Standard system pages, including user, role, and menu management.
- `front/V2/src/views/demo`: Business demos, component demos, CRUD demo, permission demo, import/export demo.
- `front/V2/src/components`: Shared template components such as `SearchForm`, `ProTable`, `ModalForm`, `DrawerForm`.
- `front/V2/src/mock`: Vite mock modules and mock seed data.
- `front/V2/src/router`: Static routes, dynamic route generation, route component mapping, guards.
- `front/V2/src/store`: Pinia auth, permission, tabs, app state.
- `front/V2/doc`: V2 documentation and plans.
- `front/V3/doc`: V3 Base documentation.
- `backend/data`: JSON seed data for API mode.
- `backend/src`: Node.js backend service code.

## Current Main Capabilities

`front/V3` Base is complete enough to serve as a baseline.

`front/V2` Standard currently includes:

- Login and user info flow.
- Dynamic menu and dynamic route generation.
- Page-level permission fallback.
- Button-level permission directive.
- User management.
- Role management.
- Menu management.
- Mock/API switch for Standard modules.
- Node.js JSON backend for real API validation.
- Account, role, menu, and permission closed-loop validation.
- Component demos for `SearchForm`, `ProTable`, `ModalForm`, and `DrawerForm`.
- Import/export demo with CSV import preview and CSV export.
- CRUD demo and permission demo.

## Common Commands

Frontend V2:

```bash
cd front/V2
pnpm dev
pnpm test
pnpm lint
pnpm stylelint
pnpm build
```

Backend:

```bash
cd backend
npm run dev
npm test
```

Run checks from the package directory, not from the repository root, unless the command is known to support workspace execution.

## Environment Modes

Mock mode:

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3100
VITE_USE_MOCK=true
VITE_MENU_SOURCE=mock
VITE_STANDARD_DATA_SOURCE=mock
```

API mode:

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3100
VITE_USE_MOCK=false
VITE_MENU_SOURCE=api
VITE_STANDARD_DATA_SOURCE=api
```

In API mode, start `backend` first, then start `front/V2`.

## Menu And Permission Rules

Dynamic pages are driven by backend/mock menu records.

When adding a new menu page, keep these in sync:

- `front/V2/src/mock/data/menus.ts`
- `front/V2/src/mock/data/system-menu.ts`
- `front/V2/src/mock/data/system-role.ts`
- `backend/data/menus.json`
- `backend/data/roles.json`
- actual view file under `front/V2/src/views`

The `component` field must match a real view path under `front/V2/src/views`, without `.vue`.

Example:

```ts
component: 'demo/components/search-form/index'
```

must correspond to:

```text
front/V2/src/views/demo/components/search-form/index.vue
```

If the component path is missing, the app falls back to `route-missing.vue`.

## Shared Component Rules

The shared components are optional productivity wrappers, not mandatory replacements for Element Plus.

- Use `SearchForm` for common list filters.
- Use `ProTable` for common table loading/error/empty shells.
- Use `ModalForm` for common create/edit dialog forms.
- Use `DrawerForm` for detail, preview, and complex side-panel content.

For highly custom interactions, use native Element Plus components directly.

## Confirmation Dialog Rule

Do not use `window.confirm` in business pages.

Use:

```ts
import { confirmAction, confirmDelete } from '@/utils/confirm';
```

Current users:

- User management delete and password reset.
- Role management delete.
- Menu management delete.
- CRUD demo delete.

The MessageBox style depends on:

```ts
import 'element-plus/theme-chalk/el-message-box.css';
```

in `front/V2/src/main.ts`.

## Testing Expectations

For feature or bugfix work in `front/V2`, prefer adding or updating tests first.

Useful test locations:

- `front/V2/src/mock/__tests__/contracts.spec.ts`
- `front/V2/src/router/__tests__`
- `front/V2/src/views/system/*/__tests__`
- `front/V2/src/components/*/__tests__`
- `front/V2/src/utils/__tests__`

Before claiming work is complete, run the relevant checks. For broad V2 changes, use:

```bash
cd front/V2
pnpm test
pnpm lint
pnpm stylelint
pnpm build
```

For backend changes, also run:

```bash
cd backend
npm test
```

Known warning: `stylelint` / `build` may show a Sass legacy JS API warning. It is currently non-blocking if the command exits successfully.

## Git Safety

Always check:

```bash
git status --short
```

before editing. The worktree may contain user changes or unfinished previous-agent work.

Do not revert unrelated changes. Do not use destructive git commands unless the user explicitly asks.

Commit only when the user asks.

## Current Direction

The likely next Standard features are:

- Operation logs / permission audit examples.
- Import/export upgrade from frontend CSV demo to backend-backed flow.
- More Standard documentation.
- Additional reusable business page templates.

Dictionary management was explicitly deprioritized earlier, so do not start it unless the user asks.

