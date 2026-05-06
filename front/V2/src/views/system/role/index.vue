<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getSystemMenusApi } from '@/api/system-menu';
import {
  createSystemRoleApi,
  deleteSystemRoleApi,
  getSystemRolesApi,
  updateSystemRoleApi,
  updateSystemRoleMenusApi,
} from '@/api/system-role';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';
import { usePermission } from '@/composables/usePermission';
import { getStandardDataSourceLabel, isStandardApiMode } from '@/constants/standard';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemRolePayload, SystemRoleRecord } from '@/types/system-role';
import { confirmDelete } from '@/utils/confirm';
import RoleFormDialog from './components/RoleFormDialog.vue';
import RolePermissionDialog from './components/RolePermissionDialog.vue';

const dataSourceLabel = computed(() => getStandardDataSourceLabel());
const { t } = useI18n();
const sourceStatus = computed(() =>
  isStandardApiMode() ? t('shared.standard.apiStatus') : t('shared.standard.mockStatus'),
);
const { hasPermission } = usePermission();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const tableData = ref<SystemRoleRecord[]>([]);
const menuTree = ref<BackendMenuItem[]>([]);
const formVisible = ref(false);
const permissionVisible = ref(false);
const currentRecord = ref<SystemRoleRecord | null>(null);
const submitLoading = ref(false);
const permissionLoading = ref(false);
const queryForm = reactive({
  keyword: '',
});
const searchFields: SearchFormField[] = [
  {
    label: t('systemRole.fields.keyword'),
    prop: 'keyword',
    placeholder: t('systemRole.fields.keywordPlaceholder'),
  },
];

async function loadRoles() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    const result = await getSystemRolesApi({
      keyword: queryForm.keyword,
    });
    tableData.value = result.list;
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : t('systemRole.messages.loadFailed');
  }
}

function handleSearch() {
  loadRoles();
}

function handleReset() {
  queryForm.keyword = '';
  loadRoles();
}

async function ensureMenuTreeLoaded() {
  if (menuTree.value.length) {
    return;
  }

  const result = await getSystemMenusApi();
  menuTree.value = result.list;
}

function openCreateDialog() {
  currentRecord.value = null;
  formVisible.value = true;
}

function openEditDialog(row: SystemRoleRecord) {
  currentRecord.value = row;
  formVisible.value = true;
}

async function openPermissionDialog(row: SystemRoleRecord) {
  currentRecord.value = row;
  await ensureMenuTreeLoaded();
  permissionVisible.value = true;
}

async function handleSubmit(payload: SystemRolePayload) {
  submitLoading.value = true;

  try {
    if (currentRecord.value) {
      await updateSystemRoleApi(currentRecord.value.id, payload);
      ElMessage.success(t('systemRole.messages.updateSuccess'));
    } else {
      await createSystemRoleApi(payload);
      ElMessage.success(t('systemRole.messages.createSuccess'));
    }

    formVisible.value = false;
    await loadRoles();
  } finally {
    submitLoading.value = false;
  }
}

async function handleDelete(row: SystemRoleRecord) {
  const confirmed = await confirmDelete(t('systemRole.messages.deleteConfirm', { name: row.name }));

  if (!confirmed) {
    return;
  }

  await deleteSystemRoleApi(row.id);
  ElMessage.success(t('systemRole.messages.deleteSuccess'));
  await loadRoles();
}

async function handleStatusChange(row: SystemRoleRecord, value: number | string | boolean) {
  await updateSystemRoleApi(row.id, {
    code: row.code,
    name: row.name,
    sort: row.sort,
    status: Number(value),
    remark: row.remark || '',
  });

  ElMessage.success(
    t('systemRole.messages.statusChanged', {
      status: Number(value) === 1 ? t('common.status.active') : t('common.status.inactive'),
    }),
  );
  await loadRoles();
}

async function handlePermissionSubmit(payload: { roleId: string; menuIds: string[] }) {
  permissionLoading.value = true;

  try {
    await updateSystemRoleMenusApi(payload.roleId, { menuIds: payload.menuIds });
    ElMessage.success(t('systemRole.messages.permissionSaveSuccess'));
    permissionVisible.value = false;
    await loadRoles();
  } catch (error) {
    ElMessage.error(
      error instanceof Error ? error.message : t('systemRole.messages.permissionSaveFailed'),
    );
  } finally {
    permissionLoading.value = false;
  }
}

onMounted(() => {
  loadRoles();
});
</script>

<template>
  <PageContainer :title="t('systemRole.title')">
    <template #extra>
      <div class="role-page__toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!hasPermission('system:role:create')"
          @click="openCreateDialog"
        >
          {{ t('systemRole.create') }}
        </el-button>
        <el-button circle :icon="RefreshRight" @click="loadRoles" />
      </div>
    </template>

    <el-alert type="info" :closable="false" class="role-page__alert">
      <template #title>
        {{
          t('systemRole.sourceDescription', { dataSource: dataSourceLabel, status: sourceStatus })
        }}
      </template>
    </el-alert>

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
      :error-text="errorText || t('shared.proTable.errorText')"
      :error-title="t('systemRole.messages.loadFailed')"
      row-key="id"
      @retry="loadRoles"
    >
      <el-table-column :label="t('systemRole.table.name')" min-width="160">
        <template #default="{ row }">
          <div class="role-page__name">
            <span>{{ row.name }}</span>
            <el-tag v-if="row.id === 'admin'" size="small" effect="plain">{{
              t('systemRole.table.builtIn')
            }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemRole.table.code')" prop="code" min-width="140" />

      <el-table-column :label="t('systemRole.table.sort')" prop="sort" width="90" align="center" />

      <el-table-column :label="t('systemRole.table.status')" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.id === 'admin' || !hasPermission('system:role:edit')"
            @change="(value: string | number | boolean) => handleStatusChange(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="t('systemRole.table.permissions')" width="110" align="center">
        <template #default="{ row }">
          <el-tag effect="light">{{ row.permissions.length }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemRole.table.users')" width="110" align="center">
        <template #default="{ row }">
          <span>{{ row.userCount }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemRole.table.createdAt')" prop="createdAt" min-width="180" />

      <el-table-column :label="t('systemRole.table.actions')" width="270" fixed="right">
        <template #default="{ row }">
          <div class="role-page__actions">
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:role:auth')"
              @click="openPermissionDialog(row)"
            >
              {{ t('systemRole.actions.assignPermissions') }}
            </el-button>
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:role:edit')"
              @click="openEditDialog(row)"
            >
              {{ t('common.action.edit') }}
            </el-button>
            <el-button
              text
              type="danger"
              :disabled="row.id === 'admin' || !hasPermission('system:role:delete')"
              @click="handleDelete(row)"
            >
              {{ t('common.action.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </ProTable>

    <RoleFormDialog
      :visible="formVisible"
      :record="currentRecord"
      :submitting="submitLoading"
      @submit="handleSubmit"
      @update:visible="formVisible = $event"
    />

    <RolePermissionDialog
      :visible="permissionVisible"
      :record="currentRecord"
      :menu-tree="menuTree"
      :submitting="permissionLoading"
      @submit="handlePermissionSubmit"
      @update:visible="permissionVisible = $event"
    />
  </PageContainer>
</template>

<style scoped>
.role-page__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-page__alert {
  margin-bottom: 16px;
}

.role-page__name,
.role-page__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
