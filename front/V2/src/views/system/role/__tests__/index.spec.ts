import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/modules/auth';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import type { BackendMenuItem } from '@/types/menu';
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

const treeState = vi.hoisted(() => ({
  checkedKeys: ['system-root', 'system-role'],
}));

const treeStub = {
  name: 'ElTree',
  props: ['data', 'nodeKey'],
  methods: {
    setCheckedKeys(keys: string[]) {
      treeState.checkedKeys = [...keys];
    },
    getCheckedKeys() {
      return [...treeState.checkedKeys];
    },
    getHalfCheckedKeys() {
      return [];
    },
  },
  template: '<div class="tree-stub">{{ JSON.stringify(data) }}</div>',
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
      'system:role:auth',
    ],
  };

  return mount(RoleManagementPage, {
    attachTo: document.body,
    global: {
      plugins: [ElementPlus, pinia, i18n],
      stubs: {
        ElDialog: dialogStub,
        ElTree: treeStub,
        teleport: true,
      },
    },
  });
}

describe('system role page', () => {
  beforeEach(() => {
    treeState.checkedKeys = ['system-root', 'system-role'];
    vi.clearAllMocks();
    setI18nLanguage('zh-CN');
  });

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
    expect(wrapper.text()).toContain('编辑');
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

  it('submits role permissions and shows success feedback', async () => {
    vi.spyOn(ElMessage, 'success').mockImplementation(vi.fn());

    const wrapper = mountPage();
    await waitForPage(wrapper);

    const permissionButton = wrapper
      .findAll('button')
      .find((item) => item.text().includes('分配权限'));

    expect(permissionButton).toBeTruthy();
    await permissionButton!.trigger('click');
    await waitForPage(wrapper);

    treeState.checkedKeys = ['system-root', 'system-role', 'demo-root', 'demo-crud'];

    const saveButton = wrapper.findAll('button').find((item) => item.text().includes('保存权限'));
    expect(saveButton).toBeTruthy();
    await saveButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateSystemRoleMenusApi).toHaveBeenCalledWith('admin', {
      menuIds: ['system-root', 'system-role', 'demo-root', 'demo-crud'],
    });
    expect(ElMessage.success).toHaveBeenCalledWith('角色权限保存成功');
  });

  it('submits the opened role id instead of depending on outer mutable state', async () => {
    vi.spyOn(ElMessage, 'success').mockImplementation(vi.fn());

    const wrapper = mountPage();
    await waitForPage(wrapper);

    const permissionButtons = wrapper
      .findAll('button')
      .filter((item) => item.text().includes('分配权限'));
    expect(permissionButtons.length).toBeGreaterThan(1);

    await permissionButtons[1].trigger('click');
    await waitForPage(wrapper);

    treeState.checkedKeys = ['system-root', 'system-role'];
    const saveButton = wrapper.findAll('button').find((item) => item.text().includes('保存权限'));
    expect(saveButton).toBeTruthy();
    await saveButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateSystemRoleMenusApi).toHaveBeenCalledWith('editor', {
      menuIds: ['system-root', 'system-role'],
    });
  });

  it('submits page permission without forcing child button permissions', async () => {
    vi.spyOn(ElMessage, 'success').mockImplementation(vi.fn());

    const pageOnlyMenuTree: BackendMenuItem[] = [
      {
        id: 'demo-root',
        parentId: null,
        name: '业务示例',
        path: '/demo',
        component: 'ParentView',
        icon: 'Grid',
        type: 'directory',
        permission: '',
        status: 1,
        children: [
          {
            id: 'demo-business-template',
            parentId: 'demo-root',
            name: '标准业务模板',
            path: '/demo/business-template',
            component: 'demo/business-template/index',
            icon: 'Files',
            type: 'menu',
            permission: 'demo:business-template:view',
            status: 1,
            children: [
              {
                id: 'demo-business-template-delete',
                parentId: 'demo-business-template',
                name: '删除',
                path: '',
                component: '',
                icon: 'Document',
                type: 'button',
                permission: 'demo:business-template:delete',
                status: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    apiMocks.getSystemMenusApi.mockResolvedValueOnce({
      total: 1,
      list: pageOnlyMenuTree,
    } as any);

    const wrapper = mountPage();
    await waitForPage(wrapper);

    const permissionButtons = wrapper
      .findAll('button')
      .filter((item) => item.text().includes('分配权限'));
    await permissionButtons[1].trigger('click');
    await waitForPage(wrapper);

    treeState.checkedKeys = ['demo-business-template'];

    const saveButton = wrapper.findAll('button').find((item) => item.text().includes('保存权限'));
    expect(saveButton).toBeTruthy();
    await saveButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateSystemRoleMenusApi).toHaveBeenCalledWith('editor', {
      menuIds: ['demo-business-template', 'demo-root'],
    });
  });

  it('renders English copy for the role page and permission dialog', async () => {
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
        'system:role:view',
        'system:role:create',
        'system:role:edit',
        'system:role:delete',
        'system:role:auth',
      ],
    };

    const wrapper = mount(RoleManagementPage, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus, pinia, i18n],
        stubs: {
          ElDialog: dialogStub,
          ElTree: treeStub,
          teleport: true,
        },
      },
    });

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('Role Management');
    expect(wrapper.text()).toContain('Create Role');
    expect(wrapper.text()).toContain('Role Name');
    expect(wrapper.text()).toContain('Assign Permissions');

    const permissionButton = wrapper
      .findAll('button')
      .find((item) => item.text().includes('Assign Permissions'));

    expect(permissionButton).toBeTruthy();
    await permissionButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('Assign Role Permissions');
    expect(wrapper.text()).toContain('Save Permissions');
  });
});
