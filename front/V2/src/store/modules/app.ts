import { defineStore } from 'pinia';
import {
  LAYOUT_DENSITY,
  STORAGE_KEYS,
  THEME_MODE,
  type LayoutDensity,
  type ThemeMode,
} from '@/constants/app';
import type { AppSettingsState } from '@/types/route';
import { applyThemeMode } from '@/hooks/useTheme';
import { getStorage, setStorage } from '@/utils/storage';

const SIDEBAR_COLLAPSE_BREAKPOINT = 1200;

export const useAppStore = defineStore('app', {
  state: (): AppSettingsState => ({
    sidebarCollapsed: getStorage(STORAGE_KEYS.sidebarCollapsed, false),
    themeMode: getStorage<ThemeMode>(STORAGE_KEYS.themeMode, THEME_MODE.light),
    layoutDensity: getStorage<LayoutDensity>(
      STORAGE_KEYS.layoutDensity,
      LAYOUT_DENSITY.comfortable,
    ),
    tagViewsVisible: getStorage(STORAGE_KEYS.tagViewsVisible, true),
    keepAliveEnabled: getStorage(STORAGE_KEYS.keepAliveEnabled, true),
    settingsDrawerVisible: false,
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
    setLayoutDensity(density: LayoutDensity) {
      this.layoutDensity = density;
      setStorage(STORAGE_KEYS.layoutDensity, density);
    },
    setTagViewsVisible(visible: boolean) {
      this.tagViewsVisible = visible;
      setStorage(STORAGE_KEYS.tagViewsVisible, visible);
    },
    setKeepAliveEnabled(enabled: boolean) {
      this.keepAliveEnabled = enabled;
      setStorage(STORAGE_KEYS.keepAliveEnabled, enabled);
    },
    setSettingsDrawerVisible(visible: boolean) {
      this.settingsDrawerVisible = visible;
    },
    openSettingsDrawer() {
      this.setSettingsDrawerVisible(true);
    },
    closeSettingsDrawer() {
      this.setSettingsDrawerVisible(false);
    },
    setLayoutReady(ready: boolean) {
      this.layoutReady = ready;
    },
  },
});
