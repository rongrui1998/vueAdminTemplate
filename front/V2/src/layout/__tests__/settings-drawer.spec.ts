import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import AppLayout from '@/layout/index.vue';
import { useAppStore } from '@/store/modules/app';

vi.mock('@/layout/components/AppMain.vue', () => ({
  default: {
    template: '<main>AppMain</main>',
  },
}));

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
  it('opens global settings from a fixed right side button', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia],
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
    expect(wrapper.text()).toContain('布局密度');
    expect(wrapper.text()).toContain('页面缓存');
  });

  it('opens global settings when the app store requests it', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(AppLayout, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia],
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
