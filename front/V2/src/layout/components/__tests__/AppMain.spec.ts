import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, nextTick } from 'vue';
import AppMain from '@/layout/components/AppMain.vue';
import { useAppStore } from '@/store/modules/app';

const routerViewStub = defineComponent({
  name: 'RouterView',
  setup(_, { slots }) {
    return () =>
      slots.default?.({
        Component: defineComponent({
          name: 'TestPage',
          template: '<section class="test-page">Page Content</section>',
        }),
        route: {
          fullPath: '/dashboard',
          name: 'Dashboard',
          meta: {
            keepAlive: false,
          },
        },
      });
  },
});

describe('AppMain', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows a page transition loading overlay only while the route is changing', async () => {
    const appStore = useAppStore();
    appStore.setPageTransitionLoadingEnabled(true);

    const wrapper = mount(AppMain, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: routerViewStub,
        },
      },
    });

    expect(wrapper.find('.app-main__loading').exists()).toBe(false);
    expect(wrapper.find('.test-page').exists()).toBe(true);

    appStore.setPageTransitionLoading(true);
    await nextTick();

    expect(wrapper.find('.app-main__loading').exists()).toBe(true);
    expect(wrapper.find('.test-page').exists()).toBe(true);

    appStore.setPageTransitionLoading(false);
    await nextTick();

    expect(wrapper.find('.app-main__loading').exists()).toBe(false);
  });

  it('does not show the overlay when page transition loading is disabled', async () => {
    const appStore = useAppStore();
    appStore.setPageTransitionLoadingEnabled(false);

    const wrapper = mount(AppMain, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: routerViewStub,
        },
      },
    });

    appStore.setPageTransitionLoading(true);
    await nextTick();

    expect(wrapper.find('.app-main__loading').exists()).toBe(false);
    expect(wrapper.find('.test-page').exists()).toBe(true);
  });

  it('applies the selected page transition animation class when animation is active', async () => {
    const appStore = useAppStore();
    appStore.setPageTransitionAnimationEnabled(true);
    appStore.setPageTransitionAnimationName('fade-slide-up');

    const wrapper = mount(AppMain, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: routerViewStub,
        },
      },
    });

    expect(wrapper.find('.app-main__content').classes()).not.toContain(
      'app-main__content--fade-slide-up',
    );

    appStore.setPageTransitionAnimationActive(true);
    await nextTick();

    expect(wrapper.find('.app-main__content').classes()).toContain(
      'app-main__content--fade-slide-up',
    );
  });
});
