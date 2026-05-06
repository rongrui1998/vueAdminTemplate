<script setup lang="ts">
import DrawerForm from '@/components/DrawerForm/index.vue';
import type { DeviceRecord } from '@/types/device';

withDefaults(
  defineProps<{
    visible: boolean;
    record?: DeviceRecord | null;
  }>(),
  {
    record: null,
  },
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();
</script>

<template>
  <DrawerForm
    :visible="visible"
    title="设备详情"
    size="460px"
    :show-footer="false"
    @update:visible="emit('update:visible', $event)"
  >
    <el-descriptions v-if="record" :column="1" border>
      <el-descriptions-item label="设备编号">{{ record.deviceId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ record.deviceName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="设备类型">{{ record.deviceType || '-' }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="record.status === 1 ? 'success' : 'info'">
          {{ record.status === 1 ? '启用' : '停用' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建人">{{ record.createdBy || '-' }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ record.createdAt || '-' }}</el-descriptions-item>
      <el-descriptions-item label="更新人">{{ record.updatedBy || '-' }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ record.updatedAt || '-' }}</el-descriptions-item>
    </el-descriptions>

    <el-empty v-else description="暂无设备详情" />
  </DrawerForm>
</template>
