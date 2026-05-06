import { defineStore } from 'pinia';
import {
  APP_LANGUAGE,
  CONTENT_WIDTH_MODE,
  LAYOUT_DENSITY,
  LAYOUT_MODE,
  PAGE_TRANSITION_ANIMATION,
  STORAGE_KEYS,
  THEME_MODE,
  type AppLanguage,
  type ContentWidthMode,
  type LayoutDensity,
  type LayoutMode,
  type PageTransitionAnimationName,
  type ThemeMode,
  type ThemePreset,
} from '@/constants/app';
import type { AppSettingsState } from '@/types/route';
import {
  applyColorWeakMode,
  applyGrayMode,
  applyThemeMode,
  applyThemePreset,
} from '@/hooks/useTheme';
import { setI18nLanguage } from '@/plugins/i18n';
import {
  getSessionStorage,
  getStorage,
  removeSessionStorage,
  setSessionStorage,
  setStorage,
} from '@/utils/storage';

const SIDEBAR_COLLAPSE_BREAKPOINT = 1200;

export const useAppStore = defineStore('app', {
  state: (): AppSettingsState => ({
    currentLanguage: getStorage<AppLanguage>(STORAGE_KEYS.currentLanguage, APP_LANGUAGE.zhCN),
    sidebarCollapsed: getStorage(STORAGE_KEYS.sidebarCollapsed, false),
    themeMode: getStorage<ThemeMode>(STORAGE_KEYS.themeMode, THEME_MODE.light),
    themePreset: getStorage<ThemePreset>(STORAGE_KEYS.themePreset, 'default'),
    darkSidebarEnabled: getStorage(STORAGE_KEYS.darkSidebarEnabled, false),
    darkHeaderEnabled: getStorage(STORAGE_KEYS.darkHeaderEnabled, false),
    grayModeEnabled: getStorage(STORAGE_KEYS.grayModeEnabled, false),
    colorWeakModeEnabled: getStorage(STORAGE_KEYS.colorWeakModeEnabled, false),
    pageTransitionProgressEnabled: getStorage(STORAGE_KEYS.pageTransitionProgressEnabled, true),
    pageTransitionLoadingEnabled: getStorage(STORAGE_KEYS.pageTransitionLoadingEnabled, true),
    pageTransitionAnimationEnabled: getStorage(STORAGE_KEYS.pageTransitionAnimationEnabled, true),
    pageTransitionAnimationName: getStorage<PageTransitionAnimationName>(
      STORAGE_KEYS.pageTransitionAnimationName,
      PAGE_TRANSITION_ANIMATION.fade,
    ),
    layoutMode: getStorage<LayoutMode>(STORAGE_KEYS.layoutMode, LAYOUT_MODE.vertical),
    contentWidthMode: getStorage<ContentWidthMode>(
      STORAGE_KEYS.contentWidthMode,
      CONTENT_WIDTH_MODE.fluid,
    ),
    shortcutHintsEnabled: getStorage(STORAGE_KEYS.shortcutHintsEnabled, true),
    logoutShortcutEnabled: getStorage(STORAGE_KEYS.logoutShortcutEnabled, true),
    screenLockShortcutEnabled: getStorage(STORAGE_KEYS.screenLockShortcutEnabled, true),
    screenLockPassword: getSessionStorage(STORAGE_KEYS.screenLockPassword, ''),
    screenLocked: getSessionStorage(STORAGE_KEYS.screenLockActive, false),
    layoutDensity: getStorage<LayoutDensity>(
      STORAGE_KEYS.layoutDensity,
      LAYOUT_DENSITY.comfortable,
    ),
    tagViewsVisible: getStorage(STORAGE_KEYS.tagViewsVisible, true),
    keepAliveEnabled: getStorage(STORAGE_KEYS.keepAliveEnabled, true),
    settingsDrawerVisible: false,
    layoutReady: false,
    sidebarAutoCollapsed: false,
    pageTransitionLoading: false,
    pageTransitionAnimationActive: false,
  }),
  actions: {
    initializeSettings() {
      applyThemeMode(this.themeMode);
      applyThemePreset(this.themePreset);
      applyGrayMode(this.grayModeEnabled);
      applyColorWeakMode(this.colorWeakModeEnabled);
      this.syncSidebarWithViewport(window.innerWidth);
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.sidebarAutoCollapsed = false;
      setStorage(STORAGE_KEYS.sidebarCollapsed, this.sidebarCollapsed);
    },
    setCurrentLanguage(language: AppLanguage) {
      this.currentLanguage = language;
      setStorage(STORAGE_KEYS.currentLanguage, language);
      setI18nLanguage(language);
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
    setThemePreset(preset: ThemePreset) {
      this.themePreset = preset;
      setStorage(STORAGE_KEYS.themePreset, preset);
      applyThemePreset(preset);
    },
    setDarkSidebarEnabled(enabled: boolean) {
      this.darkSidebarEnabled = enabled;
      setStorage(STORAGE_KEYS.darkSidebarEnabled, enabled);
    },
    setDarkHeaderEnabled(enabled: boolean) {
      this.darkHeaderEnabled = enabled;
      setStorage(STORAGE_KEYS.darkHeaderEnabled, enabled);
    },
    setGrayModeEnabled(enabled: boolean) {
      this.grayModeEnabled = enabled;
      setStorage(STORAGE_KEYS.grayModeEnabled, enabled);
      applyGrayMode(enabled);
    },
    setColorWeakModeEnabled(enabled: boolean) {
      this.colorWeakModeEnabled = enabled;
      setStorage(STORAGE_KEYS.colorWeakModeEnabled, enabled);
      applyColorWeakMode(enabled);
    },
    setPageTransitionProgressEnabled(enabled: boolean) {
      this.pageTransitionProgressEnabled = enabled;
      setStorage(STORAGE_KEYS.pageTransitionProgressEnabled, enabled);
    },
    setPageTransitionLoadingEnabled(enabled: boolean) {
      this.pageTransitionLoadingEnabled = enabled;
      setStorage(STORAGE_KEYS.pageTransitionLoadingEnabled, enabled);
    },
    setPageTransitionLoading(loading: boolean) {
      this.pageTransitionLoading = loading;
    },
    setPageTransitionAnimationEnabled(enabled: boolean) {
      this.pageTransitionAnimationEnabled = enabled;
      setStorage(STORAGE_KEYS.pageTransitionAnimationEnabled, enabled);
    },
    setPageTransitionAnimationName(name: PageTransitionAnimationName) {
      this.pageTransitionAnimationName = name;
      setStorage(STORAGE_KEYS.pageTransitionAnimationName, name);
    },
    setPageTransitionAnimationActive(active: boolean) {
      this.pageTransitionAnimationActive = active;
    },
    setLayoutMode(mode: LayoutMode) {
      this.layoutMode = mode;
      setStorage(STORAGE_KEYS.layoutMode, mode);
    },
    setContentWidthMode(mode: ContentWidthMode) {
      this.contentWidthMode = mode;
      setStorage(STORAGE_KEYS.contentWidthMode, mode);
    },
    setShortcutHintsEnabled(enabled: boolean) {
      this.shortcutHintsEnabled = enabled;
      setStorage(STORAGE_KEYS.shortcutHintsEnabled, enabled);
    },
    setLogoutShortcutEnabled(enabled: boolean) {
      this.logoutShortcutEnabled = enabled;
      setStorage(STORAGE_KEYS.logoutShortcutEnabled, enabled);
    },
    setScreenLockShortcutEnabled(enabled: boolean) {
      this.screenLockShortcutEnabled = enabled;
      setStorage(STORAGE_KEYS.screenLockShortcutEnabled, enabled);
    },
    setScreenLockPassword(password: string) {
      this.screenLockPassword = password;

      if (password) {
        setSessionStorage(STORAGE_KEYS.screenLockPassword, password);
        return;
      }

      removeSessionStorage(STORAGE_KEYS.screenLockPassword);
    },
    setScreenLocked(locked: boolean) {
      this.screenLocked = locked;

      if (locked) {
        setSessionStorage(STORAGE_KEYS.screenLockActive, true);
        return;
      }

      removeSessionStorage(STORAGE_KEYS.screenLockActive);
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
    resetUiPreferences() {
      this.setCurrentLanguage(APP_LANGUAGE.zhCN);
      this.setThemeMode(THEME_MODE.light);
      this.setThemePreset('default');
      this.setLayoutDensity(LAYOUT_DENSITY.comfortable);
      this.setDarkSidebarEnabled(false);
      this.setDarkHeaderEnabled(false);
      this.setGrayModeEnabled(false);
      this.setColorWeakModeEnabled(false);
      this.setPageTransitionProgressEnabled(true);
      this.setPageTransitionLoadingEnabled(true);
      this.setPageTransitionLoading(false);
      this.setPageTransitionAnimationEnabled(true);
      this.setPageTransitionAnimationName(PAGE_TRANSITION_ANIMATION.fade);
      this.setPageTransitionAnimationActive(false);
      this.setLayoutMode(LAYOUT_MODE.vertical);
      this.setContentWidthMode(CONTENT_WIDTH_MODE.fluid);
      this.setShortcutHintsEnabled(true);
      this.setLogoutShortcutEnabled(true);
      this.setScreenLockShortcutEnabled(true);
      this.setScreenLockPassword('');
      this.setScreenLocked(false);
      this.setTagViewsVisible(true);
      this.setKeepAliveEnabled(true);
    },
    setLayoutReady(ready: boolean) {
      this.layoutReady = ready;
    },
  },
});
