<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import DrawerForm from '@/components/DrawerForm/index.vue';

const visible = ref(false);
const submitting = ref(false);

function handleConfirm() {
  submitting.value = true;
  window.setTimeout(() => {
    submitting.value = false;
    visible.value = false;
  }, 500);
}
</script>

<template>
  <PageContainer title="DrawerForm 示例">
    <div class="component-demo">
      <section class="component-demo__hero">
        <p class="component-demo__eyebrow">抽屉表单 / 详情</p>
        <h2>DrawerForm 适合详情、预览和复杂编辑</h2>
        <p>
          比起弹窗，抽屉更适合承载较长内容，比如账号详情、导入预览、审核信息、操作历史。
          它同样保留默认底部操作区，也允许业务通过 footer 插槽完全自定义。
        </p>
      </section>

      <el-card shadow="never">
        <template #header>交互示例</template>
        <el-button type="primary" @click="visible = true">打开 DrawerForm</el-button>
      </el-card>

      <el-card shadow="never">
        <template #header>适合承载的内容</template>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-alert type="success" :closable="false" title="详情查看：账号资料、订单信息" />
          </el-col>
          <el-col :span="8">
            <el-alert type="warning" :closable="false" title="导入预览：错误行、确认提交" />
          </el-col>
          <el-col :span="8">
            <el-alert type="info" :closable="false" title="复杂编辑：字段较多的编辑表单" />
          </el-col>
        </el-row>
      </el-card>

      <DrawerForm
        :visible="visible"
        title="账号详情"
        size="520px"
        :submitting="submitting"
        confirm-text="确认读取"
        @confirm="handleConfirm"
        @update:visible="visible = $event"
      >
        <el-descriptions :column="1" border>
          <el-descriptions-item label="姓名">系统管理员</el-descriptions-item>
          <el-descriptions-item label="邮箱">admin@example.com</el-descriptions-item>
          <el-descriptions-item label="角色">admin</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">启用</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="说明">
            DrawerForm 保留了 Element Plus Drawer 的空间感，但统一了底部按钮和 loading 状态。
          </el-descriptions-item>
        </el-descriptions>
      </DrawerForm>
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
  background: linear-gradient(135deg, rgb(64 158 255 / 14%), rgb(103 194 58 / 10%));
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
}

.component-demo__hero h2 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.component-demo__hero p {
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
