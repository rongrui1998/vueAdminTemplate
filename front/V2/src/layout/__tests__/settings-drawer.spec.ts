import { mount } from '@vue/test-utils';
import { ElMessage } from 'element-plus';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import AppLayout from '@/layout/index.vue';
import { LOGIN_PATH } from '@/constants/route';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';

const routerReplaceMock = vi.fn();

vi.mock('@/layout/components/AppMain.vue', () => ({
  default: {
    template: '<main>AppMain</main>',
  },
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    useRouter: () => ({
      replace: routerReplaceMock,
      push: vi.fn(),
    }),
    useRoute: () => ({
      fullPath: '/dashboard',
      path: '/dashboard',
      query: {},
      meta: {},
      name: 'Dashboard',
    }),
  };
});

vi.mock('@/layout/components/Sidebar.vue', () => ({
  default: {
    template: '<aside>Sidebar</aside>',
  },
}));

vi.mock('@/layout/components/TagViews.vue', () => ({
  default: {
    template: '<nav>TagViews</nav>',
  },
}));

vi.mock('@/layout/components/TopNav.vue', () => ({
  default: {
    template: '<header>TopNav</header>',
  },
}));

describe('layout settings drawer', () => {
  beforeEach(() => {
    setI18nLanguage('zh-CN');
  });

  it('opens global settings from a fixed right side button', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });

    const button = wrapper.find('[aria-label="打开界面设置"]');

    expect(button.exists()).toBe(true);
    await button.trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('界面设置');
    expect(wrapper.text()).toContain('外观');
    expect(wrapper.text()).toContain('内置主题');
    expect(wrapper.text()).not.toContain('自定义偏好设置');
    expect(wrapper.text()).not.toContain('布局密度');
    expect(wrapper.text()).toContain('页面缓存');
    expect(wrapper.text()).not.toContain('当前密度');
    expect(wrapper.text()).not.toContain('标签栏显示页面缓存启用');
    expect(wrapper.find('[aria-label="刷新偏好设置"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="偏好联动"]').exists()).toBe(false);
  });

  it('hides the floating settings trigger while the drawer is open', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    expect(wrapper.find('[aria-label="打开界面设置"]').exists()).toBe(true);

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[aria-label="打开界面设置"]').exists()).toBe(false);
  });

  it('updates the theme preset from the appearance color grid', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="theme-preset-violet"]').trigger('click');

    expect(appStore.themePreset).toBe('violet');
  });

  it('shows clickable dark layout switches before theme selection in appearance settings', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text.indexOf('深色侧边栏')).toBeLessThan(text.indexOf('主题'));
    expect(text.indexOf('深色顶栏')).toBeLessThan(text.indexOf('主题'));
    expect(text).not.toContain('深色侧边栏子栏');

    await wrapper.find('[data-test="appearance-dark-sidebar-switch"]').trigger('click');
    await wrapper.find('[data-test="appearance-dark-header-switch"]').trigger('click');

    expect(appStore.darkSidebarEnabled).toBe(true);
    expect(appStore.darkHeaderEnabled).toBe(true);
  });

  it('applies dark sidebar and header classes from layout settings', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="appearance-dark-sidebar-switch"]').trigger('click');
    await wrapper.find('[data-test="appearance-dark-header-switch"]').trigger('click');

    expect(appStore.darkSidebarEnabled).toBe(true);
    expect(appStore.darkHeaderEnabled).toBe(true);
    expect(wrapper.find('.app-layout').classes()).toContain('app-layout--dark-sidebar');
    expect(wrapper.find('.app-layout').classes()).toContain('app-layout--dark-header');
  });

  it('selects supported layout mode and content width from layout cards', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="settings-tab-layout"]').trigger('click');

    expect(wrapper.text()).not.toContain('双列菜单');
    expect(wrapper.text()).not.toContain('混合垂直');
    expect(wrapper.text()).not.toContain('混合双列');

    await wrapper.find('[data-test="layout-mode-sidebar"]').trigger('click');
    await wrapper.find('[data-test="content-width-fixed"]').trigger('click');

    expect(appStore.layoutMode).toBe('sidebar');
    expect(appStore.contentWidthMode).toBe('fixed');
    expect(wrapper.find('.app-layout').classes()).toContain('app-layout--mode-sidebar');
    expect(wrapper.find('.app-layout').classes()).toContain('app-layout--content-fixed');
    expect(wrapper.text()).not.toContain('布局密度');
  });

  it('selects horizontal layout and hides sidebar', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="settings-tab-layout"]').trigger('click');

    expect(
      wrapper.find('[data-test="layout-mode-horizontal"]').attributes('disabled'),
    ).toBeUndefined();

    await wrapper.find('[data-test="layout-mode-horizontal"]').trigger('click');

    expect(appStore.layoutMode).toBe('horizontal');
    expect(wrapper.find('.app-layout').classes()).toContain('app-layout--mode-horizontal');
    expect(wrapper.find('.app-layout__aside').exists()).toBe(false);
  });

  it('keeps page spacing in full content layout', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();
    appStore.setLayoutMode('full-content');

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });

    expect(wrapper.find('.app-layout__main').classes()).toContain('app-layout__main--spaced');
    expect(wrapper.find('.app-layout__aside').exists()).toBe(false);
  });

  it('keeps tag view and keep alive controls working in the layout tab', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="settings-tab-layout"]').trigger('click');
    await wrapper.find('[data-test="tag-views-switch"]').trigger('click');
    await wrapper.find('[data-test="keep-alive-switch"]').trigger('click');

    expect(appStore.tagViewsVisible).toBe(false);
    expect(appStore.keepAliveEnabled).toBe(false);
  });

  it('updates general preferences and resets settings from the common tab', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="settings-tab-common"]').trigger('click');
    await wrapper.find('[data-test="page-transition-progress-switch"]').trigger('click');
    await wrapper.find('[data-test="page-transition-loading-switch"]').trigger('click');
    await wrapper.find('[data-test="page-transition-animation-switch"]').trigger('click');
    await wrapper.find('[data-test="page-transition-animation-zoom-fade"]').trigger('click');
    await wrapper.find('[data-test="gray-mode-switch"]').trigger('click');
    await wrapper.find('[data-test="color-weak-switch"]').trigger('click');

    expect(appStore.pageTransitionProgressEnabled).toBe(false);
    expect(appStore.pageTransitionLoadingEnabled).toBe(false);
    expect(appStore.pageTransitionAnimationEnabled).toBe(false);
    expect(appStore.pageTransitionAnimationName).toBe('zoom-fade');
    expect(appStore.grayModeEnabled).toBe(true);
    expect(appStore.colorWeakModeEnabled).toBe(true);

    await wrapper.find('[data-test="reset-ui-preferences"]').trigger('click');

    expect(appStore.grayModeEnabled).toBe(false);
    expect(appStore.colorWeakModeEnabled).toBe(false);
    expect(appStore.pageTransitionProgressEnabled).toBe(true);
    expect(appStore.pageTransitionLoadingEnabled).toBe(true);
    expect(appStore.pageTransitionAnimationEnabled).toBe(true);
    expect(appStore.pageTransitionAnimationName).toBe('fade');
    expect(appStore.themePreset).toBe('default');
  });

  it('opens settings with keyboard shortcut when shortcut hints are enabled', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: '≤', code: 'Comma', altKey: true }));
    await wrapper.vm.$nextTick();

    expect(appStore.settingsDrawerVisible).toBe(true);
    expect(wrapper.text()).toContain('偏好设置');
  });

  it('renders English settings copy when current language is English', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Preferences');
    expect(wrapper.text()).toContain('Appearance');
    expect(wrapper.text()).toContain('Layout');
    expect(wrapper.text()).toContain('Shortcuts');
    expect(wrapper.text()).toContain('General');
  });

  it('renders shortcut list and can disable shortcuts from the shortcut tab', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    setI18nLanguage('en-US');

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="settings-tab-shortcut"]').trigger('click');

    expect(wrapper.text()).toContain('Open Preferences');
    expect(wrapper.text()).toContain('Ctrl / ⌥ + ,');
    expect(wrapper.text()).toContain('Sign Out');
    expect(wrapper.text()).toContain('Ctrl / ⌥ + Q');
    expect(wrapper.text()).toContain('Lock Screen');
    expect(wrapper.text()).toContain('Ctrl / ⌥ + L');

    await wrapper.find('[data-test="shortcut-hints-switch"]').trigger('click');

    expect(appStore.shortcutHintsEnabled).toBe(false);
  });

  it('logs out and locks the screen with shortcuts when enabled', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, 'logout').mockResolvedValue(undefined);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'œ', code: 'KeyQ', altKey: true }));
    await wrapper.vm.$nextTick();

    expect(logoutSpy).toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: '¬', code: 'KeyL', altKey: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="screen-lock-overlay"]').exists()).toBe(true);
  });

  it('asks for a dedicated lock password before first unlock', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();
    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('设置锁屏密码');

    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(appStore.screenLockPassword).toBe('246810');
    expect(wrapper.text()).toContain('点击解锁');
  });

  it('returns to the previous page from the initial lock password setup state', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-cancel"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(appStore.screenLocked).toBe(false);
    expect(appStore.screenLockPassword).toBe('');
    expect(wrapper.find('[data-test="screen-lock-overlay"]').exists()).toBe(false);
  });

  it('unlocks from the vben-like screen lock panel with the password set for this lock session', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-trigger"]').trigger('click');
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-password"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-submit"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(appStore.screenLocked).toBe(false);
    expect(appStore.screenLockPassword).toBe('');
  });

  it('supports returning to login from the lock screen panel', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, 'logout').mockResolvedValue(undefined);

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-trigger"]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="screen-lock-logout"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(logoutSpy).toHaveBeenCalled();
    expect(appStore.screenLockPassword).toBe('');
    expect(routerReplaceMock).toHaveBeenCalledWith({
      path: LOGIN_PATH,
      query: { redirect: '/dashboard' },
    });
  });

  it('keeps the lock screen visible and shows an error when password validation fails', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-trigger"]').trigger('click');
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="screen-lock-password"]').setValue('bad-password');
    await wrapper.find('[data-test="screen-lock-submit"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(appStore.screenLocked).toBe(true);
    expect(ElMessage.error).toHaveBeenCalledWith('锁屏密码错误');
  });

  it('requires setting a new password for the next lock after unlocking once', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="screen-lock-trigger"]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="screen-lock-password"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-submit"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('设置锁屏密码');
    expect(wrapper.find('[data-test="screen-lock-password-setup"]').exists()).toBe(true);
  });

  it('renders English copy for the screen lock flow when current language is English', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });

    appStore.setScreenLocked(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Set Lock Password');
    expect(wrapper.text()).toContain('Back');
    expect(wrapper.text()).toContain('Sign Out');

    await wrapper.find('[data-test="screen-lock-password-setup"]').setValue('246810');
    await wrapper.find('[data-test="screen-lock-password-save"]').trigger('click');
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Click to unlock');

    await wrapper.find('[data-test="screen-lock-trigger"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Unlock Screen');
    expect(wrapper.text()).toContain('Back to lock screen');
  });

  it('opens global settings when the app store requests it', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDrawer: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
          },
          teleport: true,
        },
      },
    });
    const appStore = useAppStore();

    appStore.openSettingsDrawer();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('界面设置');
  });
});
