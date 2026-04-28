<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/components/PageContainer/index.vue';
import ProTable from '@/components/ProTable/index.vue';

const loading = ref(false);
const error = ref(false);
const tableData = ref([
  { id: '1', name: '系统管理员', role: 'admin', status: '启用', createdAt: '2026-04-28' },
  { id: '2', name: '运营编辑', role: 'editor', status: '启用', createdAt: '2026-04-28' },
  { id: '3', name: '访客账号', role: 'guest', status: '停用', createdAt: '2026-04-28' },
]);

function simulateLoading() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 600);
}
</script>

<template>
  <PageContainer title="ProTable 示例">
    <div class="component-demo">
      <section class="component-demo__hero">
        <p class="component-demo__eyebrow">表格外壳</p>
        <h2>ProTable 只管通用状态，列仍然由业务自己定义</h2>
        <p>
          它统一处理卡片容器、loading、错误重试和空状态。真正的列、插槽、操作按钮仍使用 Element Plus
          的 `el-table-column`，不会把业务写法锁死。
        </p>
      </section>

      <ProTable
        :data="tableData"
        :loading="loading"
        :error="error"
        error-title="账号加载失败"
        error-text="这里模拟接口异常，可以点击重新加载恢复"
        @retry="error = false"
      >
        <template #header>
          <strong>封装表格示例</strong>
        </template>
        <template #extra>
          <el-button @click="simulateLoading">模拟加载</el-button>
          <el-button :type="error ? 'primary' : 'danger'" @click="error = !error">
            {{ error ? '恢复表格' : '模拟错误' }}
          </el-button>
        </template>

        <el-table-column prop="name" label="姓名" min-width="140" />
        <el-table-column prop="role" label="角色" min-width="120" />
        <el-table-column label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-button text type="primary">查看</el-button>
            <el-button text type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </ProTable>

      <el-card shadow="never">
        <template #header>和原生表格的关系</template>
        <el-alert
          type="info"
          :closable="false"
          title="ProTable 不封装列配置 DSL，避免把简单表格变成另一套学习成本。"
        />
      </el-card>
    </div>
  </PageContainer>
</template>

<style scoped>
.component-demo {
  display: grid;
  gap: 16px;
}

.component-demo__hero {
  padding: 22px 24px;
  background: linear-gradient(135deg, rgb(64 158 255 / 14%), rgb(230 162 60 / 10%));
  border: 1px solid var(--el-border-color-light);
  border-radius: 14px;
}

.component-demo__hero h2 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.component-demo__hero p {
  max-width: 820px;
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.component-demo__eyebrow {
  color: var(--el-color-primary) !important;
  font-weight: 700;
}
</style>
