<script setup lang="ts">
import { useKeepAlive } from '@/hooks/useKeepAlive';

const cachedViews = useKeepAlive();
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component
        :is="Component"
        v-if="route.meta.keepAlive"
        :key="String(route.name || route.fullPath)"
      />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
  </router-view>
</template>
