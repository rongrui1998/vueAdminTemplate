<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { APP_BRAND } from '@/constants/branding';
import SidebarMenu from '@/layout/components/SidebarMenu.vue';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';

const props = defineProps<{
  collapsedLogoOverride?: string;
}>();

const appStore = useAppStore();
const permissionStore = usePermissionStore();
const route = useRoute();

const useDarkSidebarStyles = computed(
  () => appStore.darkSidebarEnabled || appStore.themeMode === 'dark',
);
const activeMenu = computed(() => route.path);
const visibleMenus = computed(() => permissionStore.visibleMenus);
const isSidebarCollapsed = computed(
  () => appStore.sidebarCollapsed || appStore.layoutMode === 'sidebar',
);
const menuClass = computed(() => ({
  sidebar__menu: true,
  'sidebar__menu--dark': useDarkSidebarStyles.value,
}));
const menuPopperClass = computed(() =>
  useDarkSidebarStyles.value
    ? 'sidebar-menu-popper sidebar-menu-popper--dark'
    : 'sidebar-menu-popper',
);
const appTitle = APP_BRAND.title;
const collapsedLogoSrc = computed(
  () => props.collapsedLogoOverride || APP_BRAND.collapsedLogo || APP_BRAND.logo,
);
const collapsedBrandInitial = computed(() => appTitle.trim().charAt(0).toUpperCase() || 'A');
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <template v-if="isSidebarCollapsed">
        <img
          v-if="collapsedLogoSrc"
          :src="collapsedLogoSrc"
          alt="应用 Logo"
          class="sidebar__brand-image"
        />
        <span v-else class="sidebar__brand-initial">{{ collapsedBrandInitial }}</span>
      </template>
      <el-icon v-else :size="22">
        <Monitor />
      </el-icon>
      <span v-if="!isSidebarCollapsed" class="sidebar__title">{{ appTitle }}</span>
    </div>

    <el-scrollbar class="sidebar__scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="isSidebarCollapsed"
        :collapse-transition="false"
        :popper-class="menuPopperClass"
        router
        unique-opened
        :class="menuClass"
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
  background: inherit;
}

.sidebar__logo {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  overflow: hidden;
  color: inherit;
}

.sidebar__title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar__brand-image,
.sidebar__brand-initial {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
}

.sidebar__brand-image {
  display: block;
  object-fit: contain;
}

.sidebar__brand-initial {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: inherit;
  background: rgb(255 255 255 / 0.08);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.sidebar__scroll {
  flex: 1;
  min-height: 0;
}

.sidebar__menu {
  min-height: 100%;
  background: transparent;
  border-right: none;
}

.sidebar__menu--dark {
  --el-menu-bg-color: #171923;
  --el-menu-text-color: #aeb7c7;
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-hover-bg-color: rgb(255 255 255 / 0.82);
  --el-menu-hover-text-color: #111827;
  --el-menu-sub-item-height: 52px;
}

:global(.sidebar__menu--dark .el-sub-menu__title),
:global(.sidebar__menu--dark .el-menu-item),
:global(.sidebar__menu--dark .el-sub-menu .el-menu-item) {
  color: #cfd6e3;
}

:global(.sidebar__menu--dark .el-sub-menu .el-menu),
:global(.sidebar__menu--dark .el-menu--inline) {
  background-color: transparent;
}

:global(.sidebar__menu--dark .el-sub-menu__title:hover),
:global(.sidebar__menu--dark .el-menu-item:hover),
:global(.sidebar__menu--dark .el-sub-menu .el-menu-item:hover) {
  color: #111827 !important;
  background-color: rgb(255 255 255 / 0.82);
  opacity: 1 !important;
}

:global(.sidebar__menu--dark .el-sub-menu__title:hover *),
:global(.sidebar__menu--dark .el-menu-item:hover *),
:global(.sidebar__menu--dark .el-sub-menu .el-menu-item:hover *) {
  color: #111827 !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #111827;
}

:global(.sidebar__menu--dark .el-menu-item.is-active),
:global(.sidebar__menu--dark .el-sub-menu .el-menu-item.is-active) {
  color: var(--el-color-primary);
  background-color: rgb(22 119 255 / 0.14);
}

:global(.sidebar-menu-popper--dark.el-menu--popup-container),
:global(.sidebar-menu-popper--dark.el-menu--popup) {
  --el-menu-bg-color: #171923;
  --el-menu-text-color: #aeb7c7;
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-hover-bg-color: rgb(255 255 255 / 0.82);
  --el-menu-hover-text-color: #111827;

  background: #171923;
}

:global(.sidebar-menu-popper--dark .el-menu-item),
:global(.sidebar-menu-popper--dark .el-sub-menu__title) {
  color: #cfd6e3;
}

:global(.sidebar-menu-popper--dark .el-menu-item:hover),
:global(.sidebar-menu-popper--dark .el-sub-menu__title:hover) {
  color: #111827 !important;
  background-color: rgb(255 255 255 / 0.82);
  opacity: 1 !important;
}

:global(.sidebar-menu-popper--dark .el-menu-item:hover *),
:global(.sidebar-menu-popper--dark .el-sub-menu__title:hover *) {
  color: #111827 !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #111827;
}

:global(.sidebar-menu-popper--dark .el-menu-item.is-active) {
  color: var(--el-color-primary);
  background-color: rgb(22 119 255 / 0.14);
}
</style>
