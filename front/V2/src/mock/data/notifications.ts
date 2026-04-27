import type { NotificationItem } from '@/types/notification';

export const notificationList: NotificationItem[] = [
  {
    id: 'weekly-report',
    title: '收到了 14 份新周报',
    summary: '市场、运营和研发团队都提交了本周总结，建议优先查看重点异常项。',
    timeText: '3 小时前',
    avatarText: 'VB',
    avatarGradient: 'linear-gradient(135deg, #d9ff3f 0%, #3cecb5 100%)',
  },
  {
    id: 'reply-message',
    title: '朱偏右 回复了你',
    summary: '关于首页改版的交互建议已经补充在评论区，可以直接继续跟进。',
    timeText: '刚刚',
    avatarText: '朱',
    avatarGradient: 'linear-gradient(135deg, #6ea8ff 0%, #9b7bff 100%)',
  },
  {
    id: 'comment-mention',
    title: '曲丽丽 评论了你',
    summary: '数据看板筛选项已经确认，建议同步把移动端布局一起评审。',
    timeText: '2024-01-01',
    avatarText: '曲',
    avatarGradient: 'linear-gradient(135deg, #ff9f6e 0%, #ff5d8f 100%)',
  },
  {
    id: 'todo-reminder',
    title: '待办提醒',
    summary: '你有 3 条待处理事项即将到期，请尽快安排处理。',
    timeText: '1 天前',
    avatarText: '办',
    avatarGradient: 'linear-gradient(135deg, #4fd1ff 0%, #1f7aff 100%)',
  },
];
