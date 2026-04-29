<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PageContainer from '@/components/PageContainer/index.vue';
import {
  createDemoUserApi,
  deleteDemoUserApi,
  getDemoUserDetailApi,
  getDemoUsersApi,
  updateDemoUserApi,
} from '@/api/demo';
import { usePermission } from '@/composables/usePermission';
import type { DemoUserForm, DemoUserItem } from '@/types/demo';
import { confirmDelete } from '@/utils/confirm';
import DemoDetailDrawer from '@/views/demo/crud/components/DemoDetailDrawer.vue';
import DemoFormDialog from '@/views/demo/crud/components/DemoFormDialog.vue';

const loading = ref(false);
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const pageErrorText = ref('');
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const currentRow = ref<DemoUserItem | null>(null);
const detailRow = ref<DemoUserItem | null>(null);
const detailRowId = ref('');
const detailLoading = ref(false);
const detailErrorText = ref('');
const submitLoading = ref(false);
const deletingRowId = ref('');
const statusLoadingMap = reactive<Record<string, boolean>>({});
const total = ref(0);
const tableData = ref<DemoUserItem[]>([]);
const { hasPermission } = usePermission();

const queryForm = reactive({
  keyword: '',
  status: '' as number | '',
  pageNum: 1,
  pageSize: 10,
});

async function loadTableData() {
  loading.value = true;
  pageErrorText.value = '';

  if (!tableData.value.length) {
    pageStatus.value = 'loading';
  }

  try {
    const result = await getDemoUsersApi(queryForm);
    tableData.value = result.list;
    total.value = result.total;
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    total.value = 0;
    pageStatus.value = 'error';
    pageErrorText.value = error instanceof Error ? error.message : '获取列表失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  queryForm.pageNum = 1;
  loadTableData();
}

function handleReset() {
  queryForm.keyword = '';
  queryForm.status = '';
  queryForm.pageNum = 1;
  queryForm.pageSize = 10;
  loadTableData();
}

function handleCreate() {
  currentRow.value = null;
  dialogVisible.value = true;
}

function handleEdit(row: DemoUserItem) {
  currentRow.value = row;
  dialogVisible.value = true;
}

async function loadDetail(id: string) {
  detailLoading.value = true;
  detailErrorText.value = '';
  detailRow.value = null;

  try {
    detailRow.value = await getDemoUserDetailApi(id);
  } catch (error) {
    detailErrorText.value = error instanceof Error ? error.message : '获取详情失败，请稍后重试';
  } finally {
    detailLoading.value = false;
  }
}

async function handleDetail(row: DemoUserItem) {
  detailRowId.value = row.id;
  drawerVisible.value = true;
  await loadDetail(row.id);
}

function handleRetryDetail() {
  if (detailRowId.value) {
    loadDetail(detailRowId.value);
  }
}

async function handleDelete(row: DemoUserItem) {
  if (deletingRowId.value) {
    return;
  }

  const confirmed = await confirmDelete(`确认删除账号「${row.name}」吗？`);

  if (!confirmed) {
    return;
  }

  deletingRowId.value = row.id;

  try {
    await deleteDemoUserApi(row.id);
    ElMessage.success('删除成功');

    if (tableData.value.length === 1 && queryForm.pageNum > 1) {
      queryForm.pageNum -= 1;
    }

    await loadTableData();
  } finally {
    deletingRowId.value = '';
  }
}

async function handleStatusChange(row: DemoUserItem, value: number) {
  if (statusLoadingMap[row.id]) {
    return;
  }

  statusLoadingMap[row.id] = true;

  try {
    await updateDemoUserApi(row.id, {
      name: row.name,
      email: row.email,
      role: row.role,
      department: row.department,
      status: value,
    });
    ElMessage.success('状态更新成功');
    await loadTableData();
  } finally {
    delete statusLoadingMap[row.id];
  }
}

async function handleSubmit(formData: DemoUserForm) {
  if (submitLoading.value) {
    return;
  }

  submitLoading.value = true;

  try {
    if (currentRow.value) {
      await updateDemoUserApi(currentRow.value.id, formData);
      ElMessage.success('编辑成功');
    } else {
      await createDemoUserApi(formData);
      ElMessage.success('新增成功');
    }

    dialogVisible.value = false;
    await loadTableData();
  } finally {
    submitLoading.value = false;
  }
}

onMounted(() => {
  loadTableData();
});
</script>

<template>
  <PageContainer title="CRUD 示例">
    <el-card shadow="never">
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="关键字">
          <el-input v-model="queryForm.keyword" placeholder="姓名 / 邮箱" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 160px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button v-permission="'demo:crud:create'" type="success" @click="handleCreate"
            >新增账号</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template v-if="pageStatus === 'error'">
        <div class="crud-page__state">
          <el-result icon="error" title="加载失败" :sub-title="pageErrorText || '请稍后重试'">
            <template #extra>
              <el-button type="primary" @click="loadTableData">重新加载</el-button>
            </template>
          </el-result>
        </div>
      </template>

      <template v-else-if="pageStatus === 'success' && !tableData.length">
        <div class="crud-page__state">
          <el-empty description="暂无查询结果">
            <template #default>
              <div class="crud-page__empty-actions">
                <el-button v-permission="'demo:crud:create'" type="primary" @click="handleCreate"
                  >新增账号</el-button
                >
                <el-button @click="handleReset">重置筛选</el-button>
              </div>
            </template>
          </el-empty>
        </div>
      </template>

      <template v-else>
        <el-table v-loading="loading" :data="tableData">
          <el-table-column prop="name" label="姓名" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="220" />
          <el-table-column prop="role" label="角色" min-width="140" />
          <el-table-column prop="department" label="部门" min-width="140" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status"
                :active-value="1"
                :inactive-value="0"
                :loading="Boolean(statusLoadingMap[row.id])"
                :disabled="Boolean(statusLoadingMap[row.id]) || !hasPermission('demo:crud:edit')"
                @change="
                  (value: string | number | boolean) => handleStatusChange(row, Number(value))
                "
              />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="180" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button text type="primary" @click="handleDetail(row)">详情</el-button>
                <el-button
                  v-permission="'demo:crud:edit'"
                  text
                  type="primary"
                  @click="handleEdit(row)"
                  >编辑</el-button
                >
                <el-button
                  v-permission="'demo:crud:delete'"
                  text
                  type="danger"
                  :loading="deletingRowId === row.id"
                  :disabled="deletingRowId === row.id"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="total > 0" class="crud-page__pagination">
          <el-pagination
            v-model:current-page="queryForm.pageNum"
            v-model:page-size="queryForm.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadTableData"
            @current-change="loadTableData"
          />
        </div>
      </template>
    </el-card>

    <DemoFormDialog
      v-model="dialogVisible"
      :current-row="currentRow"
      :submitting="submitLoading"
      @submit="handleSubmit"
    />
    <DemoDetailDrawer
      v-model="drawerVisible"
      :detail="detailRow"
      :loading="detailLoading"
      :error="detailErrorText"
      @retry="handleRetryDetail"
    />
  </PageContainer>
</template>

<style scoped>
.crud-page__state {
  padding: 24px 0;
}

.crud-page__empty-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.crud-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
