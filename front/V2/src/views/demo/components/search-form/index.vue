<script setup lang="ts">
import { reactive, ref } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import SearchForm, { type SearchFormField } from '@/components/SearchForm/index.vue';

const nativeForm = reactive({
  keyword: '',
  status: '',
});
const wrappedForm = reactive({
  keyword: 'admin',
  status: 'enabled',
});
const lastQuery = ref<Record<string, unknown>>({});
const fields: SearchFormField[] = [
  {
    label: '关键词',
    prop: 'keyword',
    placeholder: '姓名 / 账号 / 邮箱',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '停用', value: 'disabled' },
    ],
  },
];

function handleSearch(payload: Record<string, unknown>) {
  lastQuery.value = payload;
}

function resetNativeForm() {
  nativeForm.keyword = '';
  nativeForm.status = '';
}
</script>

<template>
  <PageContainer title="SearchForm 示例">
    <div class="component-demo">
      <section class="component-demo__hero">
        <p class="component-demo__eyebrow">可选封装</p>
        <h2>查询表单可以自己写，也可以用 SearchForm 快速搭建</h2>
        <p>
          `SearchForm` 适合标准列表页的查询区，统一处理字段布局、查询、重置和 `modelValue`
          同步。复杂联动场景仍然可以直接写原生 `el-form`。
        </p>
      </section>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-card shadow="never" class="component-demo__card">
            <template #header>原生 Element Plus 写法</template>
            <el-form :inline="true" :model="nativeForm">
              <el-form-item label="关键词">
                <el-input v-model="nativeForm.keyword" placeholder="姓名 / 账号 / 邮箱" />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="nativeForm.status" placeholder="请选择状态" clearable>
                  <el-option label="启用" value="enabled" />
                  <el-option label="停用" value="disabled" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button @click="resetNativeForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="component-demo__card">
            <template #header>模板封装写法</template>
            <SearchForm
              :model-value="wrappedForm"
              :fields="fields"
              @update:model-value="Object.assign(wrappedForm, $event)"
              @search="handleSearch"
              @reset="handleSearch"
            />
            <el-alert
              type="success"
              :closable="false"
              class="component-demo__result"
              :title="`最近一次查询：${JSON.stringify(lastQuery)}`"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never" class="component-demo__usage">
        <template #header>推荐使用场景</template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="适合"
            >关键词、状态、类型、日期等常规查询区</el-descriptions-item
          >
          <el-descriptions-item label="不适合"
            >字段强联动、复杂自定义插槽特别多的表单</el-descriptions-item
          >
          <el-descriptions-item label="原则"
            >封装提效，不替代 Element Plus 原生能力</el-descriptions-item
          >
        </el-descriptions>
      </el-card>
    </div>
  </PageContainer>
</template>

<style scoped>
.component-demo {
  display: grid;
  gap: 16px;
}

.component-demo__hero {
  padding: 22px 24px;
  background: linear-gradient(135deg, rgb(64 158 255 / 14%), rgb(103 194 58 / 10%));
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
}

.component-demo__hero h2 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.component-demo__hero p {
  max-width: 820px;
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.component-demo__eyebrow {
  color: var(--el-color-primary) !important;
  font-weight: 700;
}

.component-demo__card {
  min-height: 240px;
}

.component-demo__result {
  margin-top: 12px;
}

.component-demo__usage {
  margin-top: 4px;
}
</style>
