import { computed, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TopNav from '@/layout/components/TopNav.vue';
import { THEME_MODE } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';

const toggleFullscreenMock = vi.fn(async () => undefined);
const routerReplaceMock = vi.fn();

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    useRoute: () => ({
      fullPath: '/dashboard',
      path: '/dashboard',
      query: {},
      meta: {},
      name: 'Dashboard',
    }),
    useRouter: () => ({
      replace: routerReplaceMock,
      push: vi.fn(),
    }),
  };
});

vi.mock('@/hooks/useFullscreen', () => ({
  useFullscreen: () => ({
    isFullscreen: computed(() => false),
    toggleFullscreen: toggleFullscreenMock,
  }),
}));

const buttonStub = {
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
};

const tooltipStub = {
  template: '<div><slot /></div>',
};

const iconStub = {
  template: '<span><slot /></span>',
};

const badgeStub = {
  props: ['value', 'hidden'],
  template: '<span><slot /><span v-if="!hidden" class="badge-value">{{ value }}</span></span>',
};

const avatarStub = {
  template: '<span class="avatar-stub"><slot /></span>',
};

const dropdownStub = {
  template: '<div><slot /><slot name="dropdown" /></div>',
};

const dropdownMenuStub = {
  template: '<div><slot /></div>',
};

const dropdownItemStub = {
  template: '<button><slot /></button>',
};

const notificationPanelStub = {
  props: ['messages', 'unreadCount'],
  template:
    '<div data-test="notification-panel-stub">panel: {{ unreadCount }} / {{ messages.length }}</div>',
};

describe('TopNav', () => {
  it('toggles the theme mode and opens or closes the notification panel', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.themeMode = THEME_MODE.light;

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['dashboard:view'],
    };

    const wrapper = mount(TopNav, {
      attachTo: document.body,
      global: {
        plugins: [pinia],
        stubs: {
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
        },
      },
    });

    await wrapper.findAll('.top-nav__icon-button')[0].trigger('click');
    expect(appStore.themeMode).toBe(THEME_MODE.dark);

    expect(wrapper.find('[data-test="notification-panel-stub"]').exists()).toBe(false);

    await wrapper.get('.top-nav__notification-button').trigger('click');
    expect(wrapper.find('[data-test="notification-panel-stub"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('panel: 4 / 4');

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.find('[data-test="notification-panel-stub"]').exists()).toBe(false);

    wrapper.unmount();
  });
});
