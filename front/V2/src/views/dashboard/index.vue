<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import { getDashboardStatisticsApi } from '@/api/dashboard';
import type { DashboardStatistics } from '@/types/dashboard';
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const statistics = ref<DashboardStatistics>({ cards: [] });

async function loadStatistics() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    statistics.value = await getDashboardStatisticsApi();
    pageStatus.value = 'success';
  } catch (error) {
    statistics.value = { cards: [] };
    pageStatus.value = 'error';
    errorText.value = error instanceof Error ? error.message : '获取统计数据失败，请稍后重试';
  }
}

onMounted(() => {
  loadStatistics();
});
</script>

<template>
  <PageContainer title="首页">
    <el-card shadow="never">
      <template #header>
        <div class="dashboard-welcome">
          <div>
            <div class="dashboard-welcome__title">
              欢迎回来，{{ authStore.userInfo.nickname || authStore.userInfo.username }}
            </div>
            <div class="dashboard-welcome__desc">
              这是一个可复用的后台模板基础版，适合快速起业务页面。
            </div>
          </div>
        </div>
      </template>

      <div v-if="pageStatus === 'error'" class="dashboard-state">
        <el-result icon="error" title="加载失败" :sub-title="errorText || '请稍后重试'">
          <template #extra>
            <el-button type="primary" @click="loadStatistics">重新加载</el-button>
          </template>
        </el-result>
      </div>

      <div v-else-if="pageStatus === 'success' && !statistics.cards.length" class="dashboard-state">
        <el-empty description="暂无统计数据" />
      </div>

      <el-skeleton v-else :loading="pageStatus === 'loading'" animated :rows="4">
        <el-row :gutter="16">
          <el-col v-for="card in statistics.cards" :key="card.key" :xs="24" :sm="12" :lg="6">
            <el-card class="stat-card" shadow="never">
              <div class="stat-card__title">{{ card.title }}</div>
              <div class="stat-card__value">
                {{ card.value }}<span v-if="card.unit">{{ card.unit }}</span>
              </div>
              <div class="stat-card__desc">{{ card.description }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.dashboard-state {
  padding: 24px 0;
}

.dashboard-welcome__title {
  font-size: 20px;
  font-weight: 600;
}

.dashboard-welcome__desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}

.stat-card {
  margin-bottom: 16px;
}

.stat-card__title {
  color: var(--el-text-color-secondary);
}

.stat-card__value {
  margin-top: 12px;
  font-size: 28px;
  font-weight: 700;
}

.stat-card__value span {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
}

.stat-card__desc {
  margin-top: 12px;
  color: var(--el-text-color-secondary);
}
</style>
