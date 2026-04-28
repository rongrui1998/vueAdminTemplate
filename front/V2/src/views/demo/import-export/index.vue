<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';
import DrawerForm from '@/components/DrawerForm/index.vue';
import { buildCsvText, parseCsvText, type CsvRow } from '@/utils/csv';

const fileInputRef = ref<HTMLInputElement>();
const previewVisible = ref(false);
const importedRows = ref<CsvRow[]>([]);
const sampleRows = ref<CsvRow[]>([
  { name: '系统管理员', email: 'admin@example.com', role: 'admin', status: '启用' },
  { name: '运营编辑', email: 'editor@example.com', role: 'editor', status: '启用' },
  { name: '访客账号', email: 'guest@example.com', role: 'guest', status: '停用' },
]);
const columns = computed(() => {
  const firstRow = importedRows.value[0] || sampleRows.value[0] || {};
  return Object.keys(firstRow);
});

function openFilePicker() {
  fileInputRef.value?.click();
}

function downloadCsv(filename: string, rows: CsvRow[]) {
  const csvText = buildCsvText(rows);
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

  const text = await file.text();
  importedRows.value = parseCsvText(text);
  previewVisible.value = true;
  input.value = '';
  ElMessage.success(`已读取 ${importedRows.value.length} 行数据`);
}

function confirmImport() {
  sampleRows.value = importedRows.value;
  previewVisible.value = false;
  ElMessage.success('导入预览数据已应用到示例表格');
}
</script>

<template>
  <PageContainer title="导入导出示例">
    <div class="import-export-page">
      <section class="import-export-page__hero">
        <p class="import-export-page__eyebrow">Standard 能力</p>
        <h2>上传、导入预览和导出可以先做轻量前端闭环</h2>
        <p>
          这个页面演示 CSV 文件选择、数据预览和本地导出。真实项目可以把确认导入换成后端接口，
          也可以把 CSV 工具替换为 Excel 解析库。
        </p>
      </section>

      <el-card shadow="never">
        <template #header>
          <div class="import-export-page__toolbar">
            <strong>导入导出演示</strong>
            <div>
              <el-button @click="openFilePicker">选择 CSV 导入</el-button>
              <el-button type="primary" @click="downloadCsv('accounts.csv', sampleRows)">
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
        confirm-text="确认导入"
        @confirm="confirmImport"
        @update:visible="previewVisible = $event"
      >
        <ProTable :data="importedRows" row-key="email">
          <el-table-column
            v-for="column in columns"
            :key="column"
            :prop="column"
            :label="column"
            min-width="130"
          />
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
</style>
