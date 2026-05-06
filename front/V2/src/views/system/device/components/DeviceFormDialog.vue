<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import ModalForm from '@/components/ModalForm/index.vue';
import type { DeviceCreatePayload, DeviceRecord } from '@/types/device';

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  record?: DeviceRecord | null;
}>();

const emit = defineEmits<{
  (event: 'submit', payload: DeviceCreatePayload): void;
  (event: 'update:visible', value: boolean): void;
}>();

const formRef = ref<FormInstance>();
const formModel = reactive<DeviceCreatePayload>({
  deviceId: '',
  deviceName: '',
  deviceType: '',
});

const isEditMode = computed(() => Boolean(props.record));
const dialogTitle = computed(() => (props.record ? '编辑设备' : '新增设备'));

const rules: FormRules<DeviceCreatePayload> = {
  deviceId: [{ required: true, message: '请填写设备编号', trigger: 'blur' }],
  deviceName: [{ required: true, message: '请填写设备名称', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请填写设备类型', trigger: 'blur' }],
};

function resetFormModel() {
  Object.assign(formModel, {
    deviceId: props.record?.deviceId || '',
    deviceName: props.record?.deviceName || '',
    deviceType: props.record?.deviceType || '',
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
    deviceId: formModel.deviceId.trim(),
    deviceName: formModel.deviceName.trim(),
    deviceType: formModel.deviceType.trim(),
  });
}
</script>

<template>
  <ModalForm
    :visible="visible"
    :title="dialogTitle"
    width="560px"
    :submitting="submitting"
    confirm-text="保存"
    @confirm="submitForm"
    @update:visible="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="设备编号" prop="deviceId">
            <el-input
              v-model="formModel.deviceId"
              :disabled="isEditMode"
              placeholder="请输入设备编号"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="formModel.deviceName" placeholder="请输入设备名称" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="设备类型" prop="deviceType">
            <el-input v-model="formModel.deviceType" placeholder="请输入设备类型" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ModalForm>
</template>
