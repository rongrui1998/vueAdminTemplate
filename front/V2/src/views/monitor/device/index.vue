<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import {
  createDeviceApi,
  deleteDeviceApi,
  getDeviceListApi,
  updateDeviceApi,
  updateDeviceStatusApi,
} from '@/api/device-management';
import PageContainer from '@/components/PageContainer/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import ModalForm from '@/components/ModalForm/index.vue';
import DrawerForm from '@/components/DrawerForm/index.vue';
import { usePermission } from '@/composables/usePermission';
import type {
  DeviceCreatePayload,
  DeviceListQuery,
  DeviceRecord,
  DeviceStatus,
  DeviceUpdatePayload,
} from '@/types/device-management';
import { confirmDelete } from '@/utils/confirm';

const DEVICE_PERMISSIONS = {
  create: 'monitor:device:create',
  detail: 'monitor:device:detail',
  edit: 'monitor:device:edit',
  delete: 'monitor:device:delete',
  status: 'monitor:device:status',
} as const;

const { t } = useI18n();
const { hasPermission } = usePermission();

const searchModel = ref({
  keyword: '',
  status: '' as DeviceStatus | '',
  createdAtRange: [] as string[],
});
const pageNum = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const pageError = ref(false);
const pageErrorText = ref('');
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const submitLoading = ref(false);
const deletingRowId = ref('');
const statusUpdatingRowId = ref('');
const currentRecord = ref<DeviceRecord | null>(null);
const editingRecord = ref<DeviceRecord | null>(null);
const records = ref<DeviceRecord[]>([]);
const total = ref(0);
const formModel = reactive({
  deviceId: '',
  deviceName: '',
  deviceType: '',
});

const searchFields = computed<SearchFormField[]>(() => [
  {
    label: t('deviceManagement.filters.keyword'),
    prop: 'keyword',
    placeholder: t('deviceManagement.filters.keywordPlaceholder'),
  },
  {
    label: t('deviceManagement.filters.status'),
    prop: 'status',
    type: 'select',
    options: [
      { label: t('common.status.active'), value: 1 },
      { label: t('common.status.inactive'), value: 0 },
    ],
  },
  {
    label: t('deviceManagement.filters.createdAtRange'),
    prop: 'createdAtRange',
    type: 'datetimerange',
  },
]);

const dialogTitle = computed(() =>
  editingRecord.value
    ? t('deviceManagement.dialog.editTitle')
    : t('deviceManagement.dialog.createTitle'),
);
const dialogConfirmText = computed(() =>
  editingRecord.value
    ? t('deviceManagement.dialog.editConfirm')
    : t('deviceManagement.dialog.createConfirm'),
);

function getStatusText(status: number) {
  return status === 1 ? t('common.status.active') : t('common.status.inactive');
}

function buildListQuery(): DeviceListQuery {
  const [startTime = '', endTime = ''] = searchModel.value.createdAtRange || [];

  return {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: searchModel.value.keyword.trim(),
    status: searchModel.value.status,
    startTime,
    endTime,
  };
}

