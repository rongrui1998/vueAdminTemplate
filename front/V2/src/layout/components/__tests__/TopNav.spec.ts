import { computed, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import TopNav from '@/layout/components/TopNav.vue';
import { APP_LANGUAGE, THEME_MODE } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';

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
  emits: ['click'],
  template:
    '<button class="dropdown-item-stub" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
};

const notificationPanelStub = {
  props: ['messages', 'unreadCount'],
  template:
    '<div data-test="notification-panel-stub">panel: {{ unreadCount }} / {{ messages.length }}</div>',
};

const menuStub = {
  props: ['defaultActive', 'mode'],
  template:
    '<nav data-test="horizontal-menu" :data-mode="mode" :data-active="defaultActive"><slot /></nav>',
};

const menuItemStub = {
  props: ['index'],
  template: '<a class="horizontal-menu-item" :data-index="index"><slot name="title" /><slot /></a>',
};

const subMenuStub = {
  props: ['index'],
  template:
    '<div class="horizontal-sub-menu" :data-index="index"><slot name="title" /><slot /></div>',
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
        plugins: [pinia, i18n],
        stubs: {
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElMenu: menuStub,
          ElMenuItem: menuItemStub,
          ElSubMenu: subMenuStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
          SidebarMenu: true,
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

  it('shows a language switch button and opens the language menu', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

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
        plugins: [pinia, i18n],
        stubs: {
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElMenu: menuStub,
          ElMenuItem: menuItemStub,
          ElSubMenu: subMenuStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
          SidebarMenu: true,
        },
      },
    });

    expect(wrapper.find('[data-test="language-switch"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="language-panel"]').exists()).toBe(false);

    await wrapper.find('[data-test="language-switch"]').trigger('click');

    expect(wrapper.find('[data-test="language-panel"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('简体中文');
    expect(wrapper.text()).toContain('English');
    expect(wrapper.find('.top-nav__language-option.is-active').text()).toContain('简体中文');

    await wrapper.findAll('.top-nav__language-option')[1].trigger('click');

    expect(appStore.currentLanguage).toBe(APP_LANGUAGE.enUS);
    expect(wrapper.find('[data-test="language-panel"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('renders visible menus horizontally in horizontal layout mode', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setLayoutMode('horizontal');

    const permissionStore = usePermissionStore();
    permissionStore.menuTree = [
      {
        id: 'dashboard',
        parentId: null,
        name: '首页',
        path: 'dashboard',
        fullPath: '/dashboard',
        routeName: 'route_dashboard',
        component: 'dashboard/index',
        icon: 'House',
        type: 'menu',
        children: [],
      },
    ];

    const wrapper = mount(TopNav, {
      attachTo: document.body,
      global: {
        plugins: [pinia, i18n],
        stubs: {
          AppIcon: true,
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElMenu: menuStub,
          ElMenuItem: menuItemStub,
          ElSubMenu: subMenuStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
        },
      },
    });

    expect(wrapper.find('[data-test="horizontal-menu"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="horizontal-menu"]').attributes('data-mode')).toBe(
      'horizontal',
    );
    expect(wrapper.find('[data-test="sidebar-toggle"]').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'BreadcrumbNav' }).exists()).toBe(false);
    expect(wrapper.text()).toContain('首页');

    wrapper.unmount();
  });

  it('switches sidebar navigation mode back to vertical when clicking sidebar toggle', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setLayoutMode('sidebar');

    const wrapper = mount(TopNav, {
      attachTo: document.body,
      global: {
        plugins: [pinia, i18n],
        stubs: {
          AppIcon: true,
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElMenu: menuStub,
          ElMenuItem: menuItemStub,
          ElSubMenu: subMenuStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
          SidebarMenu: true,
        },
      },
    });

    await wrapper.find('[data-test="sidebar-toggle"]').trigger('click');

    expect(appStore.layoutMode).toBe('vertical');

    wrapper.unmount();
  });

  it('renders lock screen and logout actions with shortcut hints in the user dropdown', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage(APP_LANGUAGE.enUS);
    setI18nLanguage(APP_LANGUAGE.enUS);
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
        plugins: [pinia, i18n],
        stubs: {
          BreadcrumbNav: true,
          ElAvatar: avatarStub,
          ElBadge: badgeStub,
          ElButton: buttonStub,
          ElDropdown: dropdownStub,
          ElDropdownItem: dropdownItemStub,
          ElDropdownMenu: dropdownMenuStub,
          ElIcon: iconStub,
          ElMenu: menuStub,
          ElMenuItem: menuItemStub,
          ElSubMenu: subMenuStub,
          ElTooltip: tooltipStub,
          NotificationPanel: notificationPanelStub,
          SidebarMenu: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Lock Screen');
    expect(wrapper.text()).toContain('Sign Out');
    expect(wrapper.text()).toContain('⌥ L');
    expect(wrapper.text()).toContain('⌥ Q');

    const actions = wrapper.findAll('.dropdown-item-stub');
    await actions[0].trigger('click');

    expect(appStore.screenLocked).toBe(true);

    wrapper.unmount();
  });
});
