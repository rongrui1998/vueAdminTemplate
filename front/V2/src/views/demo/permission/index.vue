<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import PageContainer from '@/components/PageContainer/index.vue';
import { usePermission } from '@/composables/usePermission';
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();
const { hasPermission } = usePermission();

const displayName = computed(() => authStore.userInfo.nickname || authStore.userInfo.username);
const roleText = computed(() => authStore.userInfo.roles.join(' / ') || '未分配角色');

const abilityCards = computed(() => [
  {
    key: 'view',
    title: '页面访问',
    code: 'demo:permission:view',
    description: '决定当前账号能否进入权限示例页。',
    enabled: hasPermission('demo:permission:view'),
  },
  {
    key: 'create',
    title: '新建能力',
    code: 'demo:permission:create',
    description: '决定是否可以发起新建类操作。',
    enabled: hasPermission('demo:permission:create'),
  },
  {
    key: 'export',
    title: '导出能力',
    code: 'demo:permission:export',
    description: '决定是否可以导出报表或清单。',
    enabled: hasPermission('demo:permission:export'),
  },
  {
    key: 'approve',
    title: '审批能力',
    code: 'demo:permission:approve',
    description: '决定是否可以执行审批通过类操作。',
    enabled: hasPermission('demo:permission:approve'),
  },
  {
    key: 'delete',
    title: '删除能力',
    code: 'demo:permission:delete',
    description: '决定是否可以执行高风险删除动作。',
    enabled: hasPermission('demo:permission:delete'),
  },
]);

const permissionRows = computed(() =>
  abilityCards.value.map((item) => ({
    ...item,
    level: item.key === 'delete' || item.key === 'approve' ? '高风险' : '常规',
  })),
);

function handleAction(label: string) {
  ElMessage.success(`${label}：当前账号具备对应权限`);
}
</script>

<template>
  <PageContainer title="权限示例">
    <el-alert
      title="这个页面用于集中演示 Base 版本中的页面权限、按钮权限和组合式权限用法。建议分别使用 admin / editor 账号登录查看差异。"
      type="info"
      :closable="false"
      show-icon
    />

    <el-row :gutter="16">
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="permission-demo__card">
          <template #header>
            <div class="permission-demo__section-header">
              <span>当前账号</span>
              <el-tag type="primary" effect="plain">{{ authStore.userInfo.username }}</el-tag>
            </div>
          </template>

          <div class="permission-demo__profile">
            <div class="permission-demo__profile-name">{{ displayName }}</div>
            <div class="permission-demo__profile-meta">角色：{{ roleText }}</div>
            <div class="permission-demo__profile-meta">
              权限数：{{ authStore.userInfo.permissions.length }}
            </div>
            <div class="permission-demo__profile-tip">
              `admin` 默认拥有完整权限，`editor` 仅保留查看、新建和导出能力。
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="permission-demo__card">
          <template #header>
            <div class="permission-demo__section-header">
              <span>能力总览</span>
              <el-tag type="success" effect="plain"
                >{{ abilityCards.filter((item) => item.enabled).length }} 项可用</el-tag
              >
            </div>
          </template>

          <div class="permission-demo__ability-grid">
            <div
              v-for="item in abilityCards"
              :key="item.key"
              class="permission-demo__ability-item"
              :class="{ 'permission-demo__ability-item--disabled': !item.enabled }"
            >
              <div class="permission-demo__ability-top">
                <div class="permission-demo__ability-title">{{ item.title }}</div>
                <el-tag :type="item.enabled ? 'success' : 'info'" effect="light">
                  {{ item.enabled ? '已开通' : '未开通' }}
                </el-tag>
              </div>
              <div class="permission-demo__ability-code">{{ item.code }}</div>
              <div class="permission-demo__ability-desc">{{ item.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="permission-demo__card">
      <template #header>
        <div class="permission-demo__section-header">
          <span>按钮权限演示</span>
          <el-tag type="warning" effect="plain">显隐由 v-permission 控制</el-tag>
        </div>
      </template>

      <div class="permission-demo__toolbar">
        <el-button
          v-permission="'demo:permission:create'"
          type="primary"
          @click="handleAction('新建申请')"
        >
          新建申请
        </el-button>
        <el-button v-permission="'demo:permission:export'" @click="handleAction('导出报表')"
          >导出报表</el-button
        >
        <el-button
          v-permission="'demo:permission:approve'"
          type="success"
          @click="handleAction('审批通过')"
        >
          审批通过
        </el-button>
        <el-button
          v-permission="'demo:permission:delete'"
          type="danger"
          @click="handleAction('删除记录')"
        >
          删除记录
        </el-button>
      </div>

      <div class="permission-demo__toolbar-note">
        如果某个按钮没有显示，说明当前账号不具备对应权限码，而不是页面渲染异常。
      </div>
    </el-card>

    <el-card shadow="never" class="permission-demo__card">
      <template #header>
        <div class="permission-demo__section-header">
          <span>权限矩阵</span>
          <el-tag type="info" effect="plain">组合式权限读取</el-tag>
        </div>
      </template>

      <div class="permission-demo__matrix">
        <div v-for="row in permissionRows" :key="row.code" class="permission-demo__matrix-row">
          <div>
            <div class="permission-demo__matrix-title">{{ row.title }}</div>
            <div class="permission-demo__matrix-code">{{ row.code }}</div>
          </div>
          <div class="permission-demo__matrix-side">
            <el-tag :type="row.level === '高风险' ? 'danger' : 'primary'" effect="plain">{{
              row.level
            }}</el-tag>
            <el-tag :type="row.enabled ? 'success' : 'info'" effect="light">
              {{ row.enabled ? '当前已拥有' : '当前未拥有' }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.permission-demo__card {
  margin-bottom: 16px;
}

.permission-demo__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}

.permission-demo__profile-name {
  font-size: 24px;
  font-weight: 700;
}

.permission-demo__profile-meta {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
}

.permission-demo__profile-tip {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  line-height: 1.7;
}

.permission-demo__ability-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.permission-demo__ability-item {
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 14px;
  background: var(--el-bg-color-page);
}

.permission-demo__ability-item--disabled {
  opacity: 0.7;
}

.permission-demo__ability-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.permission-demo__ability-title,
.permission-demo__matrix-title {
  font-size: 16px;
  font-weight: 600;
}

.permission-demo__ability-code,
.permission-demo__matrix-code {
  margin-top: 10px;
  color: var(--el-color-primary);
  font-family: Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
}

.permission-demo__ability-desc {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.permission-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.permission-demo__toolbar-note {
  margin-top: 14px;
  color: var(--el-text-color-secondary);
}

.permission-demo__matrix {
  display: flex;
  flex-direction: column;
}

.permission-demo__matrix-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
}

.permission-demo__matrix-row + .permission-demo__matrix-row {
  border-top: 1px solid var(--el-border-color-lighter);
}

.permission-demo__matrix-side {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .permission-demo__ability-grid {
    grid-template-columns: 1fr;
  }

  .permission-demo__matrix-row,
  .permission-demo__section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .permission-demo__matrix-side {
    flex-wrap: wrap;
  }
}
</style>
