import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import SidebarMenu from '@/layout/components/SidebarMenu.vue';
import { useAppStore } from '@/store/modules/app';
import type { AppMenuItem } from '@/types/menu';

function createMenu(): AppMenuItem {
  return {
    id: 'demo-root',
    parentId: null,
    name: '业务示例',
    nameEn: 'Examples',
    path: 'demo',
    fullPath: '/demo',
    routeName: 'route_demo-root',
    component: 'ParentView',
    icon: 'Grid',
    type: 'directory',
    children: [
      {
        id: 'demo-crud',
        parentId: 'demo-root',
        name: 'CRUD 示例',
        nameEn: 'CRUD Example',
        path: 'crud',
        fullPath: '/demo/crud',
        routeName: 'route_demo-crud',
        component: 'demo/crud/index',
        icon: 'Tickets',
        type: 'menu',
        children: [],
      },
    ],
  };
}

describe('SidebarMenu', () => {
  it('keeps a directory as submenu even when it has only one visible child', () => {
    setActivePinia(createPinia());

    const wrapper = mount(
      {
        components: { SidebarMenu },
        template: '<el-menu><SidebarMenu :menu="menu" /></el-menu>',
        props: {
          menu: {
            type: Object,
            required: true,
          },
        },
      },
      {
        props: {
          menu: createMenu(),
        },
        global: {
          plugins: [ElementPlus],
          stubs: {
            AppIcon: true,
          },
        },
      },
    );

    expect(wrapper.text()).toContain('业务示例');
    expect(wrapper.text()).toContain('CRUD 示例');
    expect(wrapper.find('.el-sub-menu').exists()).toBe(true);
  });

  it('renders english menu labels when the current language is english', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');

    const wrapper = mount(
      {
        components: { SidebarMenu },
        template: '<el-menu><SidebarMenu :menu="menu" /></el-menu>',
        props: {
          menu: {
            type: Object,
            required: true,
          },
        },
      },
      {
        props: {
          menu: createMenu(),
        },
        global: {
          plugins: [ElementPlus, pinia],
          stubs: {
            AppIcon: true,
          },
        },
      },
    );

    expect(wrapper.text()).toContain('Examples');
    expect(wrapper.text()).toContain('CRUD Example');
  });
});
