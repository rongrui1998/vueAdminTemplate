<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
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
const formModel = reactive<SystemRolePayload>({
  code: '',
  name: '',
  sort: 1,
  status: 1,
  remark: '',
});

const dialogTitle = computed(() => (props.record ? '修改角色' : '新增角色'));

const rules: FormRules<SystemRolePayload> = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
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

function closeDialog() {
  emit('update:visible', false);
}

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
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="560px"
    destroy-on-close
    @close="closeDialog"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入角色名称" />
      </el-form-item>

      <el-form-item label="角色编码" prop="code">
        <el-input v-model="formModel.code" placeholder="请输入角色编码，例如 admin" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="formModel.sort" :min="1" :max="999" />
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="formModel.status">
          <el-radio-button :value="1">启用</el-radio-button>
          <el-radio-button :value="0">停用</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="formModel.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>
