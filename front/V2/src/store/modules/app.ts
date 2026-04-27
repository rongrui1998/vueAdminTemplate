import { defineStore } from 'pinia';
import { STORAGE_KEYS, THEME_MODE, type ThemeMode } from '@/constants/app';
import type { AppSettingsState } from '@/types/route';
import { applyThemeMode } from '@/hooks/useTheme';
import { getStorage, setStorage } from '@/utils/storage';

const SIDEBAR_COLLAPSE_BREAKPOINT = 1200;

export const useAppStore = defineStore('app', {
  state: (): AppSettingsState => ({
    sidebarCollapsed: getStorage(STORAGE_KEYS.sidebarCollapsed, false),
    themeMode: getStorage<ThemeMode>(STORAGE_KEYS.themeMode, THEME_MODE.light),
    layoutReady: false,
    sidebarAutoCollapsed: false,
  }),
  actions: {
    initializeSettings() {
      applyThemeMode(this.themeMode);
      this.syncSidebarWithViewport(window.innerWidth);
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.sidebarAutoCollapsed = false;
      setStorage(STORAGE_KEYS.sidebarCollapsed, this.sidebarCollapsed);
    },
    syncSidebarWithViewport(width: number) {
      const shouldCollapse = width < SIDEBAR_COLLAPSE_BREAKPOINT;

      if (shouldCollapse) {
        this.sidebarCollapsed = true;
        this.sidebarAutoCollapsed = true;
        return;
      }

      if (this.sidebarAutoCollapsed) {
        this.sidebarCollapsed = getStorage(STORAGE_KEYS.sidebarCollapsed, false);
      }

      this.sidebarAutoCollapsed = false;
    },
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode;
      setStorage(STORAGE_KEYS.themeMode, mode);
      applyThemeMode(mode);
    },
    toggleThemeMode() {
      this.setThemeMode(this.themeMode === THEME_MODE.dark ? THEME_MODE.light : THEME_MODE.dark);
    },
    setLayoutReady(ready: boolean) {
      this.layoutReady = ready;
    },
  },
});
