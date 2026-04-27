<script setup lang="ts">
import { computed } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import { getStandardDataSourceLabel, isStandardApiMode } from '@/constants/standard';

const dataSourceLabel = computed(() => getStandardDataSourceLabel());
const isApiMode = computed(() => isStandardApiMode());

const nextSteps = [
  '补齐用户列表、筛选区和状态切换',
  '接入角色绑定、重置密码、启停用操作',
  '支持 mock / api 双模式读取同一套页面',
];
</script>

<template>
  <PageContainer title="用户管理">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="15">
        <el-card shadow="never">
          <template #header>
            <div class="system-page__header">
              <span>模块状态</span>
              <el-tag :type="isApiMode ? 'success' : 'primary'" effect="light">
                当前数据源：{{ dataSourceLabel }}
              </el-tag>
            </div>
          </template>

          <div class="system-page__hero">
            <div>
              <div class="system-page__eyebrow">Standard Phase 1</div>
              <div class="system-page__headline">用户管理已进入 Standard 骨架阶段</div>
              <div class="system-page__desc">
                当前页面已经作为系统管理正式模块接入菜单、面包屑与标签页。下一步会在这里补齐列表、角色绑定、启停用和重置密码等真实管理能力。
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="9">
        <el-card shadow="never">
          <template #header>
            <div class="system-page__header">
              <span>本阶段目标</span>
              <el-tag type="warning" effect="plain">进行中</el-tag>
            </div>
          </template>

          <div class="system-page__steps">
            <div v-for="item in nextSteps" :key="item" class="system-page__step">
              <span class="system-page__step-dot" />
              <span>{{ item }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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

.system-page__hero {
  min-height: 240px;
  padding: 28px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgb(64 158 255 / 0.12), transparent 24%),
    linear-gradient(145deg, var(--el-fill-color-blank), rgb(64 158 255 / 0.03));
}

.system-page__eyebrow {
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.system-page__headline {
  margin-top: 14px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.35;
}

.system-page__desc {
  max-width: 620px;
  margin-top: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.system-page__steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.system-page__step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--el-text-color-regular);
  line-height: 1.7;
}

.system-page__step-dot {
  width: 8px;
  height: 8px;
  margin-top: 9px;
  border-radius: 50%;
  background: var(--el-color-primary);
  flex-shrink: 0;
}
</style>
