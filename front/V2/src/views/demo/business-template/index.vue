<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, RefreshRight } from '@element-plus/icons-vue';
import {
  createBusinessTemplateApi,
  deleteBusinessTemplateApi,
  getBusinessTemplateDetailApi,
  getBusinessTemplatesApi,
  updateBusinessTemplateApi,
} from '@/api/business-template';
import PageContainer from '@/components/PageContainer/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import ModalForm from '@/components/ModalForm/index.vue';
import DrawerForm from '@/components/DrawerForm/index.vue';
import type { BusinessTemplatePayload, BusinessTemplateRecord } from '@/types/business-template';
import { confirmDelete } from '@/utils/confirm';

const searchModel = ref({
  keyword: '',
  status: '' as number | '',
});
const loading = ref(false);
const pageError = ref(false);
const pageErrorText = ref('');
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const submitLoading = ref(false);
const detailLoading = ref(false);
const deletingRowId = ref('');
const currentRecord = ref<BusinessTemplateRecord | null>(null);
const editingRecord = ref<BusinessTemplateRecord | null>(null);
const records = ref<BusinessTemplateRecord[]>([]);
const total = ref(0);
const formModel = reactive({
  name: '',
  owner: '',
  scene: '',
  remark: '',
});

const fields: SearchFormField[] = [
  { label: '关键词', prop: 'keyword', placeholder: '搜索名称、负责人、场景' },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
  },
];

