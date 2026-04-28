import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import UserManagementPage from '@/views/system/user/index.vue';

const apiMocks = vi.hoisted(() => ({
  createSystemUserApi: vi.fn(async () => true),
  deleteSystemUserApi: vi.fn(async () => true),
  getSystemRolesApi: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'admin',
        code: 'admin',
        name: '系统管理员',
        sort: 1,
        status: 1,
        permissions: [],
        menuIds: [],
        userCount: 1,
        createdAt: '2026-04-27 10:00:00',
        remark: '',
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
        remark: '',
      },
    ],
  })),
  getSystemUsersApi: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'u-1',
        username: 'admin',
        nickname: '系统管理员',
        roleIds: ['admin'],
        roleNames: ['系统管理员'],
        status: 1,
        lastLoginAt: '2026-04-28 09:00:00',
        createdAt: '2026-04-27 10:00:00',
        remark: '内置管理员',
      },
      {
        id: 'u-2',
        username: 'editor',
        nickname: '运营编辑',
        roleIds: ['editor'],
        roleNames: ['运营编辑'],
        status: 1,
        lastLoginAt: '2026-04-28 09:10:00',
        createdAt: '2026-04-27 10:00:00',
        remark: '运营账号',
      },
    ],
  })),
  resetSystemUserPasswordApi: vi.fn(async () => true),
  updateSystemUserApi: vi.fn(async () => true),
}));

vi.mock('@/api/system-user', () => ({
  createSystemUserApi: apiMocks.createSystemUserApi,
  deleteSystemUserApi: apiMocks.deleteSystemUserApi,
  getSystemUsersApi: apiMocks.getSystemUsersApi,
  resetSystemUserPasswordApi: apiMocks.resetSystemUserPasswordApi,
  updateSystemUserApi: apiMocks.updateSystemUserApi,
}));

vi.mock('@/api/system-role', () => ({
  getSystemRolesApi: apiMocks.getSystemRolesApi,
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
      'system:user:view',
      'system:user:create',
      'system:user:edit',
      'system:user:delete',
      'system:user:reset',
    ],
  };

  return mount(UserManagementPage, {
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

describe('system user page', () => {
  it('renders user table and management actions', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(apiMocks.getSystemUsersApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('用户管理');
    expect(wrapper.text()).toContain('新增用户');
    expect(wrapper.text()).toContain('登录账号');
    expect(wrapper.text()).toContain('用户昵称');
    expect(wrapper.text()).toContain('绑定角色');
    expect(wrapper.text()).toContain('系统管理员');
    expect(wrapper.text()).toContain('运营编辑');
    expect(wrapper.text()).toContain('重置密码');
    expect(wrapper.text()).toContain('修改');
    expect(wrapper.text()).toContain('删除');
  });

  it('opens create dialog with role options', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const createButton = wrapper.findAll('button').find((item) => item.text().includes('新增用户'));

    expect(createButton).toBeTruthy();
    await createButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.getSystemRolesApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('新增用户');
    expect(wrapper.text()).toContain('登录账号');
    expect(wrapper.text()).toContain('绑定角色');
  });
});
