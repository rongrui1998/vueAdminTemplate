<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { DASHBOARD_PATH } from '@/constants/route';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="route-missing-page">
    <section class="route-missing-page__card">
      <div class="route-missing-page__badge">Dynamic Route Guard</div>
      <h1>页面配置异常</h1>
      <p>当前菜单绑定的页面组件不存在，请检查菜单 `component` 字段是否对应真实视图文件。</p>
      <div class="route-missing-page__path">
        {{ route.meta.component || '未提供组件路径' }}
      </div>
      <el-button type="primary" size="large" @click="router.push(DASHBOARD_PATH)"
        >返回首页</el-button
      >
    </section>
  </div>
</template>

<style scoped>
.route-missing-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--app-bg-color);
}

.route-missing-page__card {
  width: min(720px, 100%);
  padding: 34px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgb(245 108 108 / 0.14), transparent 34%),
    var(--app-card-bg-color);
  box-shadow: 0 24px 70px rgb(15 23 42 / 0.1);
}

.route-missing-page__badge {
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgb(245 108 108 / 0.1);
  color: var(--el-color-danger);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.route-missing-page h1 {
  margin: 18px 0 0;
  font-size: clamp(30px, 4vw, 46px);
}

.route-missing-page p {
  margin: 16px 0 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.route-missing-page__path {
  margin: 22px 0;
  padding: 14px 16px;
  border: 1px dashed var(--el-border-color);
  border-radius: 12px;
  background: var(--el-fill-color-lighter);
  color: var(--el-color-danger);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  word-break: break-all;
}
</style>
