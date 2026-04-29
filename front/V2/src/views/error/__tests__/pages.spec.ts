import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import NotFoundPage from '@/views/error/404.vue';
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
  it('renders the polished 404 guidance', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        plugins: [ElementPlus],
      },
    });

    expect(wrapper.text()).toContain('页面走丢了');
    expect(wrapper.text()).toContain('返回首页');
  });

  it('renders missing route configuration diagnostics', () => {
    const wrapper = mount(RouteMissingPage, {
      global: {
        plugins: [ElementPlus],
      },
    });

    expect(wrapper.text()).toContain('页面配置异常');
    expect(wrapper.text()).toContain('demo/missing/index');
  });
});
