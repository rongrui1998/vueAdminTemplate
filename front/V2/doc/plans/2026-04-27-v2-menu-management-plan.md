# V2 Menu Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a real menu-management module for `front/V2` with a dark tree table, create/edit/delete dialogs, and aligned mock/API CRUD contracts.

**Architecture:** Replace the current placeholder page with a tree-table based management screen. Keep menu data centered on the existing `BackendMenuItem` structure, add CRUD endpoints in the frontend API/mock/backend layers, and isolate the form dialog so menu-type-specific fields stay maintainable.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Vite, Vitest, Node.js, JSON file storage

---

### Task 1: Extend the menu data contract

**Files:**

- Modify: `front/V2/src/types/system-menu.ts`
- Modify: `front/V2/src/types/menu.ts`
- Modify: `backend/data/menus.json`

**Step 1: Define query, payload, and response types**

- Add `SystemMenuType`
- Add `SystemMenuQuery`
- Add `SystemMenuPayload`
- Add a lightweight `SystemMenuFormMode`

**Step 2: Keep the backend menu contract single-sourced**

- Reuse `BackendMenuItem` as the main record shape
- Only add optional fields needed by the form, such as `remark`

**Step 3: Verify types compile**

Run: `cd front/V2 && pnpm test -- --runInBand src/constants/__tests__/standard.spec.ts`
Expected: PASS and no TypeScript errors from menu types

### Task 2: Add frontend menu CRUD API methods

**Files:**

- Modify: `front/V2/src/api/system-menu.ts`

**Step 1: Add create/update/delete request methods**

- `createSystemMenuApi`
- `updateSystemMenuApi`
- `deleteSystemMenuApi`

**Step 2: Keep request payload signatures aligned with backend routes**

- POST `/system/menus`
- PUT `/system/menus/:id`
- DELETE `/system/menus/:id`

**Step 3: Verify API module imports resolve**

Run: `cd front/V2 && pnpm test -- --runInBand src/views/system/menu/__tests__/index.spec.ts`
Expected: current tests fail only because UI has not been updated yet, not because API imports are missing

### Task 3: Build mock CRUD support for menus

**Files:**

- Modify: `front/V2/src/mock/data/system-menu.ts`
- Modify: `front/V2/src/mock/modules/system-menu.ts`
- Test: `front/V2/src/mock/__tests__/contracts.spec.ts`

**Step 1: Add mutable in-memory tree helpers**

- clone tree
- find node
- insert child/root
- update node
- delete node recursively

**Step 2: Expose mock CRUD routes**

- GET `/api/system/menus`
- POST `/api/system/menus`
- PUT `/api/system/menus/:id`
- DELETE `/api/system/menus/:id`

**Step 3: Add contract assertions**

- verify menu IDs remain unique after mutations
- verify list route still returns tree data

**Step 4: Run focused tests**

Run: `cd front/V2 && pnpm test -- --runInBand src/mock/__tests__/contracts.spec.ts`
Expected: PASS

### Task 4: Create the reusable menu form dialog

**Files:**

- Create: `front/V2/src/views/system/menu/components/MenuFormDialog.vue`
- Create: `front/V2/src/views/system/menu/constants.ts`
- Test: `front/V2/src/views/system/menu/__tests__/MenuFormDialog.spec.ts`

**Step 1: Write the failing dialog test**

- open with create mode
- switch type to `button`
- assert route/component fields hide
- assert permission field remains

**Step 2: Implement minimal dialog shell**

- form model
- visible prop
- mode prop
- submit/cancel emits

**Step 3: Add menu-type-specific field visibility**

- directory
- menu
- button

**Step 4: Add validation rules**

- title required
- permission required for button/menu
- path/component required only when relevant

**Step 5: Run focused tests**

Run: `cd front/V2 && pnpm test -- --runInBand src/views/system/menu/__tests__/MenuFormDialog.spec.ts`
Expected: PASS

### Task 5: Replace the placeholder page with a tree table

**Files:**

- Modify: `front/V2/src/views/system/menu/index.vue`
- Test: `front/V2/src/views/system/menu/__tests__/index.spec.ts`

**Step 1: Rewrite the page test first**

- expect toolbar buttons
- expect tree-table columns
- expect row actions
- expect dialog opens on `新增菜单`

**Step 2: Replace intro cards with management layout**

- header toolbar
- tree table
- loading/error/empty states

**Step 3: Add row rendering details**

- icon + title
- type tags
- permission text
- route path
- component path
- actions

**Step 4: Add expand/collapse handling**

- track expanded keys
- support one-click expand/collapse all

**Step 5: Run focused tests**

Run: `cd front/V2 && pnpm test -- --runInBand src/views/system/menu/__tests__/index.spec.ts`
Expected: PASS

### Task 6: Connect create/edit/delete interactions

**Files:**

- Modify: `front/V2/src/views/system/menu/index.vue`
- Modify: `front/V2/src/views/system/menu/components/MenuFormDialog.vue`
- Test: `front/V2/src/views/system/menu/__tests__/index.spec.ts`

**Step 1: Add dialog state management**

- create root
- create child
- edit current row

**Step 2: Submit through API methods**

- POST for create
- PUT for update
- reload list after success

**Step 3: Add delete confirmation flow**

- confirm recursive delete
- call delete API
- refresh table after success

**Step 4: Extend tests for CRUD interactions**

- create success
- edit success
- delete success

**Step 5: Run focused tests**

Run: `cd front/V2 && pnpm test -- --runInBand src/views/system/menu/__tests__/index.spec.ts`
Expected: PASS

### Task 7: Add backend menu CRUD routes

**Files:**

- Modify: `backend/src/services/menu.js`
- Modify: `backend/src/server.js`
- Test: `backend/tests/server.test.mjs`

**Step 1: Add backend tree mutation helpers**

- read menus
- create node
- update node
- delete node recursively

**Step 2: Expose backend CRUD routes**

- `GET /api/system/menus`
- `POST /api/system/menus`
- `PUT /api/system/menus/:id`
- `DELETE /api/system/menus/:id`

**Step 3: Add backend tests**

- create menu under parent
- update menu name/permission
- delete menu node

**Step 4: Run backend test**

Run: `node --test backend/tests/server.test.mjs`
Expected: PASS

### Task 8: Verification and docs sync

**Files:**

- Modify: `front/V2/doc/10-standard-roadmap.md`
- Modify: `front/V2/README.md`
- Modify: `front/V2/doc/04-mock-and-api.md`

**Step 1: Update docs to reflect real menu management status**

- no longer call it placeholder or future work
- mention mock/api CRUD readiness

**Step 2: Run full frontend verification**

Run:

```bash
cd front/V2 && pnpm lint
cd front/V2 && pnpm stylelint
cd front/V2 && pnpm test
cd front/V2 && pnpm build
```

Expected: all PASS

**Step 3: Run full backend verification**

Run:

```bash
node --test backend/tests/server.test.mjs
```

Expected: PASS

**Step 4: Commit**

```bash
git add front/V2 backend
git commit -m "feat: build V2 menu management"
```
