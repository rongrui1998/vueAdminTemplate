<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DemoUserForm, DemoUserItem } from '@/types/demo';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    currentRow?: DemoUserItem | null;
    submitting?: boolean;
  }>(),
  {
    currentRow: null,
    submitting: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [value: DemoUserForm];
}>();

const formRef = ref<FormInstance>();
const { t } = useI18n();
const formModel = reactive<DemoUserForm>({
  name: '',
  email: '',
  role: '',
  department: '',
  status: 1,
});

const rules = {
  name: [{ required: true, message: t('crudDemo.form.validation.nameRequired'), trigger: 'blur' }],
  email: [
    { required: true, message: t('crudDemo.form.validation.emailRequired'), trigger: 'blur' },
  ],
  role: [{ required: true, message: t('crudDemo.form.validation.roleRequired'), trigger: 'blur' }],
  department: [
    { required: true, message: t('crudDemo.form.validation.departmentRequired'), trigger: 'blur' },
  ],
};

watch(
  () => props.currentRow,
  (value) => {
    formModel.name = value?.name || '';
    formModel.email = value?.email || '';
    formModel.role = value?.role || '';
    formModel.department = value?.department || '';
    formModel.status = value?.status ?? 1;
  },
  { immediate: true },
);

async function handleSubmit() {
  await formRef.value?.validate();
  emit('submit', { ...formModel });
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="currentRow ? t('crudDemo.form.editTitle') : t('crudDemo.form.createTitle')"
    width="520px"
    :close-on-click-modal="!submitting"
    :close-on-press-escape="!submitting"
    :show-close="!submitting"
    @close="emit('update:modelValue', false)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px">
      <el-form-item :label="t('crudDemo.form.name')" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item :label="t('crudDemo.form.email')" prop="email">
        <el-input v-model="formModel.email" />
      </el-form-item>
      <el-form-item :label="t('crudDemo.form.role')" prop="role">
        <el-input v-model="formModel.role" />
      </el-form-item>
      <el-form-item :label="t('crudDemo.form.department')" prop="department">
        <el-input v-model="formModel.department" />
      </el-form-item>
      <el-form-item :label="t('crudDemo.form.status')">
        <el-switch v-model="formModel.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="submitting" @click="emit('update:modelValue', false)">{{
        t('common.action.cancel')
      }}</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">{{
        t('common.action.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>
