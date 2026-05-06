<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';
import ModalForm from '@/components/ModalForm/index.vue';
import type { SystemMenuFormMode, SystemMenuPayload, SystemMenuRecord } from '@/types/system-menu';
import { defaultMenuPayload, menuTypeOptions } from '../constants';

interface ParentOption {
  id: string;
  label: string;
}

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  mode: SystemMenuFormMode;
  record?: SystemMenuRecord | null;
  parentRecord?: SystemMenuRecord | null;
  parentOptions: ParentOption[];
}>();

const emit = defineEmits<{
  (event: 'submit', payload: SystemMenuPayload): void;
  (event: 'update:visible', value: boolean): void;
}>();

const formRef = ref<FormInstance>();
const ROOT_PARENT_VALUE = '__ROOT__';
const formModel = reactive<SystemMenuPayload>({
  ...defaultMenuPayload,
});
const { t } = useI18n();

const dialogTitle = computed(() => {
  if (props.mode === 'edit') {
    return t('systemMenu.form.editTitle');
  }

  if (props.mode === 'create-child') {
    return t('systemMenu.form.createChildTitle');
  }

  return t('systemMenu.form.createTitle');
});

const isButtonType = computed(() => formModel.type === 'button');
const shouldShowPath = computed(() => formModel.type !== 'button');
const shouldShowComponent = computed(() => formModel.type === 'menu');
const shouldShowPermission = computed(() => formModel.type !== 'directory');
const shouldShowMenuFlags = computed(() => formModel.type === 'menu');
const selectedParentId = computed({
  get: () => formModel.parentId ?? ROOT_PARENT_VALUE,
  set: (value: string) => {
    formModel.parentId = value === ROOT_PARENT_VALUE ? null : value;
  },
});

const rules: FormRules<SystemMenuPayload> = {
  name: [
    { required: true, message: t('systemMenu.form.validation.nameRequired'), trigger: 'blur' },
  ],
  type: [
    { required: true, message: t('systemMenu.form.validation.typeRequired'), trigger: 'change' },
  ],
  path: [
    {
      validator: (_rule, value, callback) => {
        if (!shouldShowPath.value) {
          callback();
          return;
        }

        if (!String(value || '').trim()) {
          callback(new Error(t('systemMenu.form.validation.pathRequired')));
          return;
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
  component: [
    {
      validator: (_rule, value, callback) => {
        if (!shouldShowComponent.value) {
          callback();
          return;
        }

        if (!String(value || '').trim()) {
          callback(new Error(t('systemMenu.form.validation.componentRequired')));
          return;
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
  permission: [
    {
      validator: (_rule, value, callback) => {
        if (!shouldShowPermission.value) {
          callback();
          return;
        }

        if (!String(value || '').trim()) {
          callback(new Error(t('systemMenu.form.validation.permissionRequired')));
          return;
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
};

function normalizeFromRecord(record?: SystemMenuRecord | null) {
  return {
    ...defaultMenuPayload,
    parentId: record?.parentId ?? null,
    type: record?.type || 'menu',
    name: record?.name || '',
    nameEn: record?.nameEn || '',
    path: record?.path || '',
    component: record?.component || '',
    permission: record?.permission || '',
    icon: record?.icon || 'Menu',
    sort: record?.sort || 1,
    status: record?.status ?? 1,
    hidden: Boolean(record?.hidden),
    keepAlive: Boolean(record?.keepAlive),
    affix: Boolean(record?.affix),
    remark: record?.remark || '',
  };
}

function resetFormModel() {
  let nextState = {
    ...defaultMenuPayload,
  };

  if (props.mode === 'edit' && props.record) {
    nextState = normalizeFromRecord(props.record);
  }

  if (props.mode === 'create-child') {
    nextState.parentId = props.parentRecord?.id || null;
  }

  if (props.mode === 'create-root') {
    nextState.parentId = null;
  }

  Object.assign(formModel, nextState);
}

watch(
  () => [props.visible, props.mode, props.record?.id, props.parentRecord?.id],
  ([visible]) => {
    if (!visible) {
      return;
    }

    resetFormModel();
  },
  { immediate: true },
);

watch(
  () => formModel.type,
  (type) => {
    if (type === 'directory') {
      formModel.component = 'ParentView';
      formModel.permission = '';
      formModel.keepAlive = false;
    }

    if (type === 'button') {
      formModel.path = '';
      formModel.component = '';
      formModel.icon = 'Document';
      formModel.hidden = false;
      formModel.keepAlive = false;
      formModel.affix = false;
    }
  },
);

async function submitForm() {
  const isValid = await formRef.value?.validate().catch(() => false);

  if (!isValid) {
    return;
  }

  const payload: SystemMenuPayload = {
    ...formModel,
    path: formModel.type === 'button' ? '' : formModel.path.trim(),
    component:
      formModel.type === 'directory'
        ? 'ParentView'
        : formModel.type === 'button'
          ? ''
          : formModel.component.trim(),
    permission: formModel.type === 'directory' ? '' : formModel.permission.trim(),
    icon: formModel.icon.trim() || (isButtonType.value ? 'Document' : 'Menu'),
    name: formModel.name.trim(),
    nameEn: formModel.nameEn.trim(),
    remark: formModel.remark.trim(),
  };

  emit('submit', payload);
}
</script>

<template>
  <ModalForm
    :visible="visible"
    :title="dialogTitle"
    width="720px"
    :submitting="submitting"
    :confirm-text="t('systemMenu.form.confirm')"
    @confirm="submitForm"
    @update:visible="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.parentId')">
            <el-select
              v-model="selectedParentId"
              :placeholder="t('systemMenu.form.parentPlaceholder')"
              class="w-full"
            >
              <el-option :label="t('systemMenu.form.rootParent')" :value="ROOT_PARENT_VALUE" />
              <el-option
                v-for="item in parentOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.type')" prop="type">
            <el-radio-group v-model="formModel.type">
              <el-radio-button
                v-for="item in menuTypeOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.name')" prop="name">
            <el-input
              v-model="formModel.name"
              :placeholder="t('systemMenu.form.placeholders.name')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.nameEn')" prop="nameEn">
            <el-input
              v-model="formModel.nameEn"
              :placeholder="t('systemMenu.form.placeholders.nameEn')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.icon')">
            <el-input
              v-model="formModel.icon"
              :placeholder="t('systemMenu.form.placeholders.icon')"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowPath" :span="12">
          <el-form-item :label="t('systemMenu.form.path')" prop="path">
            <el-input
              v-model="formModel.path"
              :placeholder="t('systemMenu.form.placeholders.path')"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowComponent" :span="12">
          <el-form-item :label="t('systemMenu.form.component')" prop="component">
            <el-input
              v-model="formModel.component"
              :placeholder="t('systemMenu.form.placeholders.component')"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowPermission" :span="12">
          <el-form-item :label="t('systemMenu.form.permission')" prop="permission">
            <el-input
              v-model="formModel.permission"
              :placeholder="t('systemMenu.form.placeholders.permission')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.sort')">
            <el-input-number v-model="formModel.sort" :min="1" :max="999" class="w-full" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.status')">
            <el-switch
              v-model="formModel.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              :active-text="t('common.status.active')"
              :inactive-text="t('common.status.inactive')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('systemMenu.form.hidden')">
            <el-switch v-model="formModel.hidden" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowMenuFlags" :span="12">
          <el-form-item :label="t('systemMenu.form.keepAlive')">
            <el-switch v-model="formModel.keepAlive" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowMenuFlags" :span="12">
          <el-form-item :label="t('systemMenu.form.affix')">
            <el-switch v-model="formModel.affix" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="t('systemMenu.form.remark')">
            <el-input
              v-model="formModel.remark"
              type="textarea"
              :rows="3"
              :placeholder="t('systemMenu.form.placeholders.remark')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ModalForm>
</template>

<style scoped>
.w-full {
  width: 100%;
}
</style>
