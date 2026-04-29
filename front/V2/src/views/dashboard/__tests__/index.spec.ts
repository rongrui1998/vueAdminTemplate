import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import DashboardPage from '@/views/dashboard/index.vue';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';

const dashboardApiMock = vi.hoisted(() => ({
  getDashboardStatisticsApi: vi.fn(),
}));

vi.mock('@/api/dashboard', () => ({
  getDashboardStatisticsApi: dashboardApiMock.getDashboardStatisticsApi,
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

describe('dashboard page', () => {
  beforeEach(() => {
    dashboardApiMock.getDashboardStatisticsApi.mockResolvedValue({
      cards: [
        {
          key: 'users',
          title: '用户数',
          value: 12,
          unit: '人',
          description: '当前账号总数',
        },
      ],
    });
  });

  it('renders quick entries and system status panels', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [],
    };

    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [ElementPlus, pinia],
      },
    });

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('快捷入口');
    expect(wrapper.text()).toContain('系统状态');
    expect(wrapper.text()).toContain('V2 Standard');
  });

  it('falls back to static statistics when api loading fails', async () => {
    dashboardApiMock.getDashboardStatisticsApi.mockRejectedValueOnce(new Error('Request failed'));

    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [],
    };

    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [ElementPlus, pinia],
      },
    });

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('今日销售额');
    expect(wrapper.text()).not.toContain('加载失败');
  });

  it('opens global settings through the quick entry instead of navigating to a missing page', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const appStore = useAppStore();
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [],
    };

    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [ElementPlus, pinia],
      },
    });

    await waitForPage(wrapper);
    await wrapper.findAll('.quick-entry-card').at(3)?.trigger('click');

    expect(appStore.settingsDrawerVisible).toBe(true);
  });
});
