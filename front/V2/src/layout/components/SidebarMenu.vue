<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from '@/components/AppIcon/index.vue';
import type { AppMenuItem } from '@/types/menu';

defineOptions({
  name: 'SidebarMenu',
});

const props = defineProps<{
  menu: AppMenuItem;
}>();

const visibleChildren = computed(() =>
  props.menu.children.filter((item) => !item.hidden && item.type !== 'button'),
);
</script>

<template>
  <el-sub-menu v-if="visibleChildren.length" :index="menu.fullPath">
    <template #title>
      <AppIcon :name="menu.icon" />
      <span>{{ menu.name }}</span>
    </template>
    <SidebarMenu v-for="child in visibleChildren" :key="child.id" :menu="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="menu.fullPath">
    <AppIcon :name="menu.icon" />
    <template #title>{{ menu.name }}</template>
  </el-menu-item>
</template>
