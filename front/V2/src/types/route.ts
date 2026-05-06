import type {
  AppLanguage,
  ContentWidthMode,
  LayoutDensity,
  LayoutMode,
  PageTransitionAnimationName,
  ThemeMode,
  ThemePreset,
} from '@/constants/app';

export interface TabViewItem {
  title: string;
  titleEn?: string;
  path: string;
  fullPath: string;
  routeName: string;
  cacheKey?: string;
  affix?: boolean;
}

export interface PersistedTabsState {
  visitedViews: TabViewItem[];
  cachedViews: string[];
  activePath: string;
}

export interface AppSettingsState {
  currentLanguage: AppLanguage;
  sidebarCollapsed: boolean;
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  darkSidebarEnabled: boolean;
  darkHeaderEnabled: boolean;
  grayModeEnabled: boolean;
  colorWeakModeEnabled: boolean;
  pageTransitionProgressEnabled: boolean;
  pageTransitionLoadingEnabled: boolean;
  pageTransitionAnimationEnabled: boolean;
  pageTransitionAnimationName: PageTransitionAnimationName;
  layoutMode: LayoutMode;
  contentWidthMode: ContentWidthMode;
  shortcutHintsEnabled: boolean;
  logoutShortcutEnabled: boolean;
  screenLockShortcutEnabled: boolean;
  screenLockPassword: string;
  screenLocked: boolean;
  layoutDensity: LayoutDensity;
  tagViewsVisible: boolean;
  keepAliveEnabled: boolean;
  settingsDrawerVisible: boolean;
  layoutReady: boolean;
  sidebarAutoCollapsed: boolean;
  pageTransitionLoading: boolean;
  pageTransitionAnimationActive: boolean;
}
