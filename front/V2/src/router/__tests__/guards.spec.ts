import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { getMenuListApi } from '@/api/menu';
import { DASHBOARD_PATH, FORBIDDEN_PATH, LOGIN_PATH } from '@/constants/route';
import { menuData } from '@/mock/data/menus';
import { setupRouterGuards } from '@/router/guards';
import { staticRoutes } from '@/router/static-routes';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { APP_TITLE } from '@/constants/app';

vi.mock('nprogress', () => ({
  default: {
    configure: vi.fn(),
    start: vi.fn(),
    done: vi.fn(),
  },
}));

const nprogressModule = await import('nprogress');
const nprogressStartMock = vi.mocked(nprogressModule.default.start);
const nprogressDoneMock = vi.mocked(nprogressModule.default.done);

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

function createMenuList(list = menuData) {
  return {
    list,
    total: list.length,
  };
}

describe('router guards', () => {
  beforeEach(() => {
    vi.mocked(getMenuListApi).mockResolvedValue(createMenuList());
    nprogressStartMock.mockClear();
    nprogressDoneMock.mockClear();
  });

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

  it('supports direct access to the permission demo route after loading menus', async () => {
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

    await router.push('/demo/permission');

    expect(router.currentRoute.value.path).toBe('/demo/permission');
    expect(router.currentRoute.value.name).toBe('route_demo-permission');
  });

  it('redirects hidden but injected routes to 403 when the account lacks permission', async () => {
    setActivePinia(createPinia());

    vi.mocked(getMenuListApi).mockResolvedValue(
      createMenuList([
        menuData[0],
        {
          ...menuData[1],
          hidden: true,
          children: [
            {
              ...menuData[1].children![2],
              hidden: true,
            },
          ],
        },
      ]),
    );

    const router = createTestRouter();

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

    await router.push('/system/menu');

    expect(router.currentRoute.value.path).toBe(FORBIDDEN_PATH);
  });

  it('does not start the page transition progress bar when disabled', async () => {
    setActivePinia(createPinia());

    const appStore = useAppStore();
    appStore.setPageTransitionProgressEnabled(false);

    const router = createTestRouter();

    await router.push('/login');

    expect(nprogressStartMock).not.toHaveBeenCalled();
    expect(nprogressDoneMock).not.toHaveBeenCalled();
  });

  it('activates page transition animation after a successful navigation when enabled', async () => {
    setActivePinia(createPinia());

    const appStore = useAppStore();
    appStore.setPageTransitionAnimationEnabled(true);

    const router = createTestRouter();

    await router.push('/login');

    expect(appStore.pageTransitionAnimationActive).toBe(true);
  });

  it('uses the English route title for the document title when current language is English', async () => {
    setActivePinia(createPinia());

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');

    const router = createTestRouter();
    router.addRoute('RootLayout', {
      path: 'english-title',
      name: 'EnglishTitleRoute',
      component: { template: '<div />' },
      meta: {
        title: '中文标题',
        titleEn: 'English Title',
        permission: 'dashboard:view',
      },
    });

    const authStore = useAuthStore();
    authStore.token = 'mock-access-token-admin';
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['dashboard:view'],
    };

    const permissionStore = usePermissionStore();
    permissionStore.routeLoaded = true;

    await router.push('/english-title');

    expect(document.title).toBe(`English Title - ${APP_TITLE}`);
  });
});
