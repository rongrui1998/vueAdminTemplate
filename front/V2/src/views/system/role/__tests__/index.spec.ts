import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import RoleManagementPage from '@/views/system/role/index.vue';

const apiMocks = vi.hoisted(() => ({
  createSystemRoleApi: vi.fn(async () => true),
  deleteSystemRoleApi: vi.fn(async () => true),
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
        status: 1,
        children: [
          {
            id: 'system-role',
            parentId: 'system-root',
            name: '角色管理',
            path: '/system/role',
            component: 'system/role/index',
            icon: 'UserFilled',
            type: 'menu',
            permission: 'system:role:view',
            status: 1,
            children: [],
          },
        ],
      },
    ],
  })),
  getSystemRolesApi: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'admin',
        code: 'admin',
        name: '系统管理员',
        sort: 1,
        status: 1,
        permissions: ['system:role:view'],
        menuIds: ['system-root', 'system-role'],
        userCount: 1,
        createdAt: '2026-04-27 10:00:00',
        remark: '最高权限角色',
      },
      {
        id: 'editor',
        code: 'editor',
        name: '运营编辑',
        sort: 2,
        status: 1,
        permissions: [],
        menuIds: [],
        userCount: 1,
        createdAt: '2026-04-27 10:00:00',
        remark: '运营内容角色',
      },
    ],
  })),
  updateSystemRoleApi: vi.fn(async () => true),
  updateSystemRoleMenusApi: vi.fn(async () => true),
}));

vi.mock('@/api/system-role', () => ({
  createSystemRoleApi: apiMocks.createSystemRoleApi,
  deleteSystemRoleApi: apiMocks.deleteSystemRoleApi,
  getSystemRolesApi: apiMocks.getSystemRolesApi,
  updateSystemRoleApi: apiMocks.updateSystemRoleApi,
  updateSystemRoleMenusApi: apiMocks.updateSystemRoleMenusApi,
}));

vi.mock('@/api/system-menu', () => ({
  getSystemMenusApi: apiMocks.getSystemMenusApi,
}));

const dialogStub = {
  props: ['modelValue', 'title'],
  template:
    '<section v-if="modelValue"><header>{{ title }}</header><slot /><slot name="footer" /></section>',
};

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

function mountPage() {
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
      'system:role:view',
      'system:role:create',
      'system:role:edit',
      'system:role:delete',
    ],
  };

  return mount(RoleManagementPage, {
    attachTo: document.body,
    global: {
      plugins: [ElementPlus, pinia],
      stubs: {
        ElDialog: dialogStub,
        teleport: true,
      },
    },
  });
}

describe('system role page', () => {
  it('renders role table and management actions', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(apiMocks.getSystemRolesApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('角色管理');
    expect(wrapper.text()).toContain('新增角色');
    expect(wrapper.text()).toContain('角色名称');
    expect(wrapper.text()).toContain('角色编码');
    expect(wrapper.text()).toContain('权限数量');
    expect(wrapper.text()).toContain('关联用户');
    expect(wrapper.text()).toContain('系统管理员');
    expect(wrapper.text()).toContain('运营编辑');
    expect(wrapper.text()).toContain('分配权限');
    expect(wrapper.text()).toContain('修改');
    expect(wrapper.text()).toContain('删除');
  });

  it('opens permission dialog with menu tree data', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const permissionButton = wrapper
      .findAll('button')
      .find((item) => item.text().includes('分配权限'));

    expect(permissionButton).toBeTruthy();
    await permissionButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.getSystemMenusApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('分配角色权限');
    expect(wrapper.text()).toContain('系统管理');
    expect(wrapper.text()).toContain('角色管理');
  });
});