async function loadRecords() {
  loading.value = true;
  pageError.value = false;
  pageErrorText.value = '';

  try {
    const result = await getBusinessTemplatesApi(searchModel.value);
    records.value = result.list;
    total.value = result.total;
  } catch (error) {
    records.value = [];
    total.value = 0;
    pageError.value = true;
    pageErrorText.value = error instanceof Error ? error.message : '获取标准业务模板失败';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  editingRecord.value = null;
  formModel.name = '';
  formModel.owner = '';
  formModel.scene = '';
  formModel.remark = '';
  dialogVisible.value = true;
}

function openEditDialog(row: BusinessTemplateRecord) {
  editingRecord.value = row;
  formModel.name = row.name;
  formModel.owner = row.owner;
  formModel.scene = row.scene;
  formModel.remark = row.remark;
  dialogVisible.value = true;
}

async function confirmSubmit() {
  if (!formModel.name.trim()) {
    ElMessage.warning('请填写业务名称');
    return;
  }

  const payload: BusinessTemplatePayload = {
    name: formModel.name.trim(),
    owner: formModel.owner.trim() || '未分配',
    scene: formModel.scene.trim() || '通用业务',
    status: editingRecord.value?.status ?? 1,
    remark: formModel.remark.trim() || '由模板页快速创建的示例数据',
  };

  submitLoading.value = true;

  try {
    if (editingRecord.value) {
      await updateBusinessTemplateApi(editingRecord.value.id, payload);
      ElMessage.success('业务示例已更新');
    } else {
      await createBusinessTemplateApi(payload);
      ElMessage.success('示例数据已创建');
    }

    dialogVisible.value = false;
    await loadRecords();
  } finally {
    submitLoading.value = false;
  }
}

async function openDetail(row: BusinessTemplateRecord) {
  drawerVisible.value = true;
  detailLoading.value = true;

  try {
    currentRecord.value = await getBusinessTemplateDetailApi(row.id);
  } finally {
    detailLoading.value = false;
  }
}

async function toggleStatus(row: BusinessTemplateRecord) {
  const nextStatus = row.status === 1 ? 0 : 1;

  await updateBusinessTemplateApi(row.id, {
    name: row.name,
    owner: row.owner,
    scene: row.scene,
    status: nextStatus,
    remark: row.remark,
  });
  ElMessage.success(`${row.name} 已${nextStatus === 1 ? '启用' : '停用'}`);
  await loadRecords();
}

async function handleDelete(row: BusinessTemplateRecord) {
  if (deletingRowId.value) {
    return;
  }

  const confirmed = await confirmDelete(`确认删除“${row.name}”吗？`);

  if (!confirmed) {
    return;
  }

  deletingRowId.value = row.id;

  try {
    await deleteBusinessTemplateApi(row.id);
    ElMessage.success('业务示例已删除');
    await loadRecords();
  } finally {
    deletingRowId.value = '';
  }
}

function resetDemoData() {
  searchModel.value = {
    keyword: '',
    status: '',
  };
  loadRecords();
}

function handleSearch() {
  loadRecords();
}

onMounted(() => {
  loadRecords();
});
</script>

<template>
  <PageContainer title="标准业务模板">
    <div class="business-template-page">
      <section class="business-template-page__guide">
        <p class="business-template-page__eyebrow">Copyable Standard Page</p>
        <h2>把常见后台列表页的骨架一次性摆清楚</h2>
        <p>
          这个页面组合了 SearchForm、ProTable、ModalForm 和
          DrawerForm，适合复制后替换接口、字段和权限码。
        </p>
      </section>

      <SearchForm
        v-model="searchModel"
        :fields="fields"
        @search="handleSearch"
        @reset="resetDemoData"
      />

      <ProTable
        :data="records"
        row-key="id"
        :loading="loading"
        :error="pageError"
        :error-text="pageErrorText"
        @retry="loadRecords"
      >
        <template #header>
          <strong>标准列表区</strong>
          <span class="business-template-page__count">共 {{ total }} 条</span>
        </template>
        <template #extra>
          <el-button :icon="RefreshRight" @click="resetDemoData">重置示例</el-button>
          <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增业务</el-button>
        </template>

        <el-table-column prop="name" label="业务名称" min-width="170" />
        <el-table-column prop="owner" label="负责人" width="130" />
        <el-table-column prop="scene" label="业务场景" width="140" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" min-width="170" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <el-button link type="primary" @click="toggleStatus(row)">
              {{ row.status === 1 ? '停用' : '启用' }}
            </el-button>
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              link
              type="danger"
              :loading="deletingRowId === row.id"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无匹配数据，试试重置查询条件" />
        </template>
      </ProTable>

      <ModalForm
        :visible="dialogVisible"
        :title="editingRecord ? '编辑业务示例' : '新增业务示例'"
        :confirm-text="editingRecord ? '保存修改' : '创建示例'"
        :submitting="submitLoading"
        @confirm="confirmSubmit"
        @update:visible="dialogVisible = $event"
      >
        <el-form :model="formModel" label-width="96px">
          <el-form-item label="业务名称">
            <el-input v-model="formModel.name" placeholder="例如：合同模板维护" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="formModel.owner" placeholder="例如：业务中台" />
          </el-form-item>
          <el-form-item label="业务场景">
            <el-input v-model="formModel.scene" placeholder="例如：基础配置" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input
              v-model="formModel.remark"
              type="textarea"
              :rows="3"
              placeholder="补充业务说明"
            />
          </el-form-item>
        </el-form>
      </ModalForm>

      <DrawerForm
        :visible="drawerVisible"
        title="业务详情"
        size="520px"
        :show-footer="false"
        @update:visible="drawerVisible = $event"
      >
        <el-skeleton v-if="detailLoading" animated :rows="4" />
        <el-descriptions v-else-if="currentRecord" :column="1" border>
          <el-descriptions-item label="业务名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ currentRecord.owner }}</el-descriptions-item>
          <el-descriptions-item label="业务场景">{{ currentRecord.scene }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ currentRecord.status === 1 ? '启用' : '停用' }}
          </el-descriptions-item>
          <el-descriptions-item label="说明">{{ currentRecord.remark }}</el-descriptions-item>
        </el-descriptions>
      </DrawerForm>
    </div>
  </PageContainer>
</template>

<style scoped>
.business-template-page {
  display: grid;
  gap: 16px;
}

.business-template-page__guide {
  padding: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 16px;
  background:
    radial-gradient(circle at top left, rgb(103 194 58 / 0.16), transparent 32%),
    linear-gradient(135deg, rgb(255 255 255 / 0.92), rgb(248 252 247 / 0.88));
}

.dark .business-template-page__guide {
  background:
    radial-gradient(circle at top left, rgb(103 194 58 / 0.2), transparent 32%),
    linear-gradient(135deg, rgb(28 38 31 / 0.92), rgb(22 28 25 / 0.92));
}

.business-template-page__eyebrow {
  margin: 0 0 8px;
  color: var(--el-color-success);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.business-template-page__guide h2 {
  margin: 0 0 10px;
  font-size: 24px;
}

.business-template-page__guide p {
  max-width: 760px;
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.business-template-page__count {
  margin-left: 10px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 400;
}
</style>
