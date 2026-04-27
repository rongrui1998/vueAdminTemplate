import { createPinia, setActivePinia } from 'pinia';
import { usePermission } from '@/composables/usePermission';
import { useAuthStore } from '@/store/modules/auth';

describe('usePermission', () => {
  it('evaluates single and grouped permissions from auth store', () => {
    setActivePinia(createPinia());

    const authStore = useAuthStore();
    authStore.userInfo = {
      id: 'u-1',
      username: 'editor',
      nickname: '运营编辑',
      avatar: '',
      roles: ['editor'],
      permissions: ['demo:crud:view', 'demo:crud:create'],
    };

    const { hasAllPermissions, hasAnyPermission, hasPermission } = usePermission();

    expect(hasPermission('demo:crud:create')).toBe(true);
    expect(hasPermission('demo:crud:delete')).toBe(false);
    expect(hasAnyPermission(['demo:crud:delete', 'demo:crud:create'])).toBe(true);
    expect(hasAllPermissions(['demo:crud:view', 'demo:crud:create'])).toBe(true);
    expect(hasAllPermissions(['demo:crud:view', 'demo:crud:delete'])).toBe(false);
  });
});
