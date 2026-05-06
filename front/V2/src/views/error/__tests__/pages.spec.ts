import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { useAppStore } from '@/store/modules/app';
import NotFoundPage from '@/views/error/404.vue';
import ForbiddenPage from '@/views/error/403.vue';
import RouteMissingPage from '@/views/error/route-missing.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    meta: {
      component: 'demo/missing/index',
    },
  }),
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('error pages', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setI18nLanguage('zh-CN');
  });

  it('renders the polished 404 guidance', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    expect(wrapper.text()).toContain('页面走丢了');
    expect(wrapper.text()).toContain('返回首页');
  });

  it('renders missing route configuration diagnostics', () => {
    const wrapper = mount(RouteMissingPage, {
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    expect(wrapper.text()).toContain('页面配置异常');
    expect(wrapper.text()).toContain('demo/missing/index');
  });

  it('renders English copy for 403 and 404 when current language is English', () => {
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const forbiddenWrapper = mount(ForbiddenPage, {
      global: {
        plugins: [ElementPlus, i18n],
      },
    });
    const notFoundWrapper = mount(NotFoundPage, {
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    expect(forbiddenWrapper.text()).toContain('You do not have access to this page');
    expect(forbiddenWrapper.text()).toContain('Back to Dashboard');
    expect(notFoundWrapper.text()).toContain('Page Not Found');
    expect(notFoundWrapper.text()).toContain('Back to Dashboard');
  });

  it('renders English diagnostics for the route-missing page when current language is English', () => {
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(RouteMissingPage, {
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    expect(wrapper.text()).toContain('Dynamic Route Guard');
    expect(wrapper.text()).toContain('Page Configuration Error');
    expect(wrapper.text()).toContain('demo/missing/index');
    expect(wrapper.text()).toContain('Back to Dashboard');
  });
});
