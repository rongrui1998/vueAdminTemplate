import type { ThemeMode } from '@/constants/app';

export interface TabViewItem {
  title: string;
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
  sidebarCollapsed: boolean;
  themeMode: ThemeMode;
  layoutReady: boolean;
  sidebarAutoCollapsed: boolean;
}
