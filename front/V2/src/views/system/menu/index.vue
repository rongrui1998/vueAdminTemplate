<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowRight, FullScreen, Plus, RefreshRight } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { usePermission } from '@/composables/usePermission';
import {
  createSystemMenuApi,
  deleteSystemMenuApi,
  getSystemMenusApi,
  updateSystemMenuApi,
} from '@/api/system-menu';
import AppIcon from '@/components/AppIcon/index.vue';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import { getStandardDataSourceLabel, isStandardApiMode } from '@/constants/standard';
import type { SystemMenuFormMode, SystemMenuPayload, SystemMenuRecord } from '@/types/system-menu';
import { confirmDelete } from '@/utils/confirm';
import { menuTypeLabelMap, menuTypeTagTypeMap } from './constants';
import MenuFormDialog from './components/MenuFormDialog.vue';

interface ParentOption {
  id: string;
  label: string;
}

type MenuTableRow = Omit<SystemMenuRecord, 'children'> & {
  __expanded: boolean;
  __hasChildren: boolean;
  __level: number;
};

const dataSourceLabel = computed(() => getStandardDataSourceLabel());
const { t } = useI18n();
const sourceStatus = computed(() =>
  isStandardApiMode() ? t('shared.standard.apiStatus') : t('shared.standard.mockStatus'),
);
const { hasPermission } = usePermission();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const tableData = ref<SystemMenuRecord[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<SystemMenuFormMode>('create-root');
const currentRecord = ref<SystemMenuRecord | null>(null);
const parentRecord = ref<SystemMenuRecord | null>(null);
const submitLoading = ref(false);
const expandAll = ref(false);
const expandedRowIds = ref<Set<string>>(new Set());

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

const visibleRows = computed<MenuTableRow[]>(() => {
  const result: MenuTableRow[] = [];

  function walk(list: SystemMenuRecord[], level = 0) {
    list.forEach((item) => {
      const { children, ...row } = item;
      const hasChildren = Boolean(item.children?.length);
      const expanded = expandedRowIds.value.has(item.id);

      result.push({
        ...row,
        __expanded: expanded,
        __hasChildren: hasChildren,
        __level: level,
      });

      if (hasChildren && expanded) {
        walk(children || [], level + 1);
      }
    });
  }

  walk(tableData.value);
  return result;
});

function collectExpandableIds(list: SystemMenuRecord[]) {
  const ids: string[] = [];

  function walk(items: SystemMenuRecord[]) {
    items.forEach((item) => {
      if (item.children?.length) {
        ids.push(item.id);
        walk(item.children);
      }
    });
  }

  walk(list);
  return ids;
}

function syncExpandedRows(list: SystemMenuRecord[]) {
  expandedRowIds.value = expandAll.value ? new Set(collectExpandableIds(list)) : new Set();
}

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
    syncExpandedRows(result.list);
    pageStatus.value = 'success';
  } catch (error) {
    tableData.value = [];
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : t('systemMenu.messages.loadFailed');
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
  const confirmed = await confirmDelete(t('systemMenu.messages.deleteConfirm', { name: row.name }));

  if (!confirmed) {
    return;
  }

  await deleteSystemMenuApi(row.id);
  ElMessage.success(t('systemMenu.messages.deleteSuccess'));
  await loadMenus();
}

async function handleSubmit(payload: SystemMenuPayload) {
  submitLoading.value = true;

  try {
    if (dialogMode.value === 'edit' && currentRecord.value) {
      await updateSystemMenuApi(currentRecord.value.id, payload);
      ElMessage.success(t('systemMenu.messages.updateSuccess'));
    } else {
      await createSystemMenuApi(payload);
      ElMessage.success(
        dialogMode.value === 'create-child'
          ? t('systemMenu.messages.createChildSuccess')
          : t('systemMenu.messages.createSuccess'),
      );
    }

    dialogVisible.value = false;
    await loadMenus();
  } finally {
    submitLoading.value = false;
  }
}

function toggleExpandAll() {
  expandAll.value = !expandAll.value;
  syncExpandedRows(tableData.value);
}

function toggleRowExpand(row: MenuTableRow) {
  if (!row.__hasChildren) {
    return;
  }

  const nextIds = new Set(expandedRowIds.value);

  if (row.__expanded) {
    nextIds.delete(row.id);
  } else {
    nextIds.add(row.id);
  }

  expandedRowIds.value = nextIds;
}

function getRowTypeLabel(row: SystemMenuRecord) {
  return menuTypeLabelMap[row.type];
}

function getRowTypeTag(row: SystemMenuRecord) {
  return menuTypeTagTypeMap[row.type];
}

async function handleStatusChange(row: SystemMenuRecord, value: number | string | boolean) {
  await updateSystemMenuApi(row.id, {
    parentId: row.parentId ?? null,
    type: row.type,
    name: row.name,
    nameEn: row.nameEn || '',
    path: row.path,
    component: row.component,
    permission: row.permission || '',
    icon: row.icon || 'Menu',
    sort: row.sort || 1,
    status: Number(value),
    hidden: Boolean(row.hidden),
    keepAlive: Boolean(row.keepAlive),
    affix: Boolean(row.affix),
    remark: row.remark || '',
  });

  ElMessage.success(
    t('systemMenu.messages.statusChanged', {
      status: Number(value) === 1 ? t('common.status.active') : t('common.status.inactive'),
    }),
  );
  await loadMenus();
}

