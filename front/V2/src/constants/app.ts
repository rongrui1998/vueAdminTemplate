export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Vue Admin Template';

export const STORAGE_KEYS = {
  token: 'admin-template-token',
  userInfo: 'admin-template-user-info',
  themeMode: 'admin-template-theme-mode',
  sidebarCollapsed: 'admin-template-sidebar-collapsed',
  tabs: 'admin-template-tabs',
  notifications: 'admin-template-notifications',
} as const;

export const THEME_MODE = {
  light: 'light',
  dark: 'dark',
} as const;

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];
