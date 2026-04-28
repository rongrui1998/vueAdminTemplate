# V2 Role Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a usable V2 Standard role-management module with mock/API role CRUD and menu permission assignment.

**Architecture:** Add a system-role API layer and mock module on the frontend, replace the current placeholder role page with a standard table plus dialogs, and add backend role service/routes backed by `backend/data/roles.json`. Role menu authorization derives permission codes from selected menu ids.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Pinia, Vitest, Node.js HTTP server, JSON file persistence.

---

### Task 1: Role Page Test

**Files:**

- Create: `front/V2/src/views/system/role/__tests__/index.spec.ts`

**Steps:**

- Write a failing test that mocks `@/api/system-role` and `@/api/system-menu`.
- Assert the page renders a standard role table, admin/editor roles, actions, and opens the permission dialog.
- Run `pnpm test -- --runInBand src/views/system/role/__tests__/index.spec.ts` and confirm it fails because the page is still a placeholder.

### Task 2: Role Frontend API And Mock

**Files:**

- Create: `front/V2/src/types/system-role.ts`
- Create: `front/V2/src/api/system-role.ts`
- Create: `front/V2/src/mock/data/system-role.ts`
- Create: `front/V2/src/mock/modules/system-role.ts`

**Steps:**

- Add role query, payload, menu payload, and record types.
- Add `list/create/update/delete/updateMenus` API functions.
- Add mock role data and CRUD behavior.
- Derive permissions from selected menu ids.

### Task 3: Role Page Implementation

**Files:**

- Modify: `front/V2/src/views/system/role/index.vue`
- Create: `front/V2/src/views/system/role/components/RoleFormDialog.vue`
- Create: `front/V2/src/views/system/role/components/RolePermissionDialog.vue`

**Steps:**

- Replace placeholder content with a standard `el-card + el-table` page.
- Add create/edit/delete/status actions.
- Add permission dialog with `el-tree` checkboxes.
- Use `usePermission()` for button disabling.
- Run the role page test and make it pass.

### Task 4: Backend Role API

**Files:**

- Create: `backend/src/services/role.js`
- Modify: `backend/src/server.js`
- Modify: `backend/data/roles.json`
- Modify: `backend/data/menus.json`
- Modify: `backend/tests/server.test.mjs`

**Steps:**

- Normalize existing roles with status, sort, createdAt, and remark.
- Add role list/create/update/delete/updateMenus service functions.
- Add HTTP routes under `/api/system/roles`.
- Add backend tests for role list and permission update.

### Task 5: Verification

**Commands:**

- `cd front/V2 && pnpm test`
- `cd front/V2 && pnpm lint`
- `cd front/V2 && pnpm stylelint`
- `cd front/V2 && pnpm build`
- `node --test backend/tests/server.test.mjs`

**Expected:** All pass. Known warnings may remain for Dart Sass legacy JS API and Node JSON module imports.
