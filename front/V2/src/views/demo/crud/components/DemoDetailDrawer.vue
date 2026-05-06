<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { DemoUserItem } from '@/types/demo';

withDefaults(
  defineProps<{
    modelValue: boolean;
    detail?: DemoUserItem | null;
    loading?: boolean;
    error?: string;
  }>(),
  {
    detail: null,
    loading: false,
    error: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  retry: [];
}>();
const { t } = useI18n();
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    :title="t('crudDemo.detail.title')"
    size="420px"
    @close="emit('update:modelValue', false)"
  >
    <el-skeleton :loading="loading" animated :rows="6">
      <template #default>
        <el-result
          v-if="error"
          icon="error"
          :title="t('crudDemo.detail.loadFailed')"
          :sub-title="error"
        >
          <template #extra>
            <el-button type="primary" @click="emit('retry')">{{
              t('crudDemo.actions.reload')
            }}</el-button>
          </template>
        </el-result>

        <el-descriptions v-else-if="detail" :column="1" border>
          <el-descriptions-item :label="t('crudDemo.detail.name')">{{
            detail.name
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('crudDemo.detail.email')">{{
            detail.email
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('crudDemo.detail.role')">{{
            detail.role
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('crudDemo.detail.department')">{{
            detail.department
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('crudDemo.detail.status')">
            <el-tag :type="detail.status ? 'success' : 'info'">{{
              detail.status ? t('common.status.active') : t('common.status.inactive')
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('crudDemo.detail.createdAt')">{{
            detail.createdAt
          }}</el-descriptions-item>
        </el-descriptions>

        <el-empty v-else :description="t('crudDemo.detail.empty')" />
      </template>
    </el-skeleton>
  </el-drawer>
</template>
