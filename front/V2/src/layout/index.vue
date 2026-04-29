<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import AppMain from '@/layout/components/AppMain.vue';
import GlobalSettingsDrawer from '@/layout/components/GlobalSettingsDrawer.vue';
import Sidebar from '@/layout/components/Sidebar.vue';
import TagViews from '@/layout/components/TagViews.vue';
import TopNav from '@/layout/components/TopNav.vue';

const appStore = useAppStore();
</script>

<template>
  <el-container class="app-layout" :class="`app-layout--${appStore.layoutDensity}`">
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="app-layout__aside">
      <Sidebar />
    </el-aside>

    <el-container class="app-layout__content">
      <el-header class="app-layout__header">
        <TopNav />
      </el-header>

      <div v-if="appStore.tagViewsVisible" class="app-layout__tags">
        <TagViews />
      </div>

      <el-main class="app-layout__main">
        <AppMain />
      </el-main>
    </el-container>

    <GlobalSettingsDrawer />
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
  padding: 0 20px;
  background: var(--app-card-bg-color);
}

.app-layout__tags {
  display: flex;
  align-items: center;
  min-height: 50px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.app-layout__main {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow: auto;
}

.app-layout--compact .app-layout__main {
  padding: 12px;
}

.app-layout--compact .app-layout__tags {
  min-height: 42px;
}
</style>
