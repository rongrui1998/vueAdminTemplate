<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';
import {
  createDeviceApi,
  deleteDeviceApi,
  getDevicesApi,
  updateDeviceApi,
  updateDeviceStatusApi,
} from '@/api/device';
import { usePermission } from '@/composables/usePermission';
import type { DeviceCreatePayload, DeviceListQuery, DeviceRecord } from '@/types/device';
import { confirmDelete } from '@/utils/confirm';
import DeviceDetailDrawer from './components/DeviceDetailDrawer.vue';
import DeviceFormDialog from './components/DeviceFormDialog.vue';

const { hasPermission } = usePermission();
const pageTitle = computed(() => '设备管理');
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const tableData = ref<DeviceRecord[]>([]);
const total = ref(0);
const formVisible = ref(false);
const detailVisible = ref(false);
const currentRecord = ref<DeviceRecord | null>(null);
const detailRecord = ref<DeviceRecord | null>(null);
const submitLoading = ref(false);
const statusLoadingMap = reactive<Record<string, boolean>>({});

const queryForm = reactive({
  keyword: '',
  status: '' as number | '',
  timeRange: [] as string[],
  pageNum: 1,
  pageSize: 10,
});

const searchFields: SearchFormField[] = [
  {
    label: '关键词',
    prop: 'keyword',
    placeholder: '搜索设备编号、设备名称、设备类型',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
  },
  {
    label: '创建时间',
    prop: 'timeRange',
    type: 'datetimerange',
  },
];

function buildQueryPayload(): DeviceListQuery {
  return {
    keyword: queryForm.keyword.trim(),
    status: queryForm.status,
    startTime: queryForm.timeRange[0] || '',
    endTime: queryForm.timeRange[1] || '',
    pageNum: queryForm.pageNum,
    pageSize: queryForm.pageSize,
  };
}

async function loadDevices() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    const result = await getDevicesApi(buildQueryPayload());
    tableData.value = result.list;
    total.value = result.total;
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    total.value = 0;
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : '获取设备列表失败';
  }
}

function handleSearch() {
  queryForm.pageNum = 1;
  loadDevices();
}

function handleReset() {
  queryForm.keyword = '';
  queryForm.status = '';
  queryForm.timeRange = [];
  queryForm.pageNum = 1;
  queryForm.pageSize = 10;
  loadDevices();
}

function openCreateDialog() {
  currentRecord.value = null;
  formVisible.value = true;
}

function openEditDialog(row: DeviceRecord) {
  currentRecord.value = row;
  formVisible.value = true;
}

function openDetailDrawer(row: DeviceRecord) {
  detailRecord.value = row;
  detailVisible.value = true;
}

async function handleSubmit(payload: DeviceCreatePayload) {
  submitLoading.value = true;

  try {
    if (currentRecord.value) {
      await updateDeviceApi({
        id: currentRecord.value.id,
        deviceName: payload.deviceName,
        deviceType: payload.deviceType,
      });
      ElMessage.success('设备更新成功');
    } else {
      await createDeviceApi(payload);
      ElMessage.success('设备创建成功');
    }

    formVisible.value = false;
    await loadDevices();
  } finally {
    submitLoading.value = false;
  }
}

async function handleStatusChange(row: DeviceRecord, value: number | string | boolean) {
  if (statusLoadingMap[row.id]) {
    return;
  }

  statusLoadingMap[row.id] = true;

  try {
    await updateDeviceStatusApi({
      id: row.id,
      status: Number(value),
    });
    ElMessage.success(`设备已${Number(value) === 1 ? '启用' : '停用'}`);
    await loadDevices();
  } finally {
    delete statusLoadingMap[row.id];
  }
}

async function handleDelete(row: DeviceRecord) {
  const confirmed = await confirmDelete(`确认删除“${row.deviceName}”吗？`);

  if (!confirmed) {
    return;
  }

  await deleteDeviceApi(row.id);
  ElMessage.success('设备删除成功');
  await loadDevices();
}

onMounted(() => {
  loadDevices();
});
</script>

<template>
  <PageContainer :title="pageTitle">
    <template #extra>
      <div class="device-page__toolbar">
        <el-button
          v-permission="'system:device:create'"
          type="primary"
          :icon="Plus"
          @click="openCreateDialog"
        >
          新增设备
        </el-button>
        <el-button circle :icon="RefreshRight" @click="loadDevices" />
      </div>
    </template>

    <SearchForm
      :model-value="queryForm"
      :fields="searchFields"
      @update:model-value="Object.assign(queryForm, $event)"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ProTable
      :data="tableData"
      :loading="pageStatus === 'loading'"
      :error="pageStatus === 'error'"
      :error-title="'设备列表加载失败'"
      :error-text="errorText || '请稍后重试'"
      row-key="id"
      @retry="loadDevices"
    >
      <template #header>
        <strong>设备列表</strong>
      </template>
      <template #extra>
        <span class="device-page__count">共 {{ total }} 条</span>
      </template>

      <el-table-column label="设备编号" prop="deviceId" min-width="160" />
      <el-table-column label="设备名称" prop="deviceName" min-width="180" />
      <el-table-column label="设备类型" prop="deviceType" min-width="150" />

      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="Boolean(statusLoadingMap[row.id])"
            :disabled="!hasPermission('system:device:status')"
            @change="(value: string | number | boolean) => handleStatusChange(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column label="创建人" prop="createdBy" width="130" />
      <el-table-column label="创建时间" prop="createdAt" min-width="170" />
      <el-table-column label="更新人" prop="updatedBy" width="130" />
      <el-table-column label="更新时间" prop="updatedAt" min-width="170" />

      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <div class="device-page__actions">
            <el-button
              v-permission="'system:device:detail'"
              link
              type="primary"
              @click="openDetailDrawer(row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="'system:device:edit'"
              link
              type="primary"
              @click="openEditDialog(row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="'system:device:delete'"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </ProTable>

    <DeviceFormDialog
      :visible="formVisible"
      :record="currentRecord"
      :submitting="submitLoading"
      @submit="handleSubmit"
      @update:visible="formVisible = $event"
    />

    <DeviceDetailDrawer
      :visible="detailVisible"
      :record="detailRecord"
      @update:visible="detailVisible = $event"
    />
  </PageContainer>
</template>

<style scoped>
.device-page__toolbar,
.device-page__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-page__count {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
