# V2 User Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a usable V2 Standard user-management module with mock/API user CRUD and role binding.

**Architecture:** Add a system-user API layer and mock module on the frontend, replace the current placeholder user page with a standard table plus form dialog, and add backend user service/routes backed by `backend/data/users.json`. User permissions remain derived from assigned roles.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Pinia, Vitest, Node.js HTTP server, JSON file persistence.

---

### Task 1: User Page Test

**Files:**

- Create: `front/V2/src/views/system/user/__tests__/index.spec.ts`

**Steps:**

- Write a failing test that mocks `@/api/system-user` and `@/api/system-role`.
- Assert the page renders a standard user table, admin/editor users, actions, and opens the create dialog with role options.

### Task 2: User Frontend API And Mock

**Files:**

- Create: `front/V2/src/types/system-user.ts`
- Create: `front/V2/src/api/system-user.ts`
- Create: `front/V2/src/mock/data/system-user.ts`
- Create: `front/V2/src/mock/modules/system-user.ts`

**Steps:**

- Add user query, payload, password reset payload, and record types.
- Add `list/create/update/delete/resetPassword` API functions.
- Add mock user data and CRUD behavior.

### Task 3: User Page Implementation

**Files:**

- Modify: `front/V2/src/views/system/user/index.vue`
- Create: `front/V2/src/views/system/user/components/UserFormDialog.vue`

**Steps:**

- Replace placeholder content with a standard `el-card + el-table` page.
- Add create/edit/delete/status/reset-password actions.
- Add role multi-select to the form dialog.
- Use `usePermission()` for button disabling.

### Task 4: Backend User API

**Files:**

- Create: `backend/src/services/user.js`
- Modify: `backend/src/server.js`
- Modify: `backend/data/users.json`
- Modify: `backend/data/roles.json`
- Modify: `backend/data/menus.json`
- Modify: `backend/tests/server.test.mjs`

**Steps:**

- Normalize existing users with status, timestamps, and remark.
- Add user list/create/update/delete/resetPassword service functions.
- Add HTTP routes under `/api/system/users`.
- Add backend tests for user list and role assignment.

### Task 5: Verification

**Commands:**

- `cd front/V2 && pnpm test`
- `cd front/V2 && pnpm lint`
- `cd front/V2 && pnpm stylelint`
- `cd front/V2 && pnpm build`
- `node --test backend/tests/server.test.mjs`

**Expected:** All pass. Known warnings may remain for Dart Sass legacy JS API and Node JSON module imports.
