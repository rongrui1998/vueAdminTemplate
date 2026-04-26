<script setup lang="ts">
import { Bell, Check } from '@element-plus/icons-vue';
import type { NotificationViewItem } from '@/types/notification';

defineProps<{
  messages: NotificationViewItem[];
  unreadCount: number;
}>();

const emit = defineEmits<{
  markRead: [id: string];
  clear: [];
  viewAll: [];
}>();
</script>

<template>
  <div class="notification-panel">
    <div class="notification-panel__header">
      <div class="notification-panel__title">
        <span>通知</span>
        <el-tag v-if="unreadCount" size="small" effect="dark">{{ unreadCount }}</el-tag>
      </div>
      <el-icon :size="20"><Bell /></el-icon>
    </div>

    <div v-if="messages.length" class="notification-panel__body">
      <el-scrollbar max-height="420px">
        <button
          v-for="item in messages"
          :key="item.id"
          type="button"
          class="notification-panel__item"
          :class="{ 'notification-panel__item--read': item.read }"
          @click="emit('markRead', item.id)"
        >
          <div class="notification-panel__avatar" :style="{ background: item.avatarGradient }">
            {{ item.avatarText }}
          </div>

          <div class="notification-panel__content">
            <div class="notification-panel__item-head">
              <div class="notification-panel__item-title">{{ item.title }}</div>
              <span v-if="!item.read" class="notification-panel__unread-dot" />
            </div>
            <div class="notification-panel__summary">{{ item.summary }}</div>
            <div class="notification-panel__time">{{ item.timeText }}</div>
          </div>

          <div class="notification-panel__status">
            <el-icon :size="18"><Check /></el-icon>
          </div>
        </button>
      </el-scrollbar>
    </div>

    <div v-else class="notification-panel__empty">
      <el-empty description="暂无消息通知" :image-size="88" />
    </div>

    <div class="notification-panel__footer">
      <el-button size="small" text :disabled="!messages.length" @click="emit('clear')"
        >清空</el-button
      >
      <el-button size="small" type="primary" @click="emit('viewAll')">查看所有消息</el-button>
    </div>
  </div>
</template>

<style scoped>
.notification-panel {
  width: 316px;
  border: 1px solid var(--el-border-color);
  border-radius: 14px;
  background: var(--app-card-bg-color);
  box-shadow: var(--el-box-shadow-light);
  overflow: hidden;
}

.notification-panel__header,
.notification-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.notification-panel__footer {
  border-top: 1px solid var(--el-border-color-light);
  border-bottom: none;
}

.notification-panel__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.notification-panel__body {
  padding: 0;
}

.notification-panel__item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.notification-panel__item:hover {
  background: var(--el-fill-color-light);
}

.notification-panel__item--read {
  opacity: 0.84;
}

.notification-panel__avatar {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.notification-panel__content {
  min-width: 0;
  flex: 1;
}

.notification-panel__item-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-panel__item-title {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}

.notification-panel__unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-color-primary);
  flex-shrink: 0;
}

.notification-panel__summary,
.notification-panel__time {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  font-size: 11px;
}

.notification-panel__summary {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-panel__status {
  margin-top: 2px;
  color: var(--el-color-success);
}

.notification-panel :deep(.el-tag),
.notification-panel :deep(.el-button) {
  font-size: 12px;
}

.notification-panel__empty {
  padding: 20px 0;
}
</style>
