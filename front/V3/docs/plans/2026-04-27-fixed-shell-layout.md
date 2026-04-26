# Fixed Shell Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将后台布局改为左侧和顶部固定，仅中间主内容区域滚动。

**Architecture:** 保持现有双栏布局结构，通过固定外层高度和关闭 `body` 滚动，把滚动链路转移到 `el-main`。左侧菜单继续使用 `el-scrollbar`，右侧头部和标签栏保持在滚动容器之外，主内容区单独承载超长页面滚动。

**Tech Stack:** Vue 3、Element Plus Layout、SCSS、现有 scoped 样式

---

### Task 1: Global Scroll Container

**Files:**

- Modify: `front/V3/src/styles/reset.scss`

**Step 1: Lock root height**

Set `html`, `body`, and `#app` to explicit full height.

**Step 2: Disable outer page scroll**

Set `body` overflow to hidden so scroll moves inside the app shell.

**Step 3: Verify**

Run: `pnpm lint`
Expected: PASS

### Task 2: App Layout Scroll Chain

**Files:**

- Modify: `front/V3/src/layout/index.vue`

**Step 1: Fix app shell height**

Set the app layout to `height: 100vh` and hide overflow.

**Step 2: Move scrolling to main content**

Use flex column, `min-height: 0`, and `overflow: auto` on the main area only.

**Step 3: Keep sidebar self-scrolling**

Preserve sidebar internal scrollbar behavior.

**Step 4: Verify**

Run: `pnpm lint`
Expected: PASS

### Task 3: Final Validation

**Files:**

- Modify: `front/V3/src/layout/index.vue`
- Modify: `front/V3/src/styles/reset.scss`

**Step 1: Build**

Run: `pnpm build`
Expected: PASS

**Step 2: Lint**

Run: `pnpm lint`
Expected: PASS
