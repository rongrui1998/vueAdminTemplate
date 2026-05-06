<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import PageContainer from '@/components/PageContainer/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import ProTable from '@/components/ProTable/index.vue';

const { t } = useI18n();

const loading = ref(false);
const formModel = ref({
  keyword: '',
  owner: '',
  status: '',
});

const ownerOptions = computed(() => [
  { label: 'Mia', value: 'mia' },
  { label: 'Noah', value: 'noah' },
  { label: 'Luna', value: 'luna' },
]);

const statusOptions = computed(() => [
  { label: t('i18nDemo.status.active'), value: 'active' },
  { label: t('i18nDemo.status.inactive'), value: 'inactive' },
  { label: t('i18nDemo.status.draft'), value: 'draft' },
]);

const tableData = computed(() => [
  {
    id: '1',
    name: t('i18nDemo.title'),
    code: 'I18N-001',
    owner: 'Mia',
    updatedAt: '2026-05-06 18:30:00',
    status: t('i18nDemo.status.active'),
  },
  {
    id: '2',
    name: `${t('i18nDemo.menu')} B`,
    code: 'I18N-002',
    owner: 'Noah',
    updatedAt: '2026-05-06 15:20:00',
    status: t('i18nDemo.status.draft'),
  },
]);

function handleSearch() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 200);
}

function handleReset() {
  formModel.value = {
    keyword: '',
    owner: '',
    status: '',
  };
}

function showSuccess() {
  ElMessage.success(t('i18nDemo.feedback.successMessage'));
}
</script>

<template>
  <PageContainer :title="t('i18nDemo.menu')">
    <div class="i18n-example-page">
      <section class="i18n-example-page__hero">
        <h2>{{ t('i18nDemo.title') }}</h2>
        <p>{{ t('i18nDemo.subtitle') }}</p>
      </section>

      <el-alert
        type="info"
        :closable="false"
        :title="t('i18nDemo.feedback.alertTitle')"
        :description="t('i18nDemo.feedback.alertDescription')"
      />

      <el-card shadow="never">
        <template #header>
          <div class="i18n-example-page__section-header">
            <strong>{{ t('i18nDemo.sections.filters') }}</strong>
            <div class="i18n-example-page__actions">
              <el-button @click="showSuccess">{{ t('i18nDemo.actions.refresh') }}</el-button>
              <el-button type="primary">{{ t('i18nDemo.actions.create') }}</el-button>
            </div>
          </div>
        </template>

        <SearchForm
          v-model="formModel"
          :fields="[
            {
              prop: 'keyword',
              label: t('i18nDemo.filters.keyword'),
              type: 'input',
              placeholder: t('i18nDemo.filters.keywordPlaceholder'),
            },
            {
              prop: 'owner',
              label: t('i18nDemo.filters.owner'),
              type: 'select',
              placeholder: t('i18nDemo.filters.ownerPlaceholder'),
              options: ownerOptions,
            },
            {
              prop: 'status',
              label: t('i18nDemo.filters.status'),
              type: 'select',
              placeholder: t('i18nDemo.filters.status'),
              options: statusOptions,
            },
          ]"
          @search="handleSearch"
          @reset="handleReset"
        />
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="i18n-example-page__section-header">
            <strong>{{ t('i18nDemo.sections.table') }}</strong>
            <el-button type="primary" plain>{{ t('i18nDemo.actions.export') }}</el-button>
          </div>
        </template>

        <ProTable :data="tableData" :loading="loading" row-key="id">
          <el-table-column prop="name" :label="t('i18nDemo.table.name')" min-width="220" />
          <el-table-column prop="code" :label="t('i18nDemo.table.code')" min-width="140" />
          <el-table-column prop="owner" :label="t('i18nDemo.table.owner')" min-width="120" />
          <el-table-column
            prop="updatedAt"
            :label="t('i18nDemo.table.updatedAt')"
            min-width="180"
          />
          <el-table-column :label="t('i18nDemo.table.status')" min-width="140">
            <template #default="{ row }">
              <el-tag :type="row.status === t('i18nDemo.status.active') ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </ProTable>
      </el-card>
    </div>
  </PageContainer>
</template>

<style scoped>
.i18n-example-page {
  display: grid;
  gap: 16px;
}

.i18n-example-page__hero {
  padding: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
  background: linear-gradient(135deg, rgb(64 158 255 / 12%), rgb(103 194 58 / 10%));
}

.i18n-example-page__hero h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.i18n-example-page__hero p {
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
}

.i18n-example-page__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.i18n-example-page__actions {
  display: flex;
  gap: 12px;
}
</style>
