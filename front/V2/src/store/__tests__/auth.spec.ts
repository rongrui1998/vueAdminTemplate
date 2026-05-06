import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('clears screen lock state and password when auth is cleared', () => {
    const authStore = useAuthStore();
    const appStore = useAppStore();

    appStore.setScreenLockPassword('246810');
    appStore.setScreenLocked(true);

    authStore.clearAuth();

    expect(appStore.screenLocked).toBe(false);
    expect(appStore.screenLockPassword).toBe('');
    expect(sessionStorage.getItem('admin-template-screen-lock-active')).toBeNull();
    expect(sessionStorage.getItem('admin-template-screen-lock-password')).toBeNull();
  });
});
