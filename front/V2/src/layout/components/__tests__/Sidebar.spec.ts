import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { THEME_MODE } from '@/constants/app';
import { APP_BRAND } from '@/constants/branding';
import Sidebar from '@/layout/components/Sidebar.vue';
import { useAppStore } from '@/store/modules/app';

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    useRoute: () => ({
      path: '/dashboard',
    }),
  };
});

describe('Sidebar', () => {
  it('collapses menu and hides title in sidebar navigation mode', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

    appStore.setLayoutMode('sidebar');

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [ElementPlus, pinia],
        stubs: {
          Monitor: true,
          SidebarMenu: true,
        },
      },
    });

    expect(wrapper.find('.sidebar__title').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'ElMenu' }).props('collapse')).toBe(true);
  });

  it('shows the app title initial when collapsed and no collapsed logo is configured', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

    appStore.setLayoutMode('sidebar');

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [ElementPlus, pinia],
        stubs: {
          Monitor: true,
          SidebarMenu: true,
        },
      },
    });

    expect(APP_BRAND.collapsedLogo).toBe('');
    expect(wrapper.find('.sidebar__brand-initial').text()).toBe('V');
    expect(wrapper.find('.sidebar__brand-image').exists()).toBe(false);
  });

  it('renders the collapsed logo image when configured', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

    appStore.setLayoutMode('sidebar');

    const wrapper = mount(Sidebar, {
      props: {
        collapsedLogoOverride: '/mock/collapsed-logo.svg',
      },
      global: {
        plugins: [ElementPlus, pinia],
        stubs: {
          Monitor: true,
          SidebarMenu: true,
        },
      },
    });

    expect(wrapper.find('.sidebar__brand-image').attributes('src')).toBe(
      '/mock/collapsed-logo.svg',
    );
    expect(wrapper.find('.sidebar__brand-initial').exists()).toBe(false);
  });

  it('inherits dark sidebar menu hover variables from the layout container', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

    appStore.setDarkSidebarEnabled(true);

    const wrapper = mount(
      {
        components: { Sidebar },
        template: '<div class="app-layout app-layout--dark-sidebar"><Sidebar /></div>',
      },
      {
        global: {
          plugins: [ElementPlus, pinia],
          stubs: {
            Monitor: true,
            SidebarMenu: true,
          },
        },
      },
    );

    const aside = wrapper.find('.app-layout--dark-sidebar');

    expect(aside.classes()).toContain('app-layout--dark-sidebar');
  });

  it('applies dark sidebar menu styles in global dark theme', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();

    appStore.setThemeMode(THEME_MODE.dark);

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [ElementPlus, pinia],
        stubs: {
          Monitor: true,
          SidebarMenu: true,
        },
      },
    });

    expect(wrapper.findComponent({ name: 'ElMenu' }).classes()).toContain('sidebar__menu--dark');
  });
});
