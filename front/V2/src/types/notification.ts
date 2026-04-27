export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  timeText: string;
  avatarText: string;
  avatarGradient: string;
}

export interface NotificationViewItem extends NotificationItem {
  read: boolean;
}

export interface NotificationStorageState {
  readIds: string[];
  cleared: boolean;
}
