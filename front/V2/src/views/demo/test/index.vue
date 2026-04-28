<script setup lang="ts">
import PageContainer from '@/components/PageContainer/index.vue';

const featureCards = [
  {
    title: '动态菜单验证',
    description: '用于验证菜单管理中新建页面后，动态路由能否正确加载代码中的页面组件。',
  },
  {
    title: '角色权限验证',
    description: '给角色分配测试页面权限后，重新登录即可检查左侧菜单和页面访问是否生效。',
  },
  {
    title: '标签页验证',
    description: '进入页面后会自动加入标签栏，方便验证标签切换和关闭行为。',
  },
];
</script>

<template>
  <PageContainer title="测试页面">
    <el-alert
      title="这是业务示例目录下的测试页面，页面组件路径为 demo/test/index。"
      type="success"
      :closable="false"
      show-icon
    />

    <el-row :gutter="16" class="test-page__cards">
      <el-col v-for="item in featureCards" :key="item.title" :xs="24" :md="8">
        <el-card shadow="never" class="test-page__card">
          <div class="test-page__card-title">{{ item.title }}</div>
          <div class="test-page__card-desc">{{ item.description }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="test-page__header">菜单管理填写参考</div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="菜单名称">测试页面</el-descriptions-item>
        <el-descriptions-item label="菜单类型">菜单</el-descriptions-item>
        <el-descriptions-item label="上级菜单">业务示例</el-descriptions-item>
        <el-descriptions-item label="路由地址">/demo/test</el-descriptions-item>
        <el-descriptions-item label="页面组件">demo/test/index</el-descriptions-item>
        <el-descriptions-item label="权限标识">demo:test:view</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.test-page__cards {
  margin-top: 16px;
  margin-bottom: 16px;
}

.test-page__card {
  height: 100%;
}

.test-page__card-title,
.test-page__header {
  font-size: 16px;
  font-weight: 600;
}

.test-page__card-desc {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
}
</style>
