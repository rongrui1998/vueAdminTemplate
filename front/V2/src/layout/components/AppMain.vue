<script setup lang="ts">
import { useKeepAlive } from '@/hooks/useKeepAlive';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const cachedViews = useKeepAlive();
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="appStore.keepAliveEnabled ? cachedViews : []">
      <component
        :is="Component"
        v-if="route.meta.keepAlive && appStore.keepAliveEnabled"
        :key="String(route.name || route.fullPath)"
      />
    </keep-alive>
    <component
      :is="Component"
      v-if="!route.meta.keepAlive || !appStore.keepAliveEnabled"
      :key="route.fullPath"
    />
  </router-view>
</template>
