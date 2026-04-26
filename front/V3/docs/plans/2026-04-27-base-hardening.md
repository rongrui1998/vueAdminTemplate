# V3 Base Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen `front/V3` with button-level permission utilities, a dedicated 403 flow, baseline automated tests, quality tooling, and a unified README.

**Architecture:** Reuse the existing auth/permission stores as the single permission source, add a thin directive/composable layer for view-level checks, and keep route semantics explicit with a dedicated forbidden page. Add lightweight test and quality tooling around the current Base chain instead of introducing broader architectural changes.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Pinia, Element Plus, Vitest, Stylelint, Husky, lint-staged

---

### Task 1: Add permission presentation helpers

**Files:**

- Create: `front/V3/src/directives/permission.ts`
- Create: `front/V3/src/composables/usePermission.ts`
- Modify: `front/V3/src/main.ts`
- Modify: `front/V3/src/types/global.d.ts`

**Step 1:** Write failing tests for permission helper behavior.
**Step 2:** Implement `usePermission()` as a thin wrapper around store permission checks.
**Step 3:** Implement `v-permission` directive for string / string[] values.
**Step 4:** Register the directive in app bootstrap and补类型声明。
**Step 5:** Run focused tests and fix any typing gaps.

### Task 2: Add 403 route semantics

**Files:**

- Create: `front/V3/src/views/error/403.vue`
- Modify: `front/V3/src/constants/route.ts`
- Modify: `front/V3/src/router/static-routes.ts`
- Modify: `front/V3/src/router/guards.ts`
- Modify: `front/V3/doc/03-permission-and-auth.md`
- Modify: `front/V3/doc/06-extension-suggestions.md`

**Step 1:** Write failing guard tests for forbidden-route behavior.
**Step 2:** Add a dedicated 403 route and page.
**Step 3:** Update guard redirect target from 404 to 403.
**Step 4:** Refresh docs so Base scope and Standard direction stay consistent.
**Step 5:** Re-run focused tests.

### Task 3: Add automated tests for core chains

**Files:**

- Create: `front/V3/vitest.config.ts`
- Create: `front/V3/src/router/__tests__/dynamic-routes.spec.ts`
- Create: `front/V3/src/router/__tests__/guards.spec.ts`
- Create: `front/V3/src/utils/__tests__/request.spec.ts`
- Create: `front/V3/src/mock/__tests__/contracts.spec.ts`
- Modify: `front/V3/src/utils/request.ts` only if testability needs a minimal extraction

**Step 1:** Add the Vitest config and test setup baseline.
**Step 2:** Write failing tests for route transform, guard redirects, request helpers, and mock contracts.
**Step 3:** Extract only the minimal helper functions needed to make request/guard logic testable.
**Step 4:** Run `pnpm test` until green.

### Task 4: Add quality tooling and unified README

**Files:**

- Create: `front/V3/.stylelintrc.cjs`
- Create: `front/V3/.husky/pre-commit`
- Create: `front/V3/README.md`
- Modify: `front/V3/package.json`
- Modify: `front/V3/pnpm-lock.yaml`

**Step 1:** Add failing script expectations by wiring `stylelint`, `test`, `prepare`, and `lint-staged` into `package.json`.
**Step 2:** Install dependencies and regenerate the lockfile.
**Step 3:** Add a minimal Stylelint config suitable for the current Vue + SCSS setup.
**Step 4:** Add a pre-commit hook that runs `lint-staged`.
**Step 5:** Write the unified README as the entry point to the existing docs.

### Task 5: Full verification

**Files:**

- Verify only

**Step 1:** Run `pnpm lint`.
**Step 2:** Run `pnpm stylelint`.
**Step 3:** Run `pnpm test`.
**Step 4:** Run `pnpm build`.
**Step 5:** Note any residual risks or intentional omissions in the final summary.
