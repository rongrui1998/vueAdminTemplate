<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import type { TabViewItem } from '@/types/route';
import { useRoute, useRouter } from 'vue-router';
import { DASHBOARD_PATH, REDIRECT_PATH } from '@/constants/route';
import { useTabsStore } from '@/store/modules/tabs';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const visitedViews = computed(() => tabsStore.visitedViews);
const currentIndex = computed(() =>
  visitedViews.value.findIndex((tab) => tab.fullPath === route.fullPath),
);
const contextMenuVisible = ref(false);
const contextMenuPosition = reactive({
  top: 0,
  left: 0,
});
const contextMenuTab = ref<TabViewItem | null>(null);
const contextMenuRef = ref<HTMLElement | null>(null);

function navigateTo(fullPath: string) {
  if (fullPath !== route.fullPath) {
    router.push(fullPath);
  }
}

function resolveFallbackPath(removedFullPath: string) {
  const tabs = tabsStore.visitedViews;
  const removedIndex = tabs.findIndex((item) => item.fullPath === removedFullPath);

  if (removedIndex !== -1) {
    return tabs[removedIndex + 1]?.fullPath || tabs[removedIndex - 1]?.fullPath || DASHBOARD_PATH;
  }

  const current = currentIndex.value;
  return tabs[current + 1]?.fullPath || tabs[current - 1]?.fullPath || DASHBOARD_PATH;
}

function handleClose(fullPath: string) {
  const isCurrent = route.fullPath === fullPath;
  const fallbackPath = isCurrent ? resolveFallbackPath(fullPath) : '';
  tabsStore.removeTab(fullPath);

  if (isCurrent) {
    router.push(fallbackPath || DASHBOARD_PATH);
  }
}

function refreshTab(target = route.fullPath) {
  const tab = visitedViews.value.find((item) => item.fullPath === target);
  const routeName = tab?.routeName || (route.name ? String(route.name) : '');

  if (routeName) {
    tabsStore.removeCache(routeName);
  }

  if (target === route.fullPath) {
    router.replace(`${REDIRECT_PATH}/${route.fullPath.replace(/^\//, '')}`);
    return;
  }

  router.push(target).then(() => {
    router.replace(`${REDIRECT_PATH}/${target.replace(/^\//, '')}`);
  });
}

function closeTargetTab(target: TabViewItem | null) {
  if (!target) {
    return;
  }

  handleClose(target.fullPath);
}

function closeOtherTabs(target: TabViewItem | null) {
  if (!target) {
    return;
  }

  tabsStore.removeOthers(target.fullPath);

  if (route.fullPath !== target.fullPath) {
    router.push(target.fullPath);
  }
}

function closeAllTabs() {
  tabsStore.removeAll();
  router.push(tabsStore.activePath || DASHBOARD_PATH);
}

function openContextMenu(event: MouseEvent, tab: TabViewItem) {
  event.preventDefault();
  event.stopPropagation();
  contextMenuTab.value = tab;
  contextMenuVisible.value = true;

  nextTick(() => {
    const menuWidth = contextMenuRef.value?.offsetWidth || 168;
    const menuHeight = contextMenuRef.value?.offsetHeight || 160;
    const maxLeft = Math.max(window.innerWidth - menuWidth - 12, 12);
    const maxTop = Math.max(window.innerHeight - menuHeight - 12, 12);

    contextMenuPosition.left = Math.min(event.clientX, maxLeft);
    contextMenuPosition.top = Math.min(event.clientY, maxTop);
  });
}

function hideContextMenu() {
  contextMenuVisible.value = false;
}

function handleContextCommand(command: 'refresh' | 'closeCurrent' | 'closeOthers' | 'closeAll') {
  const target = contextMenuTab.value;
  hideContextMenu();

  if (!target) {
    return;
  }

  if (command === 'refresh') {
    refreshTab(target.fullPath);
    return;
  }

  if (command === 'closeCurrent') {
    closeTargetTab(target);
    return;
  }

  if (command === 'closeOthers') {
    closeOtherTabs(target);
    return;
  }

  closeAllTabs();
}

onMounted(() => {
  window.addEventListener('click', hideContextMenu);
  window.addEventListener('resize', hideContextMenu);
  window.addEventListener('scroll', hideContextMenu, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', hideContextMenu);
  window.removeEventListener('resize', hideContextMenu);
  window.removeEventListener('scroll', hideContextMenu, true);
});
</script>

<template>
  <div class="tag-views" @click="hideContextMenu">
    <el-scrollbar>
      <div class="tag-views__list">
        <el-tag
          v-for="tab in visitedViews"
          :key="tab.fullPath"
          :closable="!tab.affix"
          :effect="tab.fullPath === route.fullPath ? 'dark' : 'plain'"
          class="tag-views__item"
          @click="navigateTo(tab.fullPath)"
          @close="handleClose(tab.fullPath)"
          @contextmenu.stop.prevent="openContextMenu($event, tab)"
        >
          {{ tab.title }}
        </el-tag>
      </div>
    </el-scrollbar>

    <teleport to="body">
      <div
        v-if="contextMenuVisible && contextMenuTab"
        ref="contextMenuRef"
        class="tag-views__context-menu"
        :style="{ top: `${contextMenuPosition.top}px`, left: `${contextMenuPosition.left}px` }"
        @click.stop
      >
        <button
          type="button"
          class="tag-views__context-action"
          @click="handleContextCommand('refresh')"
        >
          刷新当前标签
        </button>
        <button
          type="button"
          class="tag-views__context-action"
          :disabled="contextMenuTab.affix"
          @click="handleContextCommand('closeCurrent')"
        >
          关闭当前标签
        </button>
        <button
          type="button"
          class="tag-views__context-action"
          @click="handleContextCommand('closeOthers')"
        >
          关闭其他标签
        </button>
        <button
          type="button"
          class="tag-views__context-action"
          @click="handleContextCommand('closeAll')"
        >
          关闭全部标签
        </button>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.tag-views {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tag-views__list {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.tag-views__item {
  cursor: pointer;
}

.tag-views__context-menu {
  position: fixed;
  z-index: 3000;
  width: 196px;
  padding: 4px;
  background: var(--app-card-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  box-shadow: var(--el-box-shadow-light);
}

.tag-views__context-action {
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--el-text-color-primary);
  text-align: left;
  cursor: pointer;
}

.tag-views__context-action:hover:not(:disabled) {
  background: var(--el-fill-color-light);
}

.tag-views__context-action:disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}
</style>
