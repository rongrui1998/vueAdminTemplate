<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { DASHBOARD_PATH } from '@/constants/route';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="route-missing-page">
    <el-result
      icon="error"
      title="页面配置异常"
      :sub-title="`当前菜单绑定的页面组件不存在：${route.meta.component || '未提供组件路径'}`"
    >
      <template #extra>
        <el-button type="primary" @click="router.push(DASHBOARD_PATH)">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.route-missing-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-bg-color);
}
</style>
