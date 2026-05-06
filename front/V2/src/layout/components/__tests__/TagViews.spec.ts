import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TagViews from '@/layout/components/TagViews.vue';
import { useAppStore } from '@/store/modules/app';
import { useTabsStore } from '@/store/modules/tabs';

const routerPushMock = vi.fn();
const routerReplaceMock = vi.fn();

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    useRoute: () => ({
      fullPath: '/dashboard',
      path: '/dashboard',
      name: 'DashboardRoute',
      meta: {},
    }),
    useRouter: () => ({
      push: routerPushMock,
      replace: routerReplaceMock,
    }),
  };
});

const scrollbarStub = {
  template: '<div><slot /></div>',
};

const tagStub = {
  props: ['closable', 'effect', 'draggable'],
  emits: ['click', 'close', 'contextmenu', 'dragstart', 'dragover', 'drop', 'dragend'],
  template: `
    <div
      class="tag-stub"
      :draggable="draggable"
      @click="$emit('click')"
      @contextmenu.prevent="$emit('contextmenu', $event)"
      @dragstart="$emit('dragstart', $event)"
      @dragover="$emit('dragover', $event)"
      @drop="$emit('drop', $event)"
      @dragend="$emit('dragend')"
    >
      <span class="tag-stub__label"><slot /></span>
      <button v-if="closable" class="tag-stub__close" @click.stop="$emit('close')">x</button>
    </div>
  `,
};

describe('TagViews', () => {
  it('shows a disabled close-current action for affix tabs in the context menu', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const tabsStore = useTabsStore();
    tabsStore.visitedViews = [
      {
        title: '首页',
        path: '/dashboard',
        fullPath: '/dashboard',
        routeName: 'DashboardRoute',
        cacheKey: 'DashboardRoute',
        affix: true,
      },
      {
        title: '权限示例',
        path: '/demo/permission',
        fullPath: '/demo/permission',
        routeName: 'route_demo-permission',
        cacheKey: 'route_demo-permission',
        affix: false,
      },
    ];

    const wrapper = mount(TagViews, {
      global: {
        plugins: [pinia],
        stubs: {
          ElScrollbar: scrollbarStub,
          ElTag: tagStub,
          teleport: true,
        },
      },
    });

    await wrapper.findAll('.tag-stub')[0].trigger('contextmenu', {
      clientX: 48,
      clientY: 60,
    });
    await nextTick();

    const actions = wrapper.findAll('.tag-views__context-action');

    expect(actions).toHaveLength(4);
    expect(actions[1].attributes('disabled')).toBeDefined();

    wrapper.unmount();
  });

  it('renders chrome-style draggable tabs and reorders them on drop', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const tabsStore = useTabsStore();
    tabsStore.visitedViews = [
      {
        title: '首页',
        path: '/dashboard',
        fullPath: '/dashboard',
        routeName: 'DashboardRoute',
        affix: true,
      },
      {
        title: '菜单管理',
        path: '/system/menu',
        fullPath: '/system/menu',
        routeName: 'route_system-menu',
        affix: false,
      },
      {
        title: '评级模式',
        path: '/demo/rating',
        fullPath: '/demo/rating',
        routeName: 'route_demo-rating',
        affix: false,
      },
    ];

    const wrapper = mount(TagViews, {
      global: {
        plugins: [pinia],
        stubs: {
          ElScrollbar: scrollbarStub,
          ElTag: tagStub,
          teleport: true,
        },
      },
    });

    expect(wrapper.find('.tag-views__item').classes()).toContain('tag-views__item--segment');
    expect(wrapper.findAll('.tag-stub')[1].attributes('draggable')).toBe('true');

    await wrapper.findAll('.tag-stub')[2].trigger('dragstart');
    await wrapper.findAll('.tag-stub')[1].trigger('drop');

    expect(tabsStore.visitedViews.map((tab) => tab.fullPath)).toEqual([
      '/dashboard',
      '/demo/rating',
      '/system/menu',
    ]);

    wrapper.unmount();
  });

  it('renders english tab titles when the current language is english', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');

    const tabsStore = useTabsStore();
    tabsStore.visitedViews = [
      {
        title: '首页',
        titleEn: 'Dashboard',
        path: '/dashboard',
        fullPath: '/dashboard',
        routeName: 'DashboardRoute',
        affix: true,
      },
    ];

    const wrapper = mount(TagViews, {
      global: {
        plugins: [pinia],
        stubs: {
          ElScrollbar: scrollbarStub,
          ElTag: tagStub,
          teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Dashboard');
    expect(wrapper.text()).not.toContain('首页');
  });
});
