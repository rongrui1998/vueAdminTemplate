<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { getRouteTitle } from '@/utils/route';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const breadcrumbItems = computed(() =>
  route.matched.filter(
    (item) => item.meta.title && !item.meta.hidden && item.name !== 'RootLayout',
  ),
);

function navigateTo(path: string) {
  if (path && path !== route.path) {
    router.push(path);
  }
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="String(item.name)">
      <span
        v-if="index === breadcrumbItems.length - 1 || !item.path"
        class="breadcrumb-nav__current"
      >
        {{ getRouteTitle(item, appStore.currentLanguage) }}
      </span>
      <span v-else class="breadcrumb-nav__link" @click="navigateTo(item.path)">
        {{ getRouteTitle(item, appStore.currentLanguage) }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb-nav__link {
  cursor: pointer;
  color: var(--el-color-primary);
}

.breadcrumb-nav__current {
  color: var(--el-text-color-primary);
}
</style>
