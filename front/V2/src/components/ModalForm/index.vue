<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean;
    title: string;
    width?: string;
    submitting?: boolean;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {
    width: '620px',
    submitting: false,
    confirmText: '确定',
    cancelText: '取消',
  },
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirm'): void;
}>();

function closeDialog() {
  emit('update:visible', false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="width"
    destroy-on-close
    @close="closeDialog"
  >
    <slot />

    <template #footer>
      <slot name="footer">
        <el-button @click="closeDialog">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="submitting" @click="emit('confirm')">
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>
