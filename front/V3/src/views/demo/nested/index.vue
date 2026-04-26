<script setup lang="ts">
import PageContainer from '@/components/PageContainer/index.vue';

const overviewCards = [
  {
    title: '本周新增需求',
    value: '24',
    trend: '+12%',
    description: '较上周多 3 条，移动端需求占比提升',
  },
  {
    title: '待审批工单',
    value: '08',
    trend: '-2',
    description: '客服与财务审批请求已进入处理高峰',
  },
  {
    title: '在线项目',
    value: '11',
    trend: '+1',
    description: '包含 4 个重点项目和 2 个灰度发布项目',
  },
  {
    title: '异常预警',
    value: '03',
    trend: '需关注',
    description: '支付回调、库存同步、短信发送三项待排查',
  },
];

const projectProgress = [
  {
    name: '商城首页改版',
    owner: '朱偏右',
    progress: 78,
    status: '进行中',
    statusType: 'primary',
  },
  {
    name: '会员中心重构',
    owner: '曲丽丽',
    progress: 52,
    status: '联调中',
    statusType: 'warning',
  },
  {
    name: '订单履约优化',
    owner: '王雪',
    progress: 91,
    status: '待发布',
    statusType: 'success',
  },
];

const todoList = [
  {
    title: '确认 5 月大促投放预算',
    deadline: '今天 18:00',
    priority: '高',
    priorityType: 'danger',
    status: '待处理',
  },
  {
    title: '同步小程序提审版本说明',
    deadline: '明天 10:30',
    priority: '中',
    priorityType: 'warning',
    status: '处理中',
  },
  {
    title: '跟进售后工单 SLA 异常',
    deadline: '明天 16:00',
    priority: '高',
    priorityType: 'danger',
    status: '待确认',
  },
  {
    title: '整理运营复盘会议纪要',
    deadline: '4 月 30 日',
    priority: '低',
    priorityType: 'info',
    status: '未开始',
  },
];

const activityRecords = [
  {
    time: '2026-04-27 09:20',
    action: '发布商城首页 V3 预览环境',
    operator: '前端研发组',
    result: '已完成',
    resultType: 'success',
  },
  {
    time: '2026-04-27 10:05',
    action: '调整会员权益展示顺序',
    operator: '产品设计组',
    result: '已同步',
    resultType: 'primary',
  },
  {
    time: '2026-04-27 10:40',
    action: '处理支付回调异常告警',
    operator: '后端服务组',
    result: '处理中',
    resultType: 'warning',
  },
  {
    time: '2026-04-27 11:15',
    action: '完成大促物料终版确认',
    operator: '运营增长组',
    result: '已确认',
    resultType: 'success',
  },
];
</script>

<template>
  <PageContainer title="二级菜单示例">
    <el-alert
      title="这个页面用于演示 Base 模板中的多级菜单、面包屑、标签页和动态路由联动效果，同时以业务信息布局模拟真实后台页面。"
      type="info"
      :closable="false"
      show-icon
    />

    <el-row :gutter="16">
      <el-col v-for="card in overviewCards" :key="card.title" :xs="24" :sm="12" :xl="6">
        <el-card shadow="hover" class="nested-demo__overview-card">
          <div class="nested-demo__overview-title">{{ card.title }}</div>
          <div class="nested-demo__overview-value">{{ card.value }}</div>
          <div class="nested-demo__overview-trend">{{ card.trend }}</div>
          <div class="nested-demo__overview-desc">{{ card.description }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="nested-demo__section-card">
          <template #header>
            <div class="nested-demo__section-header">
              <span>项目进度</span>
              <el-tag type="primary" effect="plain">重点项目</el-tag>
            </div>
          </template>

          <div
            v-for="project in projectProgress"
            :key="project.name"
            class="nested-demo__project-item"
          >
            <div class="nested-demo__project-top">
              <div>
                <div class="nested-demo__project-name">{{ project.name }}</div>
                <div class="nested-demo__project-owner">负责人：{{ project.owner }}</div>
              </div>
              <el-tag :type="project.statusType as never" effect="light">{{
                project.status
              }}</el-tag>
            </div>
            <el-progress :percentage="project.progress" :stroke-width="10" />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="nested-demo__section-card">
          <template #header>
            <div class="nested-demo__section-header">
              <span>待处理事项</span>
              <el-tag type="warning" effect="plain">{{ todoList.length }} 项</el-tag>
            </div>
          </template>

          <div v-for="todo in todoList" :key="todo.title" class="nested-demo__todo-item">
            <div class="nested-demo__todo-main">
              <div class="nested-demo__todo-title">{{ todo.title }}</div>
              <div class="nested-demo__todo-deadline">截止时间：{{ todo.deadline }}</div>
            </div>
            <div class="nested-demo__todo-side">
              <el-tag :type="todo.priorityType as never" effect="light">{{ todo.priority }}</el-tag>
              <span class="nested-demo__todo-status">{{ todo.status }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="nested-demo__section-card">
      <template #header>
        <div class="nested-demo__section-header">
          <span>最近操作记录</span>
          <el-tag type="info" effect="plain">用于补充真实业务内容密度</el-tag>
        </div>
      </template>

      <el-table :data="activityRecords">
        <el-table-column prop="time" label="时间" min-width="160" />
        <el-table-column prop="action" label="操作内容" min-width="260" />
        <el-table-column prop="operator" label="执行人 / 小组" min-width="180" />
        <el-table-column label="结果" width="120">
          <template #default="{ row }">
            <el-tag :type="row.resultType" effect="light">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.nested-demo__overview-card,
.nested-demo__section-card {
  margin-bottom: 16px;
}

.nested-demo__overview-title {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.nested-demo__overview-value {
  margin-top: 12px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.nested-demo__overview-trend {
  margin-top: 10px;
  color: var(--el-color-primary);
  font-weight: 600;
}

.nested-demo__overview-desc {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.nested-demo__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}

.nested-demo__project-item + .nested-demo__project-item,
.nested-demo__todo-item + .nested-demo__todo-item {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.nested-demo__project-top,
.nested-demo__todo-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.nested-demo__project-name,
.nested-demo__todo-title {
  font-size: 16px;
  font-weight: 600;
}

.nested-demo__project-owner,
.nested-demo__todo-deadline,
.nested-demo__todo-status {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}

.nested-demo__todo-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .nested-demo__project-top,
  .nested-demo__todo-item,
  .nested-demo__section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nested-demo__todo-side {
    align-items: flex-start;
  }
}
</style>
