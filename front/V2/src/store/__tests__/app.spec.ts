import { createPinia, setActivePinia } from 'pinia';
import { STORAGE_KEYS } from '@/constants/app';
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

  it('controls the global settings drawer visibility', () => {
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    expect(appStore.settingsDrawerVisible).toBe(true);

    appStore.closeSettingsDrawer();
    expect(appStore.settingsDrawerVisible).toBe(false);
  });
});
