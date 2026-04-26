# Permission Demo And Bundle Split Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated permission demo page to `front/V3` and reduce the oversized production entry chunk through conservative vendor splitting.

**Architecture:** Reuse the current mock permission system and menu pipeline for the demo page so the new screen validates the same runtime path as the rest of Base. Keep bundle optimization inside Vite build config with `manualChunks` so the change stays low-risk and easy to reason about.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vue Router, Element Plus, Vite

---

### Task 1: Add permission demo route and mock permissions

**Files:**

- Modify: `front/V3/src/mock/data/auth.ts`
- Modify: `front/V3/src/mock/data/menus.ts`
- Modify: `front/V3/src/mock/__tests__/contracts.spec.ts`

**Step 1:** Extend mock permissions for `admin` and `editor`.
**Step 2:** Add a menu item for the permission demo page.
**Step 3:** Update mock contract tests to verify the new page permission contract.
**Step 4:** Run focused tests.

### Task 2: Build the permission demo page

**Files:**

- Create: `front/V3/src/views/demo/permission/index.vue`
- Modify: `front/V3/doc/00-base-completion-summary.md`
- Modify: `front/V3/README.md`

**Step 1:** Create the new page with account summary, ability cards, button permission demo, and permission matrix.
**Step 2:** Reuse `v-permission` and `usePermission()` directly in page code.
**Step 3:** Update docs so the example page is discoverable.
**Step 4:** Run lint and tests.

### Task 3: Split the production bundle

**Files:**

- Modify: `front/V3/vite.config.ts`

**Step 1:** Add `build.rollupOptions.output.manualChunks`.
**Step 2:** Split framework, Element Plus, icons, and utility vendors.
**Step 3:** Rebuild and compare output.

### Task 4: Full verification

**Files:**

- Verify only

**Step 1:** Run `pnpm test`.
**Step 2:** Run `pnpm lint`.
**Step 3:** Run `pnpm stylelint`.
**Step 4:** Run `pnpm build`.
**Step 5:** Record any remaining bundle warnings or follow-up opportunities.
