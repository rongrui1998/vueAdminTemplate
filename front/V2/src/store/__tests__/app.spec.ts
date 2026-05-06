import { createPinia, setActivePinia } from 'pinia';
import { STORAGE_KEYS, THEME_PRESETS } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';

describe('app store settings', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('persists layout density, tag view visibility, and keep alive preference', () => {
    const appStore = useAppStore();

    appStore.setLayoutDensity('compact');
    appStore.setTagViewsVisible(false);
    appStore.setKeepAliveEnabled(false);

    expect(appStore.layoutDensity).toBe('compact');
    expect(appStore.tagViewsVisible).toBe(false);
    expect(appStore.keepAliveEnabled).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.layoutDensity)).toBe('"compact"');
    expect(localStorage.getItem(STORAGE_KEYS.tagViewsVisible)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.keepAliveEnabled)).toBe('false');
  });

  it('persists layout mode and content width preferences', () => {
    const appStore = useAppStore();

    appStore.setLayoutMode('sidebar');
    appStore.setContentWidthMode('fixed');

    expect(appStore.layoutMode).toBe('sidebar');
    expect(appStore.contentWidthMode).toBe('fixed');
    expect(localStorage.getItem(STORAGE_KEYS.layoutMode)).toBe('"sidebar"');
    expect(localStorage.getItem(STORAGE_KEYS.contentWidthMode)).toBe('"fixed"');
  });

  it('persists shortcut preference', () => {
    const appStore = useAppStore();

    appStore.setShortcutHintsEnabled(false);
    appStore.setLogoutShortcutEnabled(false);
    appStore.setScreenLockShortcutEnabled(false);
    appStore.setScreenLockPassword('246810');

    expect(appStore.shortcutHintsEnabled).toBe(false);
    expect(appStore.logoutShortcutEnabled).toBe(false);
    expect(appStore.screenLockShortcutEnabled).toBe(false);
    expect(appStore.screenLockPassword).toBe('246810');
    expect(localStorage.getItem(STORAGE_KEYS.shortcutHintsEnabled)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.logoutShortcutEnabled)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.screenLockShortcutEnabled)).toBe('false');
  });

  it('persists dark layout chrome preferences', () => {
    const appStore = useAppStore();

    appStore.setDarkSidebarEnabled(true);
    appStore.setDarkHeaderEnabled(true);

    expect(appStore.darkSidebarEnabled).toBe(true);
    expect(appStore.darkHeaderEnabled).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.darkSidebarEnabled)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEYS.darkHeaderEnabled)).toBe('true');
  });

  it('persists and applies general visual accessibility preferences', () => {
    const appStore = useAppStore();

    appStore.setGrayModeEnabled(true);
    appStore.setColorWeakModeEnabled(true);
    appStore.setPageTransitionProgressEnabled(false);
    appStore.setPageTransitionLoadingEnabled(false);
    appStore.setPageTransitionAnimationEnabled(false);
    appStore.setPageTransitionAnimationName('zoom-fade');

    expect(appStore.grayModeEnabled).toBe(true);
    expect(appStore.colorWeakModeEnabled).toBe(true);
    expect(appStore.pageTransitionProgressEnabled).toBe(false);
    expect(appStore.pageTransitionLoadingEnabled).toBe(false);
    expect(appStore.pageTransitionAnimationEnabled).toBe(false);
    expect(appStore.pageTransitionAnimationName).toBe('zoom-fade');
    expect(localStorage.getItem(STORAGE_KEYS.grayModeEnabled)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEYS.colorWeakModeEnabled)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEYS.pageTransitionProgressEnabled)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.pageTransitionLoadingEnabled)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.pageTransitionAnimationEnabled)).toBe('false');
    expect(localStorage.getItem(STORAGE_KEYS.pageTransitionAnimationName)).toBe('"zoom-fade"');
    expect(document.documentElement.classList.contains('app-gray-mode')).toBe(true);
    expect(document.documentElement.classList.contains('app-color-weak-mode')).toBe(true);
  });

  it('resets persisted UI preferences to defaults', () => {
    const appStore = useAppStore();

    appStore.setLayoutDensity('compact');
    appStore.setDarkSidebarEnabled(true);
    appStore.setDarkHeaderEnabled(true);
    appStore.setGrayModeEnabled(true);
    appStore.setColorWeakModeEnabled(true);
    appStore.setPageTransitionProgressEnabled(false);
    appStore.setPageTransitionLoadingEnabled(false);
    appStore.setPageTransitionAnimationEnabled(false);
    appStore.setPageTransitionAnimationName('zoom-fade');
    appStore.setLayoutMode('sidebar');
    appStore.setContentWidthMode('fixed');
    appStore.setTagViewsVisible(false);
    appStore.setKeepAliveEnabled(false);
    appStore.resetUiPreferences();

    expect(appStore.layoutDensity).toBe('comfortable');
    expect(appStore.darkSidebarEnabled).toBe(false);
    expect(appStore.darkHeaderEnabled).toBe(false);
    expect(appStore.grayModeEnabled).toBe(false);
    expect(appStore.colorWeakModeEnabled).toBe(false);
    expect(appStore.pageTransitionProgressEnabled).toBe(true);
    expect(appStore.pageTransitionLoadingEnabled).toBe(true);
    expect(appStore.pageTransitionAnimationEnabled).toBe(true);
    expect(appStore.pageTransitionAnimationName).toBe('fade');
    expect(appStore.layoutMode).toBe('vertical');
    expect(appStore.contentWidthMode).toBe('fluid');
    expect(appStore.tagViewsVisible).toBe(true);
    expect(appStore.keepAliveEnabled).toBe(true);
    expect(appStore.screenLockPassword).toBe('');
    expect(localStorage.getItem(STORAGE_KEYS.layoutDensity)).toBe('"comfortable"');
    expect(document.documentElement.classList.contains('app-gray-mode')).toBe(false);
  });

  it('persists theme preset and applies its primary color variables', () => {
    const appStore = useAppStore();

    appStore.setThemePreset('violet');

    expect(appStore.themePreset).toBe('violet');
    expect(localStorage.getItem(STORAGE_KEYS.themePreset)).toBe('"violet"');
    expect(document.documentElement.dataset.themePreset).toBe('violet');
    expect(document.documentElement.style.getPropertyValue('--el-color-primary')).toBe(
      THEME_PRESETS.violet.color,
    );
    expect(document.documentElement.style.getPropertyValue('--el-color-primary-light-9')).toBe(
      THEME_PRESETS.violet.light9,
    );
  });

  it('controls the global settings drawer visibility', () => {
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    expect(appStore.settingsDrawerVisible).toBe(true);

    appStore.closeSettingsDrawer();
    expect(appStore.settingsDrawerVisible).toBe(false);
  });

  it('persists the current language preference', () => {
    const appStore = useAppStore();

    appStore.setCurrentLanguage('en-US');

    expect(appStore.currentLanguage).toBe('en-US');
    expect(localStorage.getItem(STORAGE_KEYS.currentLanguage)).toBe('"en-US"');
  });

  it('toggles screen lock state in memory', () => {
    const appStore = useAppStore();

    appStore.setScreenLocked(true);
    expect(appStore.screenLocked).toBe(true);

    appStore.setScreenLocked(false);
    expect(appStore.screenLocked).toBe(false);
  });

  it('restores the lock state and current lock password after a refresh-like store recreation', () => {
    let appStore = useAppStore();

    appStore.setScreenLockPassword('246810');
    appStore.setScreenLocked(true);

    setActivePinia(createPinia());
    appStore = useAppStore();

    expect(appStore.screenLocked).toBe(true);
    expect(appStore.screenLockPassword).toBe('246810');
  });

  it('clears persisted lock session data when unlocking before a refresh-like store recreation', () => {
    let appStore = useAppStore();

    appStore.setScreenLockPassword('246810');
    appStore.setScreenLocked(true);
    appStore.setScreenLockPassword('');
    appStore.setScreenLocked(false);

    setActivePinia(createPinia());
    appStore = useAppStore();

    expect(appStore.screenLocked).toBe(false);
    expect(appStore.screenLockPassword).toBe('');
  });
});
