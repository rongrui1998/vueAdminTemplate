import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { DASHBOARD_PATH, FORBIDDEN_PATH, LOGIN_PATH } from '@/constants/route';
import { menuData } from '@/mock/data/menus';
import { setupRouterGuards } from '@/router/guards';
import { staticRoutes } from '@/router/static-routes';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';

vi.mock('@/api/menu', () => ({
  getMenuListApi: vi.fn(async () => ({
    list: menuData,
    total: menuData.length,
  })),
}));

function createTestRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: staticRoutes,
  });

  setupRouterGuards(router);
  return router;
}

describe('router guards', () => {
  it('redirects unauthenticated users to login', async () => {
    setActivePinia(createPinia());

    const router = createTestRouter();
    router.addRoute('RootLayout', {
      path: 'protected',
      name: 'ProtectedRoute',
      component: { template: '<div />' },
      meta: {
        title: '受保护页面',
        permission: 'protected:view',
      },
    });

    await router.push('/protected');

    expect(router.currentRoute.value.path).toBe(LOGIN_PATH);
    expect(router.currentRoute.value.query.redirect).toBe('/protected');
  });

  it('redirects forbidden routes to 403 for logged-in users', async () => {
    setActivePinia(createPinia());

    const router = createTestRouter();
    router.addRoute('RootLayout', {
      path: 'system/admin',
      name: 'SystemAdmin',
      component: { template: '<div />' },
      meta: {
        title: '系统管理',
        permission: 'system:admin',
      },
    });

    const authStore = useAuthStore();
    authStore.token = 'mock-access-token-editor';
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-2',
      username: 'editor',
      nickname: '运营编辑',
      avatar: '',
      roles: ['editor'],
      permissions: ['dashboard:view'],
    };

    const permissionStore = usePermissionStore();
    permissionStore.routeLoaded = true;

    await router.push('/system/admin');

    expect(router.currentRoute.value.path).toBe(FORBIDDEN_PATH);
  });

  it('restores an intended dynamic route after loading menu access', async () => {
    setActivePinia(createPinia());

    const router = createTestRouter();

    const authStore = useAuthStore();
    authStore.token = 'mock-access-token-admin';
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [],
    };

    await router.push(DASHBOARD_PATH);
    await router.push('/demo/nested/example');

    expect(router.currentRoute.value.path).toBe('/demo/nested/example');
  });
});
