<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { FullScreen, Plus, RefreshRight } from '@element-plus/icons-vue';
import {
  createSystemMenuApi,
  deleteSystemMenuApi,
  getSystemMenusApi,
  updateSystemMenuApi,
} from '@/api/system-menu';
import AppIcon from '@/components/AppIcon/index.vue';
import PageContainer from '@/components/PageContainer/index.vue';
import { getStandardDataSourceLabel, isStandardApiMode } from '@/constants/standard';
import type { SystemMenuFormMode, SystemMenuPayload, SystemMenuRecord } from '@/types/system-menu';
import { menuTypeLabelMap, menuTypeTagTypeMap } from './constants';
import MenuFormDialog from './components/MenuFormDialog.vue';

interface ParentOption {
  id: string;
  label: string;
}

const dataSourceLabel = computed(() => getStandardDataSourceLabel());
const sourceStatus = computed(() => (isStandardApiMode() ? '接口联调中' : 'Mock 先行中'));
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const tableData = ref<SystemMenuRecord[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<SystemMenuFormMode>('create-root');
const currentRecord = ref<SystemMenuRecord | null>(null);
const parentRecord = ref<SystemMenuRecord | null>(null);
const submitLoading = ref(false);
const expandAll = ref(true);
const tableRenderKey = ref(0);

const parentOptions = computed<ParentOption[]>(() => {
  const result: ParentOption[] = [];

  function walk(list: SystemMenuRecord[], level = 0) {
    list.forEach((item) => {
      result.push({
        id: item.id,
        label: `${'  '.repeat(level)}${item.name}`,
      });

      if (item.children?.length) {
        walk(item.children, level + 1);
      }
    });
  }

  walk(tableData.value);
  return result;
});

function normalizePath(path = '') {
  if (!path) {
    return '-';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

async function loadMenus() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    const result = await getSystemMenusApi();
    tableData.value = result.list;
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : '加载菜单数据失败';
  }
}

function openCreateRootDialog() {
  currentRecord.value = null;
  parentRecord.value = null;
  dialogMode.value = 'create-root';
  dialogVisible.value = true;
}

function openCreateChildDialog(row: SystemMenuRecord) {
  currentRecord.value = null;
  parentRecord.value = row;
  dialogMode.value = 'create-child';
  dialogVisible.value = true;
}

function openEditDialog(row: SystemMenuRecord) {
  currentRecord.value = row;
  parentRecord.value = null;
  dialogMode.value = 'edit';
  dialogVisible.value = true;
}

async function handleDelete(row: SystemMenuRecord) {
  const confirmed = window.confirm(`确认删除“${row.name}”吗？如存在下级节点会一并删除。`);

  if (!confirmed) {
    return;
  }

  await deleteSystemMenuApi(row.id);
  ElMessage.success('菜单删除成功');
  await loadMenus();
}

async function handleSubmit(payload: SystemMenuPayload) {
  submitLoading.value = true;

  try {
    if (dialogMode.value === 'edit' && currentRecord.value) {
      await updateSystemMenuApi(currentRecord.value.id, payload);
      ElMessage.success('菜单修改成功');
    } else {
      await createSystemMenuApi(payload);
      ElMessage.success(dialogMode.value === 'create-child' ? '下级菜单新增成功' : '菜单新增成功');
    }

    dialogVisible.value = false;
    await loadMenus();
  } finally {
    submitLoading.value = false;
  }
}

function toggleExpandAll() {
  expandAll.value = !expandAll.value;
  tableRenderKey.value += 1;
}

function getRowTypeLabel(row: SystemMenuRecord) {
  return menuTypeLabelMap[row.type];
}

function getRowTypeTag(row: SystemMenuRecord) {
  return menuTypeTagTypeMap[row.type];
}

onMounted(() => {
  loadMenus();
});
</script>

<template>
  <PageContainer title="菜单管理">
    <template #extra>
      <div class="menu-page__toolbar">
        <el-button type="primary" :icon="Plus" @click="openCreateRootDialog">新增菜单</el-button>
        <el-button circle :icon="RefreshRight" @click="loadMenus" />
        <el-button circle :icon="FullScreen" @click="toggleExpandAll" />
      </div>
    </template>

    <section class="menu-page">
      <div class="menu-page__meta">
        <div class="menu-page__meta-item">
          <span class="menu-page__meta-label">当前数据源</span>
          <span class="menu-page__meta-value">{{ dataSourceLabel }}</span>
        </div>
        <el-tag type="warning" effect="plain">{{ sourceStatus }}</el-tag>
      </div>

      <div v-if="pageStatus === 'error'" class="menu-page__state">
        <el-result icon="error" title="菜单加载失败" :sub-title="errorText || '请稍后重试'">
          <template #extra>
            <el-button type="primary" @click="loadMenus">重新加载</el-button>
          </template>
        </el-result>
      </div>

      <div v-else class="menu-page__table-shell">
        <el-table
          v-if="pageStatus === 'success'"
          :key="tableRenderKey"
          :data="tableData"
          row-key="id"
          class="menu-page__table"
          :default-expand-all="expandAll"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column label="标题" min-width="300">
            <template #default="{ row }">
              <div class="menu-page__name-cell">
                <AppIcon :name="row.icon || 'Menu'" :size="18" />
                <span class="menu-page__name-text">{{ row.name }}</span>
                <span
                  v-if="row.type === 'directory' && row.id === 'system-root'"
                  class="menu-page__badge"
                >
                  new
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getRowTypeTag(row)" effect="dark">
                {{ getRowTypeLabel(row) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="权限标识" min-width="220">
            <template #default="{ row }">
              <span class="menu-page__muted">{{ row.permission || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="路由地址" min-width="190">
            <template #default="{ row }">
              <span class="menu-page__muted">{{ normalizePath(row.path) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="页面组件" min-width="220">
            <template #default="{ row }">
              <span class="menu-page__muted">{{ row.component || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <div class="menu-page__actions">
                <el-button
                  text
                  type="primary"
                  :disabled="row.type === 'button'"
                  @click="openCreateChildDialog(row)"
                >
                  新增下级
                </el-button>
                <el-button text type="primary" @click="openEditDialog(row)">修改</el-button>
                <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-skeleton v-else animated :rows="6" />
      </div>
    </section>

    <MenuFormDialog
      :visible="dialogVisible"
      :mode="dialogMode"
      :record="currentRecord"
      :parent-record="parentRecord"
      :parent-options="parentOptions"
      :submitting="submitLoading"
      @submit="handleSubmit"
      @update:visible="dialogVisible = $event"
    />
  </PageContainer>
</template>

<style scoped>
.menu-page {
  padding: 18px;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgb(64 158 255 / 0.1), transparent 18%),
    linear-gradient(180deg, rgb(8 17 37 / 0.96), rgb(5 12 28 / 0.98));
}

.menu-page__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-page__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.menu-page__meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-page__meta-label {
  color: rgb(166 176 198 / 0.76);
  font-size: 13px;
}

.menu-page__meta-value {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.menu-page__state,
.menu-page__table-shell {
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 18px;
  overflow: hidden;
  background: rgb(6 14 31 / 0.9);
}

.menu-page__name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-page__name-text {
  color: #f5f7fa;
  font-size: 15px;
  font-weight: 700;
}

.menu-page__badge {
  padding: 3px 9px;
  border-radius: 999px;
  background: rgb(64 158 255 / 0.16);
  color: rgb(92 177 255);
  font-size: 12px;
  font-weight: 700;
}

.menu-page__muted {
  color: rgb(210 220 237 / 0.82);
}

.menu-page__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.menu-page__table.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgb(38 58 95 / 0.24);
  --el-table-header-bg-color: rgb(32 44 69 / 0.98);
  --el-table-border-color: rgb(255 255 255 / 0.08);
  --el-table-text-color: rgb(243 247 255 / 0.94);
  --el-table-header-text-color: rgb(193 203 220 / 0.88);
  --el-table-fixed-box-shadow: none;
}

:deep(.menu-page__table .el-table__header-wrapper th) {
  height: 54px;
  font-size: 14px;
  font-weight: 700;
}

:deep(.menu-page__table .el-table__row td) {
  padding: 18px 0;
}

:deep(.menu-page__table .el-table__cell) {
  background: transparent;
}

@media (max-width: 900px) {
  .menu-page__meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .menu-page__toolbar {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
