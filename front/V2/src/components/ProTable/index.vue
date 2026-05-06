<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
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
  },
);

const emit = defineEmits<{
  (event: 'retry'): void;
}>();

const { t } = useI18n();
const resolvedErrorTitle = computed(() => props.errorTitle || t('shared.proTable.errorTitle'));
const resolvedErrorText = computed(() => props.errorText || t('shared.proTable.errorText'));
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
        <el-result icon="error" :title="resolvedErrorTitle" :sub-title="resolvedErrorText">
          <template #extra>
            <el-button type="primary" @click="emit('retry')">{{
              t('shared.proTable.retry')
            }}</el-button>
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
