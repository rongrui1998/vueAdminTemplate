export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Vue Admin Template';

export const STORAGE_KEYS = {
  token: 'admin-template-token',
  userInfo: 'admin-template-user-info',
  currentLanguage: 'admin-template-current-language',
  themeMode: 'admin-template-theme-mode',
  themePreset: 'admin-template-theme-preset',
  sidebarCollapsed: 'admin-template-sidebar-collapsed',
  darkSidebarEnabled: 'admin-template-dark-sidebar-enabled',
  darkHeaderEnabled: 'admin-template-dark-header-enabled',
  grayModeEnabled: 'admin-template-gray-mode-enabled',
  colorWeakModeEnabled: 'admin-template-color-weak-mode-enabled',
  pageTransitionProgressEnabled: 'admin-template-page-transition-progress-enabled',
  pageTransitionLoadingEnabled: 'admin-template-page-transition-loading-enabled',
  pageTransitionAnimationEnabled: 'admin-template-page-transition-animation-enabled',
  pageTransitionAnimationName: 'admin-template-page-transition-animation-name',
  layoutMode: 'admin-template-layout-mode',
  contentWidthMode: 'admin-template-content-width-mode',
  shortcutHintsEnabled: 'admin-template-shortcut-hints-enabled',
  logoutShortcutEnabled: 'admin-template-logout-shortcut-enabled',
  screenLockShortcutEnabled: 'admin-template-screen-lock-shortcut-enabled',
  screenLockPassword: 'admin-template-screen-lock-password',
  screenLockActive: 'admin-template-screen-lock-active',
  layoutDensity: 'admin-template-layout-density',
  tagViewsVisible: 'admin-template-tag-views-visible',
  keepAliveEnabled: 'admin-template-keep-alive-enabled',
  tabs: 'admin-template-tabs',
  notifications: 'admin-template-notifications',
} as const;

export const THEME_MODE = {
  light: 'light',
  dark: 'dark',
} as const;

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

export const APP_LANGUAGE = {
  zhCN: 'zh-CN',
  enUS: 'en-US',
} as const;

export type AppLanguage = (typeof APP_LANGUAGE)[keyof typeof APP_LANGUAGE];

export const THEME_PRESETS = {
  default: {
    label: '默认',
    color: '#1677ff',
    dark2: '#0d5bd7',
    light3: '#5ca3ff',
    light5: '#8bc0ff',
    light7: '#badcff',
    light8: '#d1e8ff',
    light9: '#e8f4ff',
  },
  violet: {
    label: '紫罗兰',
    color: '#7161ef',
    dark2: '#5646d6',
    light3: '#9c91f4',
    light5: '#b8b0f7',
    light7: '#d4d0fb',
    light8: '#e3e0fc',
    light9: '#f1effe',
  },
  rose: {
    label: '樱花粉',
    color: '#ec407a',
    dark2: '#c72c61',
    light3: '#f27aa3',
    light5: '#f6a0bd',
    light7: '#fac6d7',
    light8: '#fbd9e5',
    light9: '#fdebf2',
  },
  amber: {
    label: '柠檬黄',
    color: '#f6c343',
    dark2: '#d49e12',
    light3: '#f9d77b',
    light5: '#fbe1a1',
    light7: '#fcedc7',
    light8: '#fdf3d9',
    light9: '#fef9ec',
  },
  geekblue: {
    label: '天蓝色',
    color: '#536dfe',
    dark2: '#344ce2',
    light3: '#8798fe',
    light5: '#a9b5ff',
    light7: '#cbd2ff',
    light8: '#dde2ff',
    light9: '#eef0ff',
  },
  mint: {
    label: '浅绿色',
    color: '#20c997',
    dark2: '#139c72',
    light3: '#63d9b7',
    light5: '#90e4cb',
    light7: '#bcefe0',
    light8: '#d2f4ea',
    light9: '#e9faf5',
  },
  zinc: {
    label: '锌色灰',
    color: '#52525b',
    dark2: '#3f3f46',
    light3: '#85858c',
    light5: '#a8a8ad',
    light7: '#cbcbd0',
    light8: '#dddde0',
    light9: '#eeeef0',
  },
  teal: {
    label: '深绿色',
    color: '#159a9c',
    dark2: '#0e7779',
    light3: '#5bb8ba',
    light5: '#8acccd',
    light7: '#b9e1e1',
    light8: '#d0ebeb',
    light9: '#e8f5f5',
  },
  blue: {
    label: '深蓝色',
    color: '#0f7ad3',
    dark2: '#095fa8',
    light3: '#57a2e0',
    light5: '#87bde9',
    light7: '#b7d7f2',
    light8: '#cfe4f6',
    light9: '#e7f2fb',
  },
  orange: {
    label: '橙黄色',
    color: '#d9480f',
    dark2: '#a93409',
    light3: '#e77f57',
    light5: '#eca487',
    light7: '#f4c8b7',
    light8: '#f7dacc',
    light9: '#fbede7',
  },
  red: {
    label: '玫瑰红',
    color: '#d21f2b',
    dark2: '#a9151f',
    light3: '#e2636b',
    light5: '#e98f95',
    light7: '#f1bcbe',
    light8: '#f6d2d5',
    light9: '#fae8ea',
  },
  neutral: {
    label: '中性色',
    color: '#4b4b4b',
    dark2: '#333333',
    light3: '#7f7f7f',
    light5: '#a5a5a5',
    light7: '#cacaca',
    light8: '#dbdbdb',
    light9: '#ededed',
  },
} as const;

export type ThemePreset = keyof typeof THEME_PRESETS;

export const LAYOUT_MODE = {
  vertical: 'vertical',
  sidebar: 'sidebar',
  fullContent: 'full-content',
  dual: 'dual',
  horizontal: 'horizontal',
  mixedVertical: 'mixed-vertical',
  mixedDual: 'mixed-dual',
} as const;

export type LayoutMode = (typeof LAYOUT_MODE)[keyof typeof LAYOUT_MODE];

export const CONTENT_WIDTH_MODE = {
  fluid: 'fluid',
  fixed: 'fixed',
} as const;

export type ContentWidthMode = (typeof CONTENT_WIDTH_MODE)[keyof typeof CONTENT_WIDTH_MODE];

export const LAYOUT_DENSITY = {
  comfortable: 'comfortable',
  compact: 'compact',
} as const;

export type LayoutDensity = (typeof LAYOUT_DENSITY)[keyof typeof LAYOUT_DENSITY];

export const PAGE_TRANSITION_ANIMATION = {
  fade: 'fade',
  fadeSlideUp: 'fade-slide-up',
  fadeSlideRight: 'fade-slide-right',
  zoomFade: 'zoom-fade',
} as const;

export type PageTransitionAnimationName =
  (typeof PAGE_TRANSITION_ANIMATION)[keyof typeof PAGE_TRANSITION_ANIMATION];
