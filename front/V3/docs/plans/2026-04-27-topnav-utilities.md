# TopNav Utilities Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Base 版后台顶部导航增加全屏按钮和本地消息中心下拉面板。

**Architecture:** 由 `TopNav.vue` 承载入口按钮和开关状态，`useFullscreen.ts` 负责浏览器全屏能力，`NotificationPanel.vue` 负责展示消息列表和操作。消息数据采用本地静态 mock，并通过 `localStorage` 持久化已读和清空状态。

**Tech Stack:** Vue 3、TypeScript、Pinia 现有基础、Element Plus Icons、浏览器 Fullscreen API、localStorage

---

### Task 1: Fullscreen Hook

**Files:**

- Create: `front/V3/src/hooks/useFullscreen.ts`
- Modify: `front/V3/src/layout/components/TopNav.vue`

**Step 1: Define fullscreen state API**

Create a composable that exposes:

```ts
const { isFullscreen, toggleFullscreen } = useFullscreen();
```

**Step 2: Sync with browser fullscreen events**

Listen to `fullscreenchange` and update `isFullscreen` from `document.fullscreenElement`.

**Step 3: Add TopNav button**

Use the composable in `TopNav.vue` and render a toggle button with tooltip and icon switch.

**Step 4: Verify**

Run: `pnpm lint`
Expected: PASS

### Task 2: Notification Panel

**Files:**

- Create: `front/V3/src/components/NotificationPanel/index.vue`
- Create: `front/V3/src/mock/data/notifications.ts`
- Create: `front/V3/src/types/notification.ts`
- Modify: `front/V3/src/constants/app.ts`
- Modify: `front/V3/src/layout/components/TopNav.vue`

**Step 1: Define local notification data**

Create a static list with title, summary, time, type, and avatar/initial metadata.

**Step 2: Build panel component**

Render header, scrollable list, empty state, clear action, and footer CTA.

**Step 3: Persist message state**

Store read/cleared state in `localStorage` using an app storage key.

**Step 4: Wire into TopNav**

Add bell button, unread dot, dropdown-style absolute panel positioning, and outside-click closing.

**Step 5: Verify**

Run: `pnpm lint`
Expected: PASS

### Task 3: Final Validation

**Files:**

- Modify: `front/V3/src/layout/components/TopNav.vue`
- Modify: `front/V3/src/components/NotificationPanel/index.vue`

**Step 1: Review spacing and interaction**

Make sure new buttons align with existing theme toggle and user menu.

**Step 2: Run build**

Run: `pnpm build`
Expected: PASS with existing chunk-size warning only

**Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS
