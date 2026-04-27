<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
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

const dialogTitle = computed(() => {
  if (props.mode === 'edit') {
    return '修改菜单';
  }

  if (props.mode === 'create-child') {
    return '新增下级菜单';
  }

  return '新增菜单';
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
  name: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [
    {
      validator: (_rule, value, callback) => {
        if (!shouldShowPath.value) {
          callback();
          return;
        }

        if (!String(value || '').trim()) {
          callback(new Error('请输入路由地址'));
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
          callback(new Error('请输入页面组件路径'));
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
          callback(new Error('请输入权限标识'));
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

function closeDialog() {
  emit('update:visible', false);
}

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
    remark: formModel.remark.trim(),
  };

  emit('submit', payload);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="720px"
    destroy-on-close
    @close="closeDialog"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <el-select v-model="selectedParentId" placeholder="选择上级菜单" class="w-full">
              <el-option label="作为顶级菜单" :value="ROOT_PARENT_VALUE" />
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
          <el-form-item label="菜单类型" prop="type">
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
          <el-form-item label="菜单标题" prop="name">
            <el-input v-model="formModel.name" placeholder="请输入菜单标题" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="图标名称">
            <el-input v-model="formModel.icon" placeholder="例如：Menu / Setting / User" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowPath" :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="formModel.path" placeholder="例如：/system/menu" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowComponent" :span="12">
          <el-form-item label="页面组件" prop="component">
            <el-input v-model="formModel.component" placeholder="例如：system/menu/index" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowPermission" :span="12">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="formModel.permission" placeholder="例如：system:menu:view" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number v-model="formModel.sort" :min="1" :max="999" class="w-full" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="状态">
            <el-switch
              v-model="formModel.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否隐藏">
            <el-switch v-model="formModel.hidden" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowMenuFlags" :span="12">
          <el-form-item label="页面缓存">
            <el-switch v-model="formModel.keepAlive" />
          </el-form-item>
        </el-col>

        <el-col v-if="shouldShowMenuFlags" :span="12">
          <el-form-item label="固定标签">
            <el-switch v-model="formModel.affix" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formModel.remark"
              type="textarea"
              :rows="3"
              placeholder="补充当前菜单节点用途说明"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="menu-form-dialog__footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存菜单</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.w-full {
  width: 100%;
}

.menu-form-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
