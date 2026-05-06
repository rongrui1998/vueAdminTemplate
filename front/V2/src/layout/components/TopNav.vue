<script setup lang="ts">
import {
  ArrowDown,
  Bell,
  Expand,
  Fold,
  FullScreen,
  MagicStick,
  Lock,
  Moon,
  Right,
  ScaleToOriginal,
  Sunny,
} from '@element-plus/icons-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import NotificationPanel from '@/components/NotificationPanel/index.vue';
import { APP_LANGUAGE, LAYOUT_MODE, STORAGE_KEYS } from '@/constants/app';
import BreadcrumbNav from '@/layout/components/BreadcrumbNav.vue';
import SidebarMenu from '@/layout/components/SidebarMenu.vue';
import { LOGIN_PATH } from '@/constants/route';
import { useFullscreen } from '@/hooks/useFullscreen';
import { notificationList } from '@/mock/data/notifications';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { useTabsStore } from '@/store/modules/tabs';
import type { NotificationStorageState } from '@/types/notification';
import { getStorage, setStorage } from '@/utils/storage';

const appStore = useAppStore();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const tabsStore = useTabsStore();
const route = useRoute();
const router = useRouter();
const { isFullscreen, toggleFullscreen } = useFullscreen();
const { t } = useI18n();
const notificationVisible = ref(false);
const notificationWrapRef = ref<HTMLElement | null>(null);
const languageVisible = ref(false);
const languageWrapRef = ref<HTMLElement | null>(null);
const currentLanguage = computed(() => appStore.currentLanguage);

const notificationState = ref<NotificationStorageState>(
  getStorage<NotificationStorageState>(STORAGE_KEYS.notifications, {
    readIds: [],
    cleared: false,
  }),
);

const isDark = computed(() => appStore.themeMode === 'dark');
const isHorizontalLayout = computed(() => appStore.layoutMode === 'horizontal');
const visibleMenus = computed(() => permissionStore.visibleMenus);
const displayName = computed(
  () => authStore.userInfo.nickname || authStore.userInfo.username || t('screenLock.defaultUser'),
);
const notifications = computed(() => {
  if (notificationState.value.cleared) {
    return [];
  }

  return notificationList.map((item) => ({
    ...item,
    read: notificationState.value.readIds.includes(item.id),
  }));
});
const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length);

function handleThemeToggle() {
  appStore.toggleThemeMode();
}

function handleSidebarToggle() {
  if (appStore.layoutMode === LAYOUT_MODE.sidebar) {
    appStore.setLayoutMode(LAYOUT_MODE.vertical);
    return;
  }

  appStore.toggleSidebar();
}

function persistNotificationState() {
  setStorage(STORAGE_KEYS.notifications, notificationState.value);
}

function handleFullscreenToggle() {
  toggleFullscreen().catch(() => {
    ElMessage.warning(t('topNav.message.fullscreenUnsupported'));
  });
}

function toggleNotificationPanel() {
  notificationVisible.value = !notificationVisible.value;
}

function closeNotificationPanel() {
  notificationVisible.value = false;
}

function toggleLanguagePanel() {
  languageVisible.value = !languageVisible.value;
}

function closeLanguagePanel() {
  languageVisible.value = false;
}

function updateCurrentLanguage(language: 'zh-CN' | 'en-US') {
  appStore.setCurrentLanguage(language);
  closeLanguagePanel();
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;

  if (!target) {
    return;
  }

  if (notificationWrapRef.value && !notificationWrapRef.value.contains(target)) {
    closeNotificationPanel();
  }

  if (languageWrapRef.value && !languageWrapRef.value.contains(target)) {
    closeLanguagePanel();
  }
}

function handleMarkNotificationRead(id: string) {
  if (!notificationState.value.readIds.includes(id)) {
    notificationState.value.readIds = [...notificationState.value.readIds, id];
    persistNotificationState();
  }
}

function handleClearNotifications() {
  notificationState.value = {
    ...notificationState.value,
    readIds: [],
    cleared: true,
  };
  persistNotificationState();
}

function handleViewAllNotifications() {
  ElMessage.info(t('topNav.message.notificationsUnavailable'));
  closeNotificationPanel();
}

async function handleLogout() {
  await authStore.logout();
  permissionStore.resetPermissionState(router);
  tabsStore.resetTabs();
  router.replace({
    path: LOGIN_PATH,
    query: route.fullPath ? { redirect: route.fullPath } : undefined,
  });
}

