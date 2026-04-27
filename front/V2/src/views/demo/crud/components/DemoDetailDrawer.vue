<script setup lang="ts">
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
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    title="账号详情"
    size="420px"
    @close="emit('update:modelValue', false)"
  >
    <el-skeleton :loading="loading" animated :rows="6">
      <template #default>
        <el-result v-if="error" icon="error" title="获取详情失败" :sub-title="error">
          <template #extra>
            <el-button type="primary" @click="emit('retry')">重新加载</el-button>
          </template>
        </el-result>

        <el-descriptions v-else-if="detail" :column="1" border>
          <el-descriptions-item label="姓名">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ detail.role }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ detail.department }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detail.status ? 'success' : 'info'">{{
              detail.status ? '启用' : '停用'
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <el-empty v-else description="暂无详情数据" />
      </template>
    </el-skeleton>
  </el-drawer>
</template>
