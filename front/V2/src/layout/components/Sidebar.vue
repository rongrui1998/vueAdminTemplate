<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { APP_TITLE } from '@/constants/app';
import SidebarMenu from '@/layout/components/SidebarMenu.vue';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';

const appStore = useAppStore();
const permissionStore = usePermissionStore();
const route = useRoute();

const activeMenu = computed(() => route.path);
const visibleMenus = computed(() => permissionStore.visibleMenus);
const appTitle = APP_TITLE;
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <el-icon :size="22">
        <Monitor />
      </el-icon>
      <span v-show="!appStore.sidebarCollapsed" class="sidebar__title">{{ appTitle }}</span>
    </div>

    <el-scrollbar class="sidebar__scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        unique-opened
        class="sidebar__menu"
      >
        <SidebarMenu v-for="menu in visibleMenus" :key="menu.id" :menu="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.sidebar__logo {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  overflow: hidden;
}

.sidebar__title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar__scroll {
  flex: 1;
  min-height: 0;
}

.sidebar__menu {
  min-height: 100%;
  border-right: none;
}
</style>
