<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';
import ModalForm from '@/components/ModalForm/index.vue';
import type { SystemRoleRecord } from '@/types/system-role';
import type { SystemUserPayload, SystemUserRecord } from '@/types/system-user';

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  record?: SystemUserRecord | null;
  roleOptions: SystemRoleRecord[];
}>();

const emit = defineEmits<{
  (event: 'submit', payload: SystemUserPayload): void;
  (event: 'update:visible', value: boolean): void;
}>();

const formRef = ref<FormInstance>();
const { t } = useI18n();
const formModel = reactive<SystemUserPayload>({
  username: '',
  nickname: '',
  password: '123456',
  roleIds: [],
  status: 1,
  remark: '',
});

const dialogTitle = computed(() =>
  props.record ? t('systemUser.form.editTitle') : t('systemUser.form.createTitle'),
);
const isEditMode = computed(() => Boolean(props.record));

const rules: FormRules<SystemUserPayload> = {
  username: [
    { required: true, message: t('systemUser.form.validation.usernameRequired'), trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: t('systemUser.form.validation.nicknameRequired'), trigger: 'blur' },
  ],
  roleIds: [
    { required: true, message: t('systemUser.form.validation.roleIdsRequired'), trigger: 'change' },
  ],
};

function resetFormModel() {
  Object.assign(formModel, {
    username: props.record?.username || '',
    nickname: props.record?.nickname || '',
    password: '123456',
    roleIds: props.record?.roleIds ? [...props.record.roleIds] : [],
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

  const payload: SystemUserPayload = {
    username: formModel.username.trim(),
    nickname: formModel.nickname.trim(),
    roleIds: [...formModel.roleIds],
    status: formModel.status,
    remark: formModel.remark.trim(),
  };

  if (!isEditMode.value) {
    payload.password = formModel.password?.trim() || '123456';
  }

  emit('submit', payload);
}
</script>

<template>
  <ModalForm
    :title="dialogTitle"
    width="620px"
    :visible="visible"
    :submitting="submitting"
    :confirm-text="t('common.action.save')"
    @confirm="submitForm"
    @update:visible="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="t('systemUser.form.username')" prop="username">
            <el-input
              v-model="formModel.username"
              :disabled="isEditMode"
              :placeholder="t('systemUser.form.placeholders.username')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemUser.form.nickname')" prop="nickname">
            <el-input
              v-model="formModel.nickname"
              :placeholder="t('systemUser.form.placeholders.nickname')"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="!isEditMode" :span="12">
          <el-form-item :label="t('systemUser.form.initialPassword')">
            <el-input
              v-model="formModel.password"
              show-password
              :placeholder="t('systemUser.form.placeholders.password')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemUser.form.status')">
            <el-radio-group v-model="formModel.status">
              <el-radio-button :value="1">{{ t('common.status.active') }}</el-radio-button>
              <el-radio-button :value="0">{{ t('common.status.inactive') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="t('systemUser.form.roleIds')" prop="roleIds">
            <el-select
              v-model="formModel.roleIds"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :placeholder="t('systemUser.form.placeholders.roleIds')"
              class="w-full"
            >
              <el-option
                v-for="role in roleOptions"
                :key="role.id"
                :label="role.name"
                :value="role.id"
                :disabled="role.status === 0"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="t('systemUser.form.remark')">
            <el-input
              v-model="formModel.remark"
              type="textarea"
              :rows="3"
              :placeholder="t('systemUser.form.placeholders.remark')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ModalForm>
</template>
