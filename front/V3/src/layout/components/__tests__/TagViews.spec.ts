import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TagViews from '@/layout/components/TagViews.vue';
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
  props: ['closable', 'effect'],
  emits: ['click', 'close', 'contextmenu'],
  template: `
    <div class="tag-stub" @click="$emit('click')" @contextmenu.prevent="$emit('contextmenu', $event)">
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
});