function handleScreenLock() {
  appStore.setScreenLocked(true);
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <div class="top-nav">
    <div class="top-nav__left">
      <el-button
        v-if="!isHorizontalLayout"
        text
        data-test="sidebar-toggle"
        @click="handleSidebarToggle"
      >
        <el-icon :size="18">
          <component :is="appStore.sidebarCollapsed ? Expand : Fold" />
        </el-icon>
      </el-button>

      <el-menu
        v-if="isHorizontalLayout"
        :default-active="route.path"
        mode="horizontal"
        router
        class="top-nav__horizontal-menu"
      >
        <SidebarMenu v-for="menu in visibleMenus" :key="menu.id" :menu="menu" />
      </el-menu>
      <BreadcrumbNav v-else />
    </div>

    <div class="top-nav__right">
      <div class="top-nav__actions">
        <el-tooltip :content="t('topNav.tooltip.themeToggle')" placement="bottom">
          <el-button text class="top-nav__icon-button" @click="handleThemeToggle">
            <el-icon :size="18">
              <component :is="isDark ? Sunny : Moon" />
            </el-icon>
          </el-button>
        </el-tooltip>

        <div ref="languageWrapRef" class="top-nav__language">
          <el-tooltip :content="t('common.language.switch')" placement="bottom">
            <el-button
              text
              class="top-nav__icon-button"
              data-test="language-switch"
              @click.stop="toggleLanguagePanel"
            >
              <el-icon :size="18"><MagicStick /></el-icon>
            </el-button>
          </el-tooltip>

          <div
            v-if="languageVisible"
            class="top-nav__language-panel"
            data-test="language-panel"
            @click.stop
          >
            <button
              type="button"
              class="top-nav__language-option"
              :class="{ 'is-active': currentLanguage === APP_LANGUAGE.zhCN }"
              @click="updateCurrentLanguage(APP_LANGUAGE.zhCN)"
            >
              <span class="top-nav__language-dot" />
              <span>{{ t('common.language.zhCN') }}</span>
            </button>
            <button
              type="button"
              class="top-nav__language-option"
              :class="{ 'is-active': currentLanguage === APP_LANGUAGE.enUS }"
              @click="updateCurrentLanguage(APP_LANGUAGE.enUS)"
            >
              <span class="top-nav__language-dot" />
              <span>{{ t('common.language.enUS') }}</span>
            </button>
          </div>
        </div>

        <div>
          <el-tooltip
            :content="
              isFullscreen
                ? t('topNav.tooltip.fullscreenExit')
                : t('topNav.tooltip.fullscreenEnter')
            "
            placement="bottom"
          >
            <el-button text class="top-nav__icon-button" @click="handleFullscreenToggle">
              <el-icon :size="18">
                <component :is="isFullscreen ? ScaleToOriginal : FullScreen" />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <div ref="notificationWrapRef" class="top-nav__notification">
          <el-tooltip :content="t('topNav.tooltip.notifications')" placement="bottom">
            <el-button
              text
              class="top-nav__notification-button"
              @click.stop="toggleNotificationPanel"
            >
              <el-badge :value="unreadCount || undefined" :hidden="!unreadCount" :max="99">
                <el-icon :size="18"><Bell /></el-icon>
              </el-badge>
            </el-button>
          </el-tooltip>

          <div v-if="notificationVisible" class="top-nav__notification-panel" @click.stop>
            <NotificationPanel
              :messages="notifications"
              :unread-count="unreadCount"
              @mark-read="handleMarkNotificationRead"
              @clear="handleClearNotifications"
              @view-all="handleViewAllNotifications"
            />
          </div>
        </div>
      </div>

      <el-dropdown @command="handleLogout">
        <span class="top-nav__user">
          <el-avatar :size="28">{{ displayName.slice(0, 1) }}</el-avatar>
          <span>{{ displayName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="top-nav__dropdown-menu">
            <el-dropdown-item class="top-nav__dropdown-action" @click="handleScreenLock">
              <span class="top-nav__dropdown-main">
                <el-icon><Lock /></el-icon>
                <span>{{ t('topNav.dropdown.lockScreen') }}</span>
              </span>
              <span class="top-nav__dropdown-shortcut">⌥ L</span>
            </el-dropdown-item>
            <el-dropdown-item class="top-nav__dropdown-action" command="logout">
              <span class="top-nav__dropdown-main">
                <el-icon><Right /></el-icon>
                <span>{{ t('topNav.dropdown.logout') }}</span>
              </span>
              <span class="top-nav__dropdown-shortcut">⌥ Q</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.top-nav {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.top-nav__left,
.top-nav__right {
  display: flex;
  align-items: center;
  gap: 0;
}

.top-nav__left {
  min-width: 0;
  flex: 1;
}

.top-nav__horizontal-menu {
  flex: 1;
  min-width: 0;
  height: 60px;
  border-bottom: 0;
  background: transparent;
}

.top-nav__horizontal-menu :deep(.el-menu-item),
.top-nav__horizontal-menu :deep(.el-sub-menu__title) {
  height: 60px;
}

.top-nav__dropdown-main {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.top-nav__dropdown-shortcut {
  margin-left: 20px;
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  font-weight: 700;
}

.top-nav__language {
  position: relative;
}

.top-nav__language-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 20;
  min-width: 148px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  background: var(--app-card-bg-color);
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.16);
}

.top-nav__language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border: 0;
  border-radius: 10px;
  color: var(--el-text-color-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.top-nav__language-option.is-active {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.top-nav__language-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: transparent;
}

.top-nav__language-option.is-active .top-nav__language-dot {
  background: currentColor;
}

.top-nav__actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.top-nav__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  cursor: pointer;
}

.top-nav__user:focus,
.top-nav__user:focus-visible {
  outline: none;
  box-shadow: none;
}

.top-nav__icon-button,
.top-nav__notification-button {
  padding: 4px;
}

.top-nav__notification {
  position: relative;
}

.top-nav__notification-button {
  position: relative;
}

.top-nav__notification-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 2100;
}
</style>
