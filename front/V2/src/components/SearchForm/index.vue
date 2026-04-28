<script setup lang="ts">
import { reactive, watch } from 'vue';

export interface SearchFormOption {
  label: string;
  value: string | number | boolean;
}

export interface SearchFormField {
  label: string;
  prop: string;
  type?: 'input' | 'select';
  placeholder?: string;
  options?: SearchFormOption[];
  clearable?: boolean;
}

type SearchFormValue = string | number | boolean | undefined;
type SearchFormModel = Record<string, SearchFormValue>;

const props = withDefaults(
  defineProps<{
    modelValue: SearchFormModel;
    fields: SearchFormField[];
  }>(),
  {
    fields: () => [],
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: SearchFormModel): void;
  (event: 'search', value: SearchFormModel): void;
  (event: 'reset', value: SearchFormModel): void;
}>();

const formModel = reactive<SearchFormModel>({});

watch(
  () => props.modelValue,
  (value) => {
    Object.keys(formModel).forEach((key) => {
      delete formModel[key];
    });
    Object.assign(formModel, value);
  },
  { immediate: true, deep: true },
);

function cloneModel() {
  return { ...formModel };
}

function updateField(prop: string, value: SearchFormValue) {
  formModel[prop] = value;
  emit('update:modelValue', cloneModel());
}

function handleSearch() {
  emit('search', cloneModel());
}

function handleReset() {
  const nextModel = props.fields.reduce<SearchFormModel>((result, field) => {
    result[field.prop] = '';
    return result;
  }, {});

  Object.keys(formModel).forEach((key) => {
    delete formModel[key];
  });
  Object.assign(formModel, nextModel);
  emit('update:modelValue', cloneModel());
  emit('reset', cloneModel());
}
</script>

<template>
  <el-card shadow="never" class="search-form">
    <el-form :model="formModel" inline class="search-form__inner">
      <el-form-item v-for="field in fields" :key="field.prop" :label="field.label">
        <el-select
          v-if="field.type === 'select'"
          :model-value="formModel[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :clearable="field.clearable ?? true"
          class="search-form__control"
          @update:model-value="(value: SearchFormValue) => updateField(field.prop, value)"
        >
          <el-option
            v-for="option in field.options || []"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-input
          v-else
          :model-value="String(formModel[field.prop] ?? '')"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :clearable="field.clearable ?? true"
          class="search-form__control"
          @update:model-value="(value: string) => updateField(field.prop, value)"
          @keyup.enter="handleSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.search-form__inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 12px;
}

.search-form__inner :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form__control {
  width: 220px;
}
</style>