async function loadDevices() {
  loading.value = true;
  pageError.value = false;
  pageErrorText.value = '';

  try {
    const result = await getDeviceListApi(buildListQuery());
    records.value = result.list;
    total.value = result.total;
  } catch (error) {
    records.value = [];
    total.value = 0;
    pageError.value = true;
    pageErrorText.value =
      error instanceof Error ? error.message : t('deviceManagement.messages.loadFailed');
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  formModel.deviceId = '';
  formModel.deviceName = '';
  formModel.deviceType = '';
}

function openCreateDialog() {
  editingRecord.value = null;
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: DeviceRecord) {
  editingRecord.value = row;
  formModel.deviceId = row.deviceId;
  formModel.deviceName = row.deviceName;
  formModel.deviceType = row.deviceType;
  dialogVisible.value = true;
}

function validateForm() {
  if (!editingRecord.value && !formModel.deviceId.trim()) {
    ElMessage.warning(t('deviceManagement.form.validation.deviceIdRequired'));
    return false;
  }

  if (!formModel.deviceName.trim()) {
    ElMessage.warning(t('deviceManagement.form.validation.deviceNameRequired'));
    return false;
  }

  if (!formModel.deviceType.trim()) {
    ElMessage.warning(t('deviceManagement.form.validation.deviceTypeRequired'));
    return false;
  }

  return true;
}

async function confirmSubmit() {
  if (!validateForm()) {
    return;
  }

  submitLoading.value = true;

  try {
    if (editingRecord.value) {
      const payload: DeviceUpdatePayload = {
        deviceName: formModel.deviceName.trim(),
        deviceType: formModel.deviceType.trim(),
      };
      await updateDeviceApi(editingRecord.value.id, payload);
      ElMessage.success(t('deviceManagement.messages.updateSuccess'));
    } else {
      const payload: DeviceCreatePayload = {
        deviceId: formModel.deviceId.trim(),
        deviceName: formModel.deviceName.trim(),
        deviceType: formModel.deviceType.trim(),
      };
      await createDeviceApi(payload);
      ElMessage.success(t('deviceManagement.messages.createSuccess'));
    }

    dialogVisible.value = false;
    await loadDevices();
  } finally {
    submitLoading.value = false;
  }
}

function openDetail(row: DeviceRecord) {
  currentRecord.value = row;
  drawerVisible.value = true;
}

async function toggleStatus(row: DeviceRecord, value: string | number | boolean) {
  const nextStatus = Number(value) as DeviceStatus;
  statusUpdatingRowId.value = row.id;

  try {
    await updateDeviceStatusApi(row.id, nextStatus);
    ElMessage.success(
      t('deviceManagement.messages.statusChanged', { status: getStatusText(nextStatus) }),
    );
    await loadDevices();
  } finally {
    statusUpdatingRowId.value = '';
  }
}

async function handleDelete(row: DeviceRecord) {
  if (deletingRowId.value) {
    return;
  }

  const confirmed = await confirmDelete(
    t('deviceManagement.messages.deleteConfirm', { name: row.deviceName }),
  );

  if (!confirmed) {
    return;
  }

  deletingRowId.value = row.id;

  try {
    await deleteDeviceApi(row.id);
    ElMessage.success(t('deviceManagement.messages.deleteSuccess'));
    await loadDevices();
  } finally {
    deletingRowId.value = '';
  }
}

function handleSearch() {
  pageNum.value = 1;
  loadDevices();
}

function handleReset() {
  pageNum.value = 1;
  loadDevices();
}

function handleCurrentChange(nextPage: number) {
  pageNum.value = nextPage;
  loadDevices();
}

function handleSizeChange(nextSize: number) {
  pageNum.value = 1;
  pageSize.value = nextSize;
  loadDevices();
}

onMounted(() => {
  loadDevices();
});
</script>

<template>
  <PageContainer :title="t('deviceManagement.title')">
    <div class="device-management-page">
      <SearchForm
        v-model="searchModel"
        :fields="searchFields"
        @search="handleSearch"
        @reset="handleReset"
      />

      <ProTable
        :data="records"
        row-key="id"
        :loading="loading"
        :error="pageError"
        :error-text="pageErrorText"
        @retry="loadDevices"
      >
        <template #header>
          <strong>{{ t('deviceManagement.tableTitle') }}</strong>
          <span class="device-management-page__count">
            {{ t('deviceManagement.total', { total }) }}
          </span>
        </template>
        <template #extra>
          <el-button :icon="RefreshRight" @click="loadDevices">
            {{ t('deviceManagement.actions.refresh') }}
          </el-button>
          <el-button
            v-if="hasPermission(DEVICE_PERMISSIONS.create)"
            type="primary"
            :icon="Plus"
            @click="openCreateDialog"
          >
            {{ t('deviceManagement.actions.create') }}
          </el-button>
        </template>

        <el-table-column
          prop="deviceId"
          :label="t('deviceManagement.table.deviceId')"
          min-width="140"
        />
        <el-table-column
          prop="deviceName"
          :label="t('deviceManagement.table.deviceName')"
          min-width="160"
        />
        <el-table-column
          prop="deviceType"
          :label="t('deviceManagement.table.deviceType')"
          width="130"
        />
        <el-table-column :label="t('deviceManagement.table.status')" width="120">
          <template #default="{ row }">
            <el-switch
              v-if="hasPermission(DEVICE_PERMISSIONS.status)"
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="statusUpdatingRowId === row.id"
              :active-text="t('common.status.active')"
              :inactive-text="t('common.status.inactive')"
              inline-prompt
              @update:model-value="(value: string | number | boolean) => toggleStatus(row, value)"
            />
            <el-tag v-else :type="row.status === 1 ? 'success' : 'info'">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          :label="t('deviceManagement.table.createdBy')"
          width="120"
        />
        <el-table-column
          prop="createdAt"
          :label="t('deviceManagement.table.createdAt')"
          min-width="170"
        />
        <el-table-column
          prop="updatedBy"
          :label="t('deviceManagement.table.updatedBy')"
          width="120"
        />
        <el-table-column
          prop="updatedAt"
          :label="t('deviceManagement.table.updatedAt')"
          min-width="170"
        />
        <el-table-column :label="t('deviceManagement.table.actions')" width="210" fixed="right">
          <template #default="{ row }">
            <el-button
              v-permission="DEVICE_PERMISSIONS.detail"
              link
              type="primary"
              @click="openDetail(row)"
            >
              {{ t('deviceManagement.actions.detail') }}
            </el-button>
            <el-button
              v-permission="DEVICE_PERMISSIONS.edit"
              link
              type="primary"
              @click="openEditDialog(row)"
            >
              {{ t('deviceManagement.actions.edit') }}
            </el-button>
            <el-button
              v-permission="DEVICE_PERMISSIONS.delete"
              link
              type="danger"
              :loading="deletingRowId === row.id"
              @click="handleDelete(row)"
            >
              {{ t('deviceManagement.actions.delete') }}
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty :description="t('deviceManagement.empty.description')" />
        </template>
      </ProTable>

      <div v-if="total > 0" class="device-management-page__pagination">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <ModalForm
        :visible="dialogVisible"
        :title="dialogTitle"
        :confirm-text="dialogConfirmText"
        :submitting="submitLoading"
        @confirm="confirmSubmit"
        @update:visible="dialogVisible = $event"
      >
        <el-form :model="formModel" label-width="108px">
          <el-form-item :label="t('deviceManagement.form.deviceId')">
            <el-input
              v-model="formModel.deviceId"
              :disabled="Boolean(editingRecord)"
              :maxlength="64"
              show-word-limit
              :placeholder="t('deviceManagement.form.placeholders.deviceId')"
            />
          </el-form-item>
          <el-form-item :label="t('deviceManagement.form.deviceName')">
            <el-input
              v-model="formModel.deviceName"
              :maxlength="100"
              show-word-limit
              :placeholder="t('deviceManagement.form.placeholders.deviceName')"
            />
          </el-form-item>
          <el-form-item :label="t('deviceManagement.form.deviceType')">
            <el-input
              v-model="formModel.deviceType"
              :maxlength="100"
              show-word-limit
              :placeholder="t('deviceManagement.form.placeholders.deviceType')"
            />
          </el-form-item>
        </el-form>
      </ModalForm>

      <DrawerForm
        :visible="drawerVisible"
        :title="t('deviceManagement.drawer.title')"
        size="520px"
        :show-footer="false"
        @update:visible="drawerVisible = $event"
      >
        <el-descriptions v-if="currentRecord" :column="1" border>
          <el-descriptions-item :label="t('deviceManagement.table.deviceId')">
            {{ currentRecord.deviceId }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.deviceName')">
            {{ currentRecord.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.deviceType')">
            {{ currentRecord.deviceType }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.status')">
            {{ getStatusText(currentRecord.status) }}
          </el-descriptions-item>
          <el-descriptions-item label="ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.createdBy')">
            {{ currentRecord.createdBy }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.createdAt')">
            {{ currentRecord.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.updatedBy')">
            {{ currentRecord.updatedBy }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('deviceManagement.table.updatedAt')">
            {{ currentRecord.updatedAt }}
          </el-descriptions-item>
        </el-descriptions>
      </DrawerForm>
    </div>
  </PageContainer>
</template>

<style scoped>
.device-management-page {
  display: grid;
  gap: 16px;
}

.device-management-page__count {
  margin-left: 10px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 400;
}

.device-management-page__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
