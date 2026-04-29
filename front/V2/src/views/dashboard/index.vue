<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PageContainer from '@/components/PageContainer/index.vue';
import { getDashboardStatisticsApi } from '@/api/dashboard';
import type { DashboardStatistics } from '@/types/dashboard';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';

const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const errorText = ref('');
const statistics = ref<DashboardStatistics>({ cards: [] });
const fallbackStatistics: DashboardStatistics = {
  cards: [
    {
      key: 'sales',
      title: '今日销售额',
      value: 28640,
      unit: '元',
      description: '较昨日增长 12.6%',
    },
    {
      key: 'orders',
      title: '今日订单数',
      value: 138,
      unit: '单',
      description: '待处理订单 16 单',
    },
    {
      key: 'users',
      title: '新增用户',
      value: 52,
      unit: '人',
      description: '核心渠道转化率 18%',
    },
    {
      key: 'conversion',
      title: '支付转化率',
      value: 68,
      unit: '%',
      description: '支付链路稳定运行',
    },
  ],
};
const quickEntries = [
  { title: '用户管理', desc: '账号、角色绑定与状态维护', path: '/system/user' },
  { title: '角色授权', desc: '菜单和按钮权限配置', path: '/system/role' },
  { title: '标准业务模板', desc: '复制列表页开发骨架', path: '/demo/business-template' },
  { title: '全局设置', desc: '主题、密度和缓存偏好', action: 'settings' },
];
const systemStatus = [
  { label: '版本定位', value: 'V2 Standard' },
  { label: '数据模式', value: import.meta.env.VITE_STANDARD_DATA_SOURCE || 'mock' },
  { label: '菜单来源', value: import.meta.env.VITE_MENU_SOURCE || 'mock' },
  { label: '主题模式', value: appStore.themeMode },
];

async function loadStatistics() {
  pageStatus.value = 'loading';
  errorText.value = '';

  try {
    statistics.value = await getDashboardStatisticsApi();
    pageStatus.value = 'success';
  } catch {
    statistics.value = fallbackStatistics;
    pageStatus.value = 'success';
  }
}

onMounted(() => {
  loadStatistics();
});

function openQuickEntry(entry: (typeof quickEntries)[number]) {
  if ('action' in entry && entry.action === 'settings') {
    appStore.openSettingsDrawer();
    return;
  }

  if ('path' in entry && entry.path) {
    router.push(entry.path);
  }
}
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

    <el-row :gutter="16" class="dashboard-section">
      <el-col :xs="24" :lg="15">
        <el-card shadow="never" class="dashboard-panel">
          <template #header>
            <strong>快捷入口</strong>
          </template>
          <div class="quick-entry-grid">
            <button
              v-for="entry in quickEntries"
              :key="entry.title"
              type="button"
              class="quick-entry-card"
              @click="openQuickEntry(entry)"
            >
              <span>{{ entry.title }}</span>
              <small>{{ entry.desc }}</small>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="9">
        <el-card shadow="never" class="dashboard-panel">
          <template #header>
            <strong>系统状态</strong>
          </template>
          <div class="status-list">
            <div v-for="item in systemStatus" :key="item.label" class="status-list__item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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

.dashboard-section {
  margin-top: 16px;
}

.dashboard-panel {
  height: 100%;
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quick-entry-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 92px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
  background:
    radial-gradient(circle at top right, rgb(64 158 255 / 0.14), transparent 36%),
    var(--app-card-bg-color);
  color: var(--el-text-color-primary);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.quick-entry-card:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.08);
}

.quick-entry-card span {
  font-weight: 700;
}

.quick-entry-card small {
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.status-list {
  display: grid;
  gap: 4px;
}

.status-list__item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.status-list__item:last-child {
  border-bottom: 0;
}

.status-list__item span {
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .quick-entry-grid {
    grid-template-columns: 1fr;
  }
}
</style>
