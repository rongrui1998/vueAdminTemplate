# Nested Demo Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为“二级菜单示例”页面增加更丰富的业务信息内容，使其更像真实后台页面。

**Architecture:** 页面继续使用 `PageContainer + el-card` 结构，通过本地静态数据驱动多个信息区块。内容划分为概览卡片、双栏业务列表、最近操作表格三层，既保持信息密度，又避免引入超出 Base 范围的复杂依赖。

**Tech Stack:** Vue 3、TypeScript、Element Plus、现有 SCSS scoped 样式

---

### Task 1: Page Data Model

**Files:**

- Modify: `front/V3/src/views/demo/nested/index.vue`

**Step 1: Define local page data**

Create local arrays for:

- overview cards
- project progress list
- pending todo list
- recent activity records

**Step 2: Verify shape**

Run: `pnpm lint`
Expected: PASS

### Task 2: Page Layout

**Files:**

- Modify: `front/V3/src/views/demo/nested/index.vue`

**Step 1: Replace simple feature grid**

Build:

- overview card row
- project progress card
- todo card
- recent activity table

**Step 2: Add minimal styles**

Keep responsive layout and moderate visual density.

**Step 3: Verify**

Run: `pnpm lint`
Expected: PASS

### Task 3: Final Validation

**Files:**

- Modify: `front/V3/src/views/demo/nested/index.vue`

**Step 1: Review responsive layout**

Ensure the page still works on mobile and desktop widths.

**Step 2: Run build**

Run: `pnpm build`
Expected: PASS

**Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS
