<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import AppIcon from '@/components/AppIcon/index.vue';
import type { AppMenuItem } from '@/types/menu';
import { resolveMenuTitle } from '@/utils/route';

defineOptions({
  name: 'SidebarMenu',
});

const props = defineProps<{
  menu: AppMenuItem;
}>();
const appStore = useAppStore();

const visibleChildren = computed(() =>
  props.menu.children.filter((item) => !item.hidden && item.type !== 'button'),
);
const menuTitle = computed(() => resolveMenuTitle(props.menu, appStore.currentLanguage));
</script>

<template>
  <el-sub-menu v-if="visibleChildren.length" :index="menu.fullPath">
    <template #title>
      <AppIcon :name="menu.icon" />
      <span>{{ menuTitle }}</span>
    </template>
    <SidebarMenu v-for="child in visibleChildren" :key="child.id" :menu="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="menu.fullPath">
    <AppIcon :name="menu.icon" />
    <template #title>{{ menuTitle }}</template>
  </el-menu-item>
</template>
