<script setup lang="ts">
import { nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTabsStore } from '@/store/modules/tabs';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

onMounted(async () => {
  const targetPath = Array.isArray(route.params.pathMatch)
    ? `/${route.params.pathMatch.join('/')}`
    : `/${String(route.params.pathMatch || '')}`;
  const routeName = router.currentRoute.value.name;

  if (routeName) {
    tabsStore.removeCache(String(routeName));
  }

  await nextTick();
  router.replace(targetPath);
});
</script>

<template>
  <div class="redirect-page" />
</template>
