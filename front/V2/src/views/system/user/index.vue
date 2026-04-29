<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
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
const sourceStatus = computed(() => (isStandardApiMode() ? '接口联调中' : 'Mock 先行中'));
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
    label: '关键词',
    prop: 'keyword',
    placeholder: '登录账号 / 用户昵称',
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
    errorText.value = error instanceof Error ? error.message : '加载用户数据失败';
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
      ElMessage.success('用户修改成功');
    } else {
      await createSystemUserApi(payload);
      ElMessage.success('用户新增成功');
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

  ElMessage.success(`已${Number(value) === 1 ? '启用' : '停用'}用户`);
  await loadUsers();
}

async function handleResetPassword(row: SystemUserRecord) {
  const confirmed = await confirmAction({
    title: '重置密码',
    message: `确认将“${row.nickname}”的密码重置为 123456 吗？`,
    confirmButtonText: '确认重置',
  });

  if (!confirmed) {
    return;
  }

  await resetSystemUserPasswordApi(row.id, { password: '123456' });
  ElMessage.success('密码已重置为 123456');
}

async function handleDelete(row: SystemUserRecord) {
  const confirmed = await confirmDelete(`确认删除“${row.nickname}”吗？`);

  if (!confirmed) {
    return;
  }

  await deleteSystemUserApi(row.id);
  ElMessage.success('用户删除成功');
  await loadUsers();
}

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <PageContainer title="用户管理">
    <template #extra>
      <div class="user-page__toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!hasPermission('system:user:create')"
          @click="openCreateDialog"
        >
          新增用户
        </el-button>
        <el-button circle :icon="RefreshRight" @click="loadUsers" />
      </div>
    </template>

    <el-alert type="info" :closable="false" class="user-page__alert">
      <template #title>
        当前数据源：{{ dataSourceLabel }}，{{ sourceStatus }}。用户管理已支持 mock / api
        双模式列表、角色绑定和账号维护。
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
      :error-text="errorText || '请稍后重试'"
      error-title="用户加载失败"
      row-key="id"
      @retry="loadUsers"
    >
      <el-table-column label="登录账号" prop="username" min-width="140" />

      <el-table-column label="用户昵称" min-width="150">
        <template #default="{ row }">
          <div class="user-page__name">
            <span>{{ row.nickname }}</span>
            <el-tag v-if="row.username === 'admin'" size="small" effect="plain">内置</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="绑定角色" min-width="200">
        <template #default="{ row }">
          <div class="user-page__roles">
            <el-tag v-for="roleName in row.roleNames" :key="roleName" effect="light">
              {{ roleName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120" align="center">
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

      <el-table-column label="最后登录" prop="lastLoginAt" min-width="170" />

      <el-table-column label="创建时间" prop="createdAt" min-width="170" />

      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <div class="user-page__actions">
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:user:reset')"
              @click="handleResetPassword(row)"
            >
              重置密码
            </el-button>
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:user:edit')"
              @click="openEditDialog(row)"
            >
              修改
            </el-button>
            <el-button
              text
              type="danger"
              :disabled="row.username === 'admin' || !hasPermission('system:user:delete')"
              @click="handleDelete(row)"
            >
              删除
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
