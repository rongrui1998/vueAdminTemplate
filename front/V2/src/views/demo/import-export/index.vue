<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  confirmImportExportApi,
  exportImportExportApi,
  previewImportExportApi,
} from '@/api/import-export';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import DrawerForm from '@/components/DrawerForm/index.vue';
import type { ImportExportPreviewResult, ImportExportRow } from '@/types/import-export';

const fileInputRef = ref<HTMLInputElement>();
const previewVisible = ref(false);
const previewLoading = ref(false);
const confirmLoading = ref(false);
const exportLoading = ref(false);
const previewResult = ref<ImportExportPreviewResult | null>(null);
const sampleRows = ref<ImportExportRow[]>([
  { name: '系统管理员', email: 'admin@example.com', role: 'admin', status: '启用' },
  { name: '运营编辑', email: 'editor@example.com', role: 'editor', status: '启用' },
  { name: '访客账号', email: 'guest@example.com', role: 'guest', status: '停用' },
]);
const previewRows = computed(() => previewResult.value?.rows || []);
const validPreviewRows = computed(() =>
  previewRows.value.filter((row) => row.valid).map((row) => row.data),
);
const columns = computed(() => {
  const firstRow = previewRows.value[0]?.data || sampleRows.value[0] || {};
  return Object.keys(firstRow);
});

function openFilePicker() {
  fileInputRef.value?.click();
}

function downloadCsv(filename: string, csvText: string) {
  const blob = new Blob([`\uFEFF${csvText}`], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  previewLoading.value = true;

  try {
    const text = await file.text();
    previewResult.value = await previewImportExportApi(text);
    previewVisible.value = true;
    ElMessage.success(`已解析 ${previewResult.value.total} 行数据`);
  } finally {
    previewLoading.value = false;
    input.value = '';
  }
}

async function confirmImport() {
  if (!validPreviewRows.value.length) {
    ElMessage.warning('没有可导入的有效数据');
    return;
  }

  confirmLoading.value = true;

  try {
    const result = await confirmImportExportApi(validPreviewRows.value);
    sampleRows.value = [...validPreviewRows.value];
    previewVisible.value = false;
    ElMessage.success(`已导入 ${result.importedCount} 行有效数据`);
  } finally {
    confirmLoading.value = false;
  }
}

async function exportCurrentData() {
  exportLoading.value = true;

  try {
    const result = await exportImportExportApi();
    downloadCsv(result.filename, result.csvText);
    ElMessage.success('导出文件已生成');
  } finally {
    exportLoading.value = false;
  }
}
</script>

<template>
  <PageContainer title="导入导出示例">
    <div class="import-export-page">
      <section class="import-export-page__hero">
        <p class="import-export-page__eyebrow">Standard 能力</p>
        <h2>上传、导入预览和导出已经接入后端闭环</h2>
        <p>
          这个页面演示 CSV 文件选择、后端预览校验、确认导入和接口导出。真实项目可以继续替换为 Excel
          解析库、异步导入任务和错误行下载。
        </p>
      </section>

      <el-card shadow="never">
        <template #header>
          <div class="import-export-page__toolbar">
            <strong>导入导出演示</strong>
            <div>
              <el-button :loading="previewLoading" @click="openFilePicker">选择 CSV 导入</el-button>
              <el-button type="primary" :loading="exportLoading" @click="exportCurrentData">
                导出当前数据
              </el-button>
            </div>
          </div>
        </template>

        <input
          ref="fileInputRef"
          class="import-export-page__file-input"
          type="file"
          accept=".csv,text/csv"
          @change="handleFileChange"
        />

        <ProTable :data="sampleRows" row-key="email">
          <el-table-column
            v-for="column in columns"
            :key="column"
            :prop="column"
            :label="column"
            min-width="140"
          />
        </ProTable>
      </el-card>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-alert type="success" :closable="false" title="上传：选择本地 CSV 文件" />
        </el-col>
        <el-col :span="8">
          <el-alert type="warning" :closable="false" title="导入：先抽屉预览，再确认应用" />
        </el-col>
        <el-col :span="8">
          <el-alert type="info" :closable="false" title="导出：基于当前表格生成 CSV" />
        </el-col>
      </el-row>

      <DrawerForm
        :visible="previewVisible"
        title="导入预览"
        size="640px"
        :submitting="confirmLoading"
        confirm-text="确认导入"
        @confirm="confirmImport"
        @update:visible="previewVisible = $event"
      >
        <div v-if="previewResult" class="import-export-page__summary">
          <el-tag type="info">总行数 {{ previewResult.total }}</el-tag>
          <el-tag type="success">有效 {{ previewResult.validCount }}</el-tag>
          <el-tag type="danger">异常 {{ previewResult.invalidCount }}</el-tag>
        </div>

        <ProTable :data="previewRows" row-key="rowNumber">
          <el-table-column v-for="column in columns" :key="column" :label="column" min-width="130">
            <template #default="{ row }">
              {{ row.data[column] }}
            </template>
          </el-table-column>
          <el-table-column label="校验结果" min-width="180">
            <template #default="{ row }">
              <el-tag v-if="row.valid" type="success">通过</el-tag>
              <div v-else class="import-export-page__errors">
                <el-tag v-for="error in row.errors" :key="error" type="danger">
                  {{ error }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </ProTable>
      </DrawerForm>
    </div>
  </PageContainer>
</template>

<style scoped>
.import-export-page {
  display: grid;
  gap: 16px;
}

.import-export-page__hero {
  padding: 22px 24px;
  background: linear-gradient(135deg, rgb(64 158 255 / 14%), rgb(230 162 60 / 10%));
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
}

.import-export-page__hero h2 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.import-export-page__hero p {
  max-width: 840px;
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.import-export-page__eyebrow {
  color: var(--el-color-primary) !important;
  font-weight: 700;
}

.import-export-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.import-export-page__file-input {
  display: none;
}

.import-export-page__summary {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.import-export-page__errors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
