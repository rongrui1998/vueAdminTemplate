<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LOGIN_PATH } from '@/constants/route';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { useTabsStore } from '@/store/modules/tabs';
import AppMain from '@/layout/components/AppMain.vue';
import GlobalSettingsDrawer from '@/layout/components/GlobalSettingsDrawer.vue';
import ScreenLockOverlay from '@/layout/components/ScreenLockOverlay.vue';
import Sidebar from '@/layout/components/Sidebar.vue';
import TagViews from '@/layout/components/TagViews.vue';
import TopNav from '@/layout/components/TopNav.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const tabsStore = useTabsStore();
const route = useRoute();
const router = useRouter();

async function redirectToLogin() {
  await authStore.logout();
  permissionStore.resetPermissionState(router);
  tabsStore.resetTabs();
  router.replace({
    path: LOGIN_PATH,
    query: route.fullPath ? { redirect: route.fullPath } : undefined,
  });
}

async function handleLayoutShortcut(event: KeyboardEvent) {
  if (!appStore.shortcutHintsEnabled) {
    return;
  }

  const isSettingsShortcut = event.code === 'Comma' && (event.ctrlKey || event.altKey);
  const isLogoutShortcut = event.code === 'KeyQ' && (event.ctrlKey || event.altKey);
  const isScreenLockShortcut = event.code === 'KeyL' && (event.ctrlKey || event.altKey);

  if (isSettingsShortcut) {
    event.preventDefault();
    appStore.openSettingsDrawer();
    return;
  }

  if (isLogoutShortcut && appStore.logoutShortcutEnabled) {
    event.preventDefault();
    await redirectToLogin();
    return;
  }

  if (isScreenLockShortcut && appStore.screenLockShortcutEnabled) {
    event.preventDefault();
    appStore.setScreenLocked(true);
  }
}

function handleScreenUnlock() {
  appStore.setScreenLockPassword('');
  appStore.setScreenLocked(false);
}

function handleScreenCancel() {
  appStore.setScreenLockPassword('');
  appStore.setScreenLocked(false);
}

function handleScreenPasswordSave(password: string) {
  appStore.setScreenLockPassword(password);
}

async function handleScreenLogout() {
  appStore.setScreenLockPassword('');
  appStore.setScreenLocked(false);
  await redirectToLogin();
}

onMounted(() => {
  document.addEventListener('keydown', handleLayoutShortcut);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleLayoutShortcut);
});
</script>

<template>
  <el-container
    class="app-layout"
    :class="[
      `app-layout--${appStore.layoutDensity}`,
      `app-layout--mode-${appStore.layoutMode}`,
      `app-layout--content-${appStore.contentWidthMode}`,
      {
        'app-layout--dark-sidebar': appStore.darkSidebarEnabled,
        'app-layout--dark-header': appStore.darkHeaderEnabled,
      },
    ]"
  >
    <el-aside
      v-if="!['full-content', 'horizontal'].includes(appStore.layoutMode)"
      :width="appStore.sidebarCollapsed || appStore.layoutMode === 'sidebar' ? '64px' : '220px'"
      class="app-layout__aside"
    >
      <Sidebar />
    </el-aside>

    <el-container class="app-layout__content">
      <el-header class="app-layout__header">
        <TopNav />
      </el-header>

      <div v-if="appStore.tagViewsVisible" class="app-layout__tags">
        <TagViews />
      </div>

      <el-main
        class="app-layout__main"
        :class="{ 'app-layout__main--spaced': appStore.layoutMode === 'full-content' }"
      >
        <div class="app-layout__main-inner">
          <AppMain />
        </div>
      </el-main>
    </el-container>

    <GlobalSettingsDrawer />

    <teleport to="body">
      <ScreenLockOverlay
        :visible="appStore.screenLocked"
        :user-info="authStore.userInfo"
        :lock-password="appStore.screenLockPassword"
        @unlock="handleScreenUnlock"
        @cancel="handleScreenCancel"
        @logout="handleScreenLogout"
        @save-password="handleScreenPasswordSave"
      />
    </teleport>
  </el-container>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}

.app-layout__aside {
  height: 100vh;
  min-height: 0;
  color: var(--el-text-color-primary);
  background: var(--app-card-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.2s ease;
  overflow: hidden;
}

.app-layout__content {
  height: 100vh;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-bg-color);
}

.app-layout__header {
  flex-shrink: 0;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--app-card-bg-color);
}

.app-layout__tags {
  flex-shrink: 0;
  padding: 0 16px;
  background: var(--app-card-bg-color);
}

.app-layout__tags {
  display: flex;
  align-items: center;
  min-height: 42px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.app-layout__main {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow: auto;
}

.app-layout__main-inner {
  min-height: 100%;
}

.app-layout--compact .app-layout__main {
  padding: 12px;
}

.app-layout--compact .app-layout__tags {
  min-height: 38px;
}

.app-layout--dark-sidebar .app-layout__aside {
  --el-menu-bg-color: #171923;
  --el-menu-text-color: #aeb7c7;
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-hover-bg-color: rgb(255 255 255 / 0.82);
  --el-menu-hover-text-color: #111827;
  --el-menu-sub-item-height: 52px;

  color: #d7dde8;
  background: #171923;
  border-right-color: rgb(255 255 255 / 0.08);
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu) {
  background-color: transparent;
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu__title),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu-item) {
  color: #cfd6e3;
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu .el-menu-item) {
  background-color: transparent;
  color: #cfd6e3;
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu__title:hover),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu-item:hover),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu .el-menu-item:hover) {
  color: #111827;
  background-color: rgb(255 255 255 / 0.82);
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu__title:hover .el-icon),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu-item:hover .el-icon),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu .el-menu-item:hover .el-icon),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu__title:hover span),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu-item:hover span),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu .el-menu-item:hover span) {
  color: #111827;
}

.app-layout--dark-sidebar .app-layout__aside :deep(.el-menu-item.is-active),
.app-layout--dark-sidebar .app-layout__aside :deep(.el-sub-menu .el-menu-item.is-active) {
  color: var(--el-color-primary);
  background-color: rgb(22 119 255 / 0.14);
}

.app-layout--dark-header .app-layout__header {
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd6e3;
  --el-text-color-secondary: #aeb7c7;
  --el-fill-color-light: rgb(255 255 255 / 0.06);
  --el-border-color-light: rgb(255 255 255 / 0.08);

  color: #d7dde8;
  background: #171923;
  border-bottom-color: rgb(255 255 255 / 0.08);
}

.app-layout--mode-sidebar .app-layout__aside {
  width: 64px;
}

.app-layout--mode-full-content .app-layout__header,
.app-layout--mode-full-content .app-layout__tags {
  display: none;
}

.app-layout--mode-full-content .app-layout__main {
  padding: 20px;
}

.app-layout--compact.app-layout--mode-full-content .app-layout__main {
  padding: 12px;
}

.app-layout--content-fixed .app-layout__main-inner {
  width: min(100%, 1180px);
  margin: 0 auto;
}
</style>
