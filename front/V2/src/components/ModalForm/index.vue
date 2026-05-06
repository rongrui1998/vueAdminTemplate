<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
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
  },
);

const { t } = useI18n();
const resolvedConfirmText = computed(() => props.confirmText || t('common.action.confirm'));
const resolvedCancelText = computed(() => props.cancelText || t('common.action.cancel'));

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
        <el-button @click="closeDialog">{{ resolvedCancelText }}</el-button>
        <el-button type="primary" :loading="submitting" @click="emit('confirm')">
          {{ resolvedConfirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>
