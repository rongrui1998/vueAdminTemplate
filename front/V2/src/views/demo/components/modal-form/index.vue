<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import PageContainer from '@/components/PageContainer/index.vue';
import ModalForm from '@/components/ModalForm/index.vue';

interface AccountForm {
  name: string;
  email: string;
  status: number;
}

const visible = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();
const formModel = reactive<AccountForm>({
  name: '系统管理员',
  email: 'admin@example.com',
  status: 1,
});
const rules: FormRules<AccountForm> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
};

async function handleConfirm() {
  const valid = await formRef.value?.validate().catch(() => false);

  if (!valid) {
    return;
  }

  submitting.value = true;
  window.setTimeout(() => {
    submitting.value = false;
    visible.value = false;
  }, 500);
}
</script>

<template>
  <PageContainer title="ModalForm 示例">
    <div class="component-demo">
      <section class="component-demo__hero">
        <p class="component-demo__eyebrow">弹窗表单</p>
        <h2>ModalForm 统一新增、编辑弹窗的外壳和操作区</h2>
        <p>
          业务侧只放自己的 `el-form` 内容，把标题、宽度、保存按钮 loading、取消关闭这些重复工作交给
          `ModalForm`。
        </p>
      </section>

      <el-card shadow="never">
        <template #header>交互示例</template>
        <el-button type="primary" @click="visible = true">打开 ModalForm</el-button>
      </el-card>

      <el-card shadow="never">
        <template #header>什么时候不用它</template>
        <p class="component-demo__text">
          如果弹窗有非常特殊的页脚、分步流程、全屏编辑器，可以直接使用原生 `el-dialog`。
          模板封装只负责覆盖最常见的后台表单弹窗。
        </p>
      </el-card>

      <ModalForm
        :visible="visible"
        title="编辑账号"
        width="560px"
        :submitting="submitting"
        confirm-text="保存账号"
        @confirm="handleConfirm"
        @update:visible="visible = $event"
      >
        <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formModel.name" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formModel.email" />
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="formModel.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
      </ModalForm>
    </div>
  </PageContainer>
</template>

<style scoped>
.component-demo {
  display: grid;
  gap: 16px;
}

.component-demo__hero {
  padding: 22px 24px;
  background: linear-gradient(135deg, rgb(64 158 255 / 14%), rgb(144 147 153 / 10%));
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
}

.component-demo__hero h2 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.component-demo__hero p,
.component-demo__text {
  max-width: 820px;
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.component-demo__eyebrow {
  color: var(--el-color-primary) !important;
  font-weight: 700;
}
</style>
