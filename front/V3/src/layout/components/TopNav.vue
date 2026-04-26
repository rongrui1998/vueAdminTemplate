<script setup lang="ts">
import {
  ArrowDown,
  Bell,
  Expand,
  Fold,
  FullScreen,
  Moon,
  ScaleToOriginal,
  Sunny,
} from '@element-plus/icons-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import NotificationPanel from '@/components/NotificationPanel/index.vue';
import { STORAGE_KEYS } from '@/constants/app';
import BreadcrumbNav from '@/layout/components/BreadcrumbNav.vue';
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
const notificationVisible = ref(false);
const notificationWrapRef = ref<HTMLElement | null>(null);

const notificationState = ref<NotificationStorageState>(
  getStorage<NotificationStorageState>(STORAGE_KEYS.notifications, {
    readIds: [],
    cleared: false,
  }),
);

const isDark = computed(() => appStore.themeMode === 'dark');
const displayName = computed(
  () => authStore.userInfo.nickname || authStore.userInfo.username || '管理员',
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

function persistNotificationState() {
  setStorage(STORAGE_KEYS.notifications, notificationState.value);
}

function handleFullscreenToggle() {
  toggleFullscreen().catch(() => {
    ElMessage.warning('当前环境不支持全屏切换');
  });
}

function toggleNotificationPanel() {
  notificationVisible.value = !notificationVisible.value;
}

function closeNotificationPanel() {
  notificationVisible.value = false;
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;

  if (!notificationWrapRef.value || !target) {
    return;
  }

  if (!notificationWrapRef.value.contains(target)) {
    closeNotificationPanel();
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
  ElMessage.info('Base 版本暂未提供完整消息列表页');
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
      <el-button text @click="appStore.toggleSidebar">
        <el-icon :size="18">
          <component :is="appStore.sidebarCollapsed ? Expand : Fold" />
        </el-icon>
      </el-button>

      <BreadcrumbNav />
    </div>

    <div class="top-nav__right">
      <div class="top-nav__actions">
        <el-tooltip content="切换明暗模式" placement="bottom">
          <el-button text class="top-nav__icon-button" @click="handleThemeToggle">
            <el-icon :size="18">
              <component :is="isDark ? Sunny : Moon" />
            </el-icon>
          </el-button>
        </el-tooltip>

        <div>
          <el-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'" placement="bottom">
            <el-button text class="top-nav__icon-button" @click="handleFullscreenToggle">
              <el-icon :size="18">
                <component :is="isFullscreen ? ScaleToOriginal : FullScreen" />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <div ref="notificationWrapRef" class="top-nav__notification">
          <el-tooltip content="消息通知" placement="bottom">
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
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
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
