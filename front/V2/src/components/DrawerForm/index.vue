<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean;
    title: string;
    size?: string;
    submitting?: boolean;
    confirmText?: string;
    cancelText?: string;
    showFooter?: boolean;
  }>(),
  {
    size: '480px',
    submitting: false,
    confirmText: '确定',
    cancelText: '取消',
    showFooter: true,
  },
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirm'): void;
}>();
</script>

<template>
  <el-drawer
    :model-value="visible"
    :title="title"
    :size="size"
    :close-on-click-modal="!submitting"
    :close-on-press-escape="!submitting"
    :show-close="!submitting"
    @close="emit('update:visible', false)"
  >
    <div class="drawer-form">
      <div class="drawer-form__body">
        <slot />
      </div>

      <div v-if="showFooter" class="drawer-form__footer">
        <slot name="footer">
          <el-button :disabled="submitting" @click="emit('update:visible', false)">
            {{ cancelText }}
          </el-button>
          <el-button type="primary" :loading="submitting" @click="emit('confirm')">
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-form {
  display: flex;
  min-height: 100%;
  flex-direction: column;
}

.drawer-form__body {
  flex: 1;
}

.drawer-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  margin-top: 24px;
  border-top: 1px solid var(--el-border-color-light);
}
</style>
