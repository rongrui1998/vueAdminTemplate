<script setup lang="ts">
withDefaults(
  defineProps<{
    data: unknown[];
    loading?: boolean;
    rowKey?: string;
    tableClass?: string;
    error?: boolean;
    errorTitle?: string;
    errorText?: string;
  }>(),
  {
    loading: false,
    rowKey: 'id',
    tableClass: '',
    error: false,
    errorTitle: '数据加载失败',
    errorText: '请稍后重试',
  },
);

const emit = defineEmits<{
  (event: 'retry'): void;
}>();
</script>

<template>
  <el-card shadow="never" class="pro-table">
    <template v-if="$slots.header || $slots.extra" #header>
      <div class="pro-table__header">
        <div>
          <slot name="header" />
        </div>
        <div v-if="$slots.extra" class="pro-table__extra">
          <slot name="extra" />
        </div>
      </div>
    </template>

    <template v-if="error">
      <div class="pro-table__state">
        <el-result icon="error" :title="errorTitle" :sub-title="errorText">
          <template #extra>
            <el-button type="primary" @click="emit('retry')">重新加载</el-button>
          </template>
        </el-result>
      </div>
    </template>

    <el-table v-else v-loading="loading" :data="data" :row-key="rowKey" :class="tableClass">
      <slot />
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </el-table>
  </el-card>
</template>

<style scoped>
.pro-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pro-table__extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pro-table__state {
  padding: 24px 0;
}
</style>
