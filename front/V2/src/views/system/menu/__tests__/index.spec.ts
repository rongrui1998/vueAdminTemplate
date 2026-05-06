import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { useAuthStore } from '@/store/modules/auth';
import MenuManagementPage from '@/views/system/menu/index.vue';

const apiMocks = vi.hoisted(() => ({
  createSystemMenuApi: vi.fn(async () => true),
  deleteSystemMenuApi: vi.fn(async () => true),
  getSystemMenusApi: vi.fn(async () => ({
    total: 1,
    list: [
      {
        id: 'system-root',
        parentId: null,
        name: '系统管理',
        path: '/system',
        component: 'ParentView',
        icon: 'Setting',
        type: 'directory',
        permission: '',
        hidden: false,
        status: 1,
        children: [
          {
            id: 'system-menu',
            parentId: 'system-root',
            name: '菜单管理',
            path: '/system/menu',
            component: 'system/menu/index',
            icon: 'Menu',
            type: 'menu',
            permission: 'system:menu:view',
            hidden: false,
            status: 1,
            children: [
              {
                id: 'system-menu-create',
                parentId: 'system-menu',
                name: '新增',
                path: '',
                component: '',
                type: 'button',
                permission: 'system:menu:create',
                hidden: false,
                status: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  })),
  updateSystemMenuApi: vi.fn(async () => true),
}));

vi.mock('@/api/system-menu', () => ({
  createSystemMenuApi: apiMocks.createSystemMenuApi,
  deleteSystemMenuApi: apiMocks.deleteSystemMenuApi,
  getSystemMenusApi: apiMocks.getSystemMenusApi,
  updateSystemMenuApi: apiMocks.updateSystemMenuApi,
}));

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

const dialogStub = {
  props: ['modelValue', 'title'],
  template:
    '<section v-if="modelValue"><header>{{ title }}</header><slot /><slot name="footer" /></section>',
};

describe('system menu page', () => {
  beforeEach(() => {
    setI18nLanguage('zh-CN');
  });

  it('renders a real management toolbar and tree table', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [
        'system:menu:view',
        'system:menu:create',
        'system:menu:edit',
        'system:menu:delete',
      ],
    };

    const wrapper = mount(MenuManagementPage, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDialog: dialogStub,
          teleport: true,
        },
      },
    });

    await waitForPage(wrapper);

    expect(apiMocks.getSystemMenusApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('菜单管理');
    expect(wrapper.text()).toContain('新增菜单');
    expect(wrapper.text()).toContain('菜单名称');
    expect(wrapper.text()).toContain('类型');
    expect(wrapper.text()).toContain('排序');
    expect(wrapper.text()).toContain('权限标识');
    expect(wrapper.text()).toContain('路由地址');
    expect(wrapper.text()).toContain('页面组件');
    expect(wrapper.text()).toContain('状态');
    expect(wrapper.text()).toContain('操作');
    expect(wrapper.text()).toContain('新增下级');
    expect(wrapper.text()).toContain('编辑');
    expect(wrapper.text()).toContain('删除');
    expect(wrapper.text()).toContain('系统管理');
    expect(wrapper.find('.menu-page__expand-trigger').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('system:menu:view');
    await wrapper.find('.menu-page__expand-trigger').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('菜单管理');
    expect(wrapper.find('.menu-page__name-indent').attributes('style')).toContain('width: 32px');
    expect(wrapper.find('.el-table__expand-icon').exists()).toBe(false);
  });

  it('opens the create dialog from the toolbar', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [
        'system:menu:view',
        'system:menu:create',
        'system:menu:edit',
        'system:menu:delete',
      ],
    };

    const wrapper = mount(MenuManagementPage, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDialog: dialogStub,
          teleport: true,
        },
      },
    });

    await waitForPage(wrapper);

    const createButton = wrapper.findAll('button').find((item) => item.text().includes('新增菜单'));

    expect(createButton).toBeTruthy();
    await createButton!.trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('新增菜单');
    expect(wrapper.text()).toContain('菜单类型');
    expect(wrapper.text()).toContain('菜单标题');
    expect(wrapper.text()).toContain('英文名称');
  });

  it('renders English copy for the menu page and dialog', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    setI18nLanguage('en-US');

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: 'System Admin',
      avatar: '',
      roles: ['admin'],
      permissions: [
        'system:menu:view',
        'system:menu:create',
        'system:menu:edit',
        'system:menu:delete',
      ],
    };

    const wrapper = mount(MenuManagementPage, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDialog: dialogStub,
          teleport: true,
        },
      },
    });

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('Menu Management');
    expect(wrapper.text()).toContain('Create Menu');
    expect(wrapper.text()).toContain('Menu Name');
    expect(wrapper.text()).toContain('Route Path');

    const createButton = wrapper
      .findAll('button')
      .find((item) => item.text().includes('Create Menu'));
    expect(createButton).toBeTruthy();
    await createButton!.trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Create Menu');
    expect(wrapper.text()).toContain('Menu Type');
    expect(wrapper.text()).toContain('English Name');
  });
});
