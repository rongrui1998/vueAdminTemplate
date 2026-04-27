<script setup lang="ts">
import { computed } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import { getStandardDataSourceLabel } from '@/constants/standard';

const dataSourceLabel = computed(() => getStandardDataSourceLabel());

const rolePoints = [
  '角色将作为菜单权限、按钮权限和页面访问控制的核心配置入口',
  '后续页面会支持角色启停、权限树配置和账号绑定数量展示',
  '切到真实接口后，这里会直接影响前端的菜单可见性和 403 判定',
];
</script>

<template>
  <PageContainer title="角色管理">
    <el-card shadow="never">
      <template #header>
        <div class="system-page__header">
          <span>角色与权限闭环</span>
          <el-tag effect="light">当前数据源：{{ dataSourceLabel }}</el-tag>
        </div>
      </template>

      <div class="role-page">
        <div class="role-page__summary">
          <div class="role-page__number">03</div>
          <div>
            <div class="role-page__title">角色管理是 V2 Standard 的权限中枢</div>
            <div class="role-page__desc">
              这块会承接菜单管理和用户管理之间的关系，把“账号看到什么、能操作什么”从演示页能力升级成真实管理能力。
            </div>
          </div>
        </div>

        <div class="role-page__grid">
          <div v-for="item in rolePoints" :key="item" class="role-page__point">
            {{ item }}
          </div>
        </div>
      </div>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.system-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}

.role-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.role-page__summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 18px;
  background:
    radial-gradient(circle at left top, rgb(80 190 140 / 0.1), transparent 20%),
    var(--el-fill-color-blank);
}

.role-page__number {
  font-size: 42px;
  font-weight: 800;
  color: var(--el-color-success);
  line-height: 1;
}

.role-page__title {
  font-size: 22px;
  font-weight: 700;
}

.role-page__desc {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.role-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.role-page__point {
  min-height: 126px;
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 16px;
  background: var(--el-fill-color-blank);
  color: var(--el-text-color-regular);
  line-height: 1.75;
}

@media (max-width: 960px) {
  .role-page__summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .role-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
