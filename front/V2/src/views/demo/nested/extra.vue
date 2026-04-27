<script setup lang="ts">
import PageContainer from '@/components/PageContainer/index.vue';

const configRows = [
  { label: '菜单层级', value: '二级目录下的同级页面' },
  { label: '典型用途', value: '系统设置、基础配置、业务参数' },
  { label: '模板验证点', value: '多级菜单展开、面包屑路径、标签切换' },
];
</script>

<template>
  <PageContainer title="二级菜单扩展示例">
    <el-alert
      title="这个页面用于补充多级菜单下的第二个同级页面，方便完整演示目录展开效果。"
      type="success"
      :closable="false"
      show-icon
    />

    <el-card shadow="never">
      <template #header>
        <div class="nested-extra__header">同级页面示例</div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item v-for="row in configRows" :key="row.label" :label="row.label">
          {{ row.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.nested-extra__header {
  font-size: 16px;
  font-weight: 600;
}
</style>
