<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';
import ModalForm from '@/components/ModalForm/index.vue';
import type { SystemRolePayload, SystemRoleRecord } from '@/types/system-role';

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  record?: SystemRoleRecord | null;
}>();

const emit = defineEmits<{
  (event: 'submit', payload: SystemRolePayload): void;
  (event: 'update:visible', value: boolean): void;
}>();

const formRef = ref<FormInstance>();
const { t } = useI18n();
const formModel = reactive<SystemRolePayload>({
  code: '',
  name: '',
  sort: 1,
  status: 1,
  remark: '',
});

const dialogTitle = computed(() =>
  props.record ? t('systemRole.form.editTitle') : t('systemRole.form.createTitle'),
);

const rules: FormRules<SystemRolePayload> = {
  name: [
    { required: true, message: t('systemRole.form.validation.nameRequired'), trigger: 'blur' },
  ],
  code: [
    { required: true, message: t('systemRole.form.validation.codeRequired'), trigger: 'blur' },
  ],
};

function resetFormModel() {
  Object.assign(formModel, {
    code: props.record?.code || '',
    name: props.record?.name || '',
    sort: props.record?.sort || 1,
    status: props.record?.status ?? 1,
    remark: props.record?.remark || '',
  });
}

watch(
  () => [props.visible, props.record?.id],
  ([visible]) => {
    if (visible) {
      resetFormModel();
    }
  },
  { immediate: true },
);

async function submitForm() {
  const isValid = await formRef.value?.validate().catch(() => false);

  if (!isValid) {
    return;
  }

  emit('submit', {
    ...formModel,
    code: formModel.code.trim(),
    name: formModel.name.trim(),
    remark: formModel.remark.trim(),
  });
}
</script>

<template>
  <ModalForm
    :visible="visible"
    :title="dialogTitle"
    width="560px"
    :submitting="submitting"
    :confirm-text="t('common.action.save')"
    @confirm="submitForm"
    @update:visible="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-form-item :label="t('systemRole.form.name')" prop="name">
        <el-input v-model="formModel.name" :placeholder="t('systemRole.form.placeholders.name')" />
      </el-form-item>

      <el-form-item :label="t('systemRole.form.code')" prop="code">
        <el-input v-model="formModel.code" :placeholder="t('systemRole.form.placeholders.code')" />
      </el-form-item>

      <el-form-item :label="t('systemRole.form.sort')">
        <el-input-number v-model="formModel.sort" :min="1" :max="999" />
      </el-form-item>

      <el-form-item :label="t('systemRole.form.status')">
        <el-radio-group v-model="formModel.status">
          <el-radio-button :value="1">{{ t('common.status.active') }}</el-radio-button>
          <el-radio-button :value="0">{{ t('common.status.inactive') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('systemRole.form.remark')">
        <el-input
          v-model="formModel.remark"
          type="textarea"
          :rows="3"
          :placeholder="t('systemRole.form.placeholders.remark')"
        />
      </el-form-item>
    </el-form>
  </ModalForm>
</template>
