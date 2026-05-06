<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getSystemRolesApi } from '@/api/system-role';
import {
  createSystemUserApi,
  deleteSystemUserApi,
  getSystemUsersApi,
  resetSystemUserPasswordApi,
  updateSystemUserApi,
} from '@/api/system-user';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';
import { usePermission } from '@/composables/usePermission';
import { getStandardDataSourceLabel, isStandardApiMode } from '@/constants/standard';
import type { SystemRoleRecord } from '@/types/system-role';
import type { SystemUserPayload, SystemUserRecord } from '@/types/system-user';
import { confirmAction, confirmDelete } from '@/utils/confirm';
import UserFormDialog from './components/UserFormDialog.vue';

const dataSourceLabel = computed(() => getStandardDataSourceLabel());
const { t } = useI18n();
const sourceStatus = computed(() =>
  isStandardApiMode() ? t('shared.standard.apiStatus') : t('shared.standard.mockStatus'),
);
const { hasPermission } = usePermission();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const tableData = ref<SystemUserRecord[]>([]);
const roleOptions = ref<SystemRoleRecord[]>([]);
const formVisible = ref(false);
const currentRecord = ref<SystemUserRecord | null>(null);
const submitLoading = ref(false);
const queryForm = reactive({
  keyword: '',
});
const searchFields: SearchFormField[] = [
  {
    label: t('systemUser.fields.keyword'),
    prop: 'keyword',
    placeholder: t('systemUser.fields.keywordPlaceholder'),
  },
];

async function loadUsers() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    const result = await getSystemUsersApi({
      keyword: queryForm.keyword,
    });
    tableData.value = result.list;
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : t('systemUser.messages.loadFailed');
  }
}

function handleSearch() {
  loadUsers();
}

function handleReset() {
  queryForm.keyword = '';
  loadUsers();
}

async function ensureRoleOptionsLoaded() {
  if (roleOptions.value.length) {
    return;
  }

  const result = await getSystemRolesApi();
  roleOptions.value = result.list;
}

async function openCreateDialog() {
  currentRecord.value = null;
  await ensureRoleOptionsLoaded();
  formVisible.value = true;
}

async function openEditDialog(row: SystemUserRecord) {
  currentRecord.value = row;
  await ensureRoleOptionsLoaded();
  formVisible.value = true;
}

async function handleSubmit(payload: SystemUserPayload) {
  submitLoading.value = true;

  try {
    if (currentRecord.value) {
      await updateSystemUserApi(currentRecord.value.id, payload);
      ElMessage.success(t('systemUser.messages.updateSuccess'));
    } else {
      await createSystemUserApi(payload);
      ElMessage.success(t('systemUser.messages.createSuccess'));
    }

    formVisible.value = false;
    await loadUsers();
  } finally {
    submitLoading.value = false;
  }
}

async function handleStatusChange(row: SystemUserRecord, value: number | string | boolean) {
  await updateSystemUserApi(row.id, {
    username: row.username,
    nickname: row.nickname,
    roleIds: row.roleIds,
    status: Number(value),
    remark: row.remark || '',
  });

  ElMessage.success(
    t('systemUser.messages.statusChanged', {
      status: Number(value) === 1 ? t('common.status.active') : t('common.status.inactive'),
    }),
  );
  await loadUsers();
}

async function handleResetPassword(row: SystemUserRecord) {
  const confirmed = await confirmAction({
    title: t('systemUser.dialog.resetPasswordTitle'),
    message: t('systemUser.messages.resetPasswordConfirm', { name: row.nickname }),
    confirmButtonText: t('systemUser.dialog.resetPasswordConfirm'),
  });

  if (!confirmed) {
    return;
  }

  await resetSystemUserPasswordApi(row.id, { password: '123456' });
  ElMessage.success(t('systemUser.messages.passwordResetSuccess'));
}

async function handleDelete(row: SystemUserRecord) {
  const confirmed = await confirmDelete(
    t('systemUser.messages.deleteConfirm', { name: row.nickname }),
  );

  if (!confirmed) {
    return;
  }

  await deleteSystemUserApi(row.id);
  ElMessage.success(t('systemUser.messages.deleteSuccess'));
  await loadUsers();
}

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <PageContainer :title="t('systemUser.title')">
    <template #extra>
      <div class="user-page__toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!hasPermission('system:user:create')"
          @click="openCreateDialog"
        >
          {{ t('systemUser.create') }}
        </el-button>
        <el-button circle :icon="RefreshRight" @click="loadUsers" />
      </div>
    </template>

    <el-alert type="info" :closable="false" class="user-page__alert">
      <template #title>
        {{
          t('shared.standard.mock') === dataSourceLabel
            ? t('shared.standard.mock')
            : dataSourceLabel
        }}
        <span style="display: none">{{ sourceStatus }}</span>
        {{
          t('systemUser.sourceDescription', { dataSource: dataSourceLabel, status: sourceStatus })
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
      :error-title="t('systemUser.messages.loadFailed')"
      row-key="id"
      @retry="loadUsers"
    >
      <el-table-column :label="t('systemUser.table.username')" prop="username" min-width="140" />

      <el-table-column :label="t('systemUser.table.nickname')" min-width="150">
        <template #default="{ row }">
          <div class="user-page__name">
            <span>{{ row.nickname }}</span>
            <el-tag v-if="row.username === 'admin'" size="small" effect="plain">{{
              t('systemUser.table.builtIn')
            }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemUser.table.roleNames')" min-width="200">
        <template #default="{ row }">
          <div class="user-page__roles">
            <el-tag v-for="roleName in row.roleNames" :key="roleName" effect="light">
              {{ roleName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemUser.table.status')" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.username === 'admin' || !hasPermission('system:user:edit')"
            @change="(value: string | number | boolean) => handleStatusChange(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column
        :label="t('systemUser.table.lastLoginAt')"
        prop="lastLoginAt"
        min-width="170"
      />

      <el-table-column :label="t('systemUser.table.createdAt')" prop="createdAt" min-width="170" />

      <el-table-column :label="t('systemUser.table.actions')" width="300" fixed="right">
        <template #default="{ row }">
          <div class="user-page__actions">
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:user:reset')"
              @click="handleResetPassword(row)"
            >
              {{ t('systemUser.actions.resetPassword') }}
            </el-button>
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:user:edit')"
              @click="openEditDialog(row)"
            >
              {{ t('common.action.edit') }}
            </el-button>
            <el-button
              text
              type="danger"
              :disabled="row.username === 'admin' || !hasPermission('system:user:delete')"
              @click="handleDelete(row)"
            >
              {{ t('common.action.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </ProTable>

    <UserFormDialog
      :visible="formVisible"
      :record="currentRecord"
      :role-options="roleOptions"
      :submitting="submitLoading"
      @submit="handleSubmit"
      @update:visible="formVisible = $event"
    />
  </PageContainer>
</template>

<style scoped>
.user-page__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-page__alert {
  margin-bottom: 16px;
}

.user-page__name,
.user-page__roles,
.user-page__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-page__roles {
  flex-wrap: wrap;
}
</style>