onMounted(() => {
  loadMenus();
});
</script>

<template>
  <PageContainer :title="t('systemMenu.title')">
    <template #extra>
      <div class="menu-page__toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!hasPermission('system:menu:create')"
          @click="openCreateRootDialog"
        >
          {{ t('systemMenu.create') }}
        </el-button>
        <el-button circle :icon="RefreshRight" @click="loadMenus" />
        <el-button circle :icon="FullScreen" @click="toggleExpandAll" />
      </div>
    </template>

    <el-alert type="info" :closable="false" class="menu-page__alert">
      <template #title>
        {{
          t('systemMenu.sourceDescription', { dataSource: dataSourceLabel, status: sourceStatus })
        }}
      </template>
    </el-alert>

    <ProTable
      :data="visibleRows"
      :loading="pageStatus === 'loading'"
      :error="pageStatus === 'error'"
      :error-text="errorText || t('shared.proTable.errorText')"
      :error-title="t('systemMenu.messages.loadFailed')"
      row-key="id"
      table-class="menu-page__table"
      @retry="loadMenus"
    >
      <el-table-column :label="t('systemMenu.table.name')" min-width="280">
        <template #default="{ row }">
          <div class="menu-page__name-cell">
            <span
              v-if="row.__level > 0"
              class="menu-page__name-indent"
              :style="{ width: `${row.__level * 32}px` }"
            />
            <button
              v-if="row.__hasChildren"
              type="button"
              class="menu-page__expand-trigger"
              :aria-label="
                row.__expanded ? t('systemMenu.actions.collapse') : t('systemMenu.actions.expand')
              "
              @click.stop="toggleRowExpand(row)"
            >
              <el-icon :size="14">
                <ArrowDown v-if="row.__expanded" />
                <ArrowRight v-else />
              </el-icon>
            </button>
            <span v-else class="menu-page__expand-placeholder" />
            <AppIcon :name="row.icon || 'Menu'" :size="18" />
            <span class="menu-page__name-text">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.type')" width="110">
        <template #default="{ row }">
          <el-tag :type="getRowTypeTag(row)" effect="light">
            {{ getRowTypeLabel(row) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.sort')" width="100" align="center">
        <template #default="{ row }">
          <span class="menu-page__sort-value">{{ row.sort ?? 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.permission')" min-width="220">
        <template #default="{ row }">
          <span class="menu-page__muted">{{ row.permission || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.path')" min-width="190">
        <template #default="{ row }">
          <span class="menu-page__muted">{{ normalizePath(row.path) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.component')" min-width="220">
        <template #default="{ row }">
          <span class="menu-page__muted">{{ row.component || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.status')" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status ?? 1"
            :active-value="1"
            :inactive-value="0"
            :disabled="!hasPermission('system:menu:edit')"
            @change="(value: string | number | boolean) => handleStatusChange(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="t('systemMenu.table.actions')" width="240" fixed="right">
        <template #default="{ row }">
          <div class="menu-page__actions">
            <el-button
              text
              type="primary"
              :disabled="row.type === 'button' || !hasPermission('system:menu:create')"
              @click="openCreateChildDialog(row)"
            >
              {{ t('systemMenu.createChild') }}
            </el-button>
            <el-button
              text
              type="primary"
              :disabled="!hasPermission('system:menu:edit')"
              @click="openEditDialog(row)"
            >
              {{ t('common.action.edit') }}
            </el-button>
            <el-button
              text
              type="danger"
              :disabled="!hasPermission('system:menu:delete')"
              @click="handleDelete(row)"
            >
              {{ t('common.action.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <template #empty>
        <div class="menu-page__state">
          <el-empty :description="t('systemMenu.empty.description')">
            <template #default>
              <div class="menu-page__empty-actions">
                <el-button type="primary" @click="openCreateRootDialog">{{
                  t('systemMenu.create')
                }}</el-button>
                <el-button @click="loadMenus">{{ t('systemMenu.actions.refresh') }}</el-button>
              </div>
            </template>
          </el-empty>
        </div>
      </template>
    </ProTable>

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
.menu-page__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-page__alert {
  margin-bottom: 16px;
}

.menu-page__state {
  padding: 24px 0;
}

.menu-page__empty-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.menu-page__name-cell {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
  white-space: nowrap;
}

.menu-page__name-indent {
  display: inline-flex;
  flex: 0 0 auto;
}

.menu-page__expand-trigger,
.menu-page__expand-placeholder {
  display: inline-flex;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
}

.menu-page__expand-trigger {
  padding: 0;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  transition: color 0.2s ease;
}

.menu-page__expand-trigger:hover {
  color: var(--el-color-primary);
}

.menu-page__name-text {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
}

.menu-page__muted {
  color: var(--el-text-color-secondary);
}

.menu-page__sort-value {
  display: inline-flex;
  min-width: 32px;
  justify-content: center;
  color: var(--el-text-color-regular);
  font-weight: 600;
}

.menu-page__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.menu-page__table.el-table) {
  --el-table-fixed-right-column: var(--el-bg-color);
  --el-table-fixed-box-shadow: none;
}

:deep(.menu-page__table .el-table__header-wrapper th) {
  height: 56px;
  font-size: 14px;
  font-weight: 700;
}

:deep(.menu-page__table .el-table__row td) {
  padding: 16px 0;
}

@media (max-width: 900px) {
  .menu-page__toolbar {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
