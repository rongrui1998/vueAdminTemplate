<script setup lang="ts">
import { computed } from 'vue';
import { appIconMap } from '@/constants/icons';

const props = withDefaults(
  defineProps<{
    name?: string;
    size?: string | number;
  }>(),
  {
    name: 'Menu',
    size: 16,
  },
);

const iconName = computed(() => props.name || 'Menu');
const iconComponent = computed(() => appIconMap[iconName.value] || appIconMap.Menu);
</script>

<template>
  <el-icon :size="size">
    <component :is="iconComponent" />
  </el-icon>
</template>
