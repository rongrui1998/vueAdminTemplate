import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { permissionDirective } from '@/directives/permission';
import { useAuthStore } from '@/store/modules/auth';
import BusinessTemplatePage from '@/views/demo/business-template/index.vue';

const apiMocks = vi.hoisted(() => ({
  createBusinessTemplateApi: vi.fn(async () => ({
    id: 'tpl-new',
    name: '合同模板维护',
    owner: '法务中台',
    scene: '合同管理',
    status: 1,
    updatedAt: '2026-04-29 13:00:00',
    remark: '接口创建',
  })),
  deleteBusinessTemplateApi: vi.fn(async () => true),
  getBusinessTemplateDetailApi: vi.fn(async () => ({
    id: 'tpl-1',
    name: '客户资料维护',
    owner: '业务中台',
    scene: '基础资料',
    status: 1,
    updatedAt: '2026-04-29 09:30:00',
    remark: '详情接口返回',
  })),
  getBusinessTemplatesApi: vi.fn(async () => ({
    total: 1,
    list: [
      {
        id: 'tpl-1',
        name: '客户资料维护',
        owner: '业务中台',
        scene: '基础资料',
        status: 1,
        updatedAt: '2026-04-29 09:30:00',
        remark: '适合客户、供应商、项目档案等列表页复制使用',
      },
    ],
  })),
  updateBusinessTemplateApi: vi.fn(async (_id: string, data: Record<string, unknown>) => ({
    id: 'tpl-1',
    name: '客户资料维护',
    owner: '业务中台',
    scene: '基础资料',
    status: data.status,
    updatedAt: '2026-04-29 13:10:00',
    remark: '更新接口返回',
  })),
}));

const confirmMocks = vi.hoisted(() => ({
  confirmDelete: vi.fn(async () => true),
}));

vi.mock('@/api/business-template', () => ({
  createBusinessTemplateApi: apiMocks.createBusinessTemplateApi,
  deleteBusinessTemplateApi: apiMocks.deleteBusinessTemplateApi,
  getBusinessTemplateDetailApi: apiMocks.getBusinessTemplateDetailApi,
  getBusinessTemplatesApi: apiMocks.getBusinessTemplatesApi,
  updateBusinessTemplateApi: apiMocks.updateBusinessTemplateApi,
}));

vi.mock('@/utils/confirm', () => ({
  confirmDelete: confirmMocks.confirmDelete,
}));

const modalStub = {
  props: ['visible', 'title'],
  emits: ['confirm', 'update:visible'],
  template:
    '<section v-if="visible"><h2>{{ title }}</h2><slot /><button class="modal-confirm" @click="$emit(\'confirm\')">confirm</button></section>',
};

const drawerStub = {
  props: ['visible', 'title'],
  template: '<section v-if="visible"><h2>{{ title }}</h2><slot /></section>',
};

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

function mountPage(
  permissions: string[] = [
    'demo:business-template:create',
    'demo:business-template:edit',
    'demo:business-template:status',
    'demo:business-template:delete',
  ],
) {
  const pinia = createPinia();
  setActivePinia(pinia);

  const authStore = useAuthStore();
  authStore.userInfoLoaded = true;
  authStore.userInfo = {
    id: 'u-test',
    username: 'rongrui',
    nickname: '荣睿',
    avatar: '',
    roles: ['customer'],
    permissions,
  };

  return mount(BusinessTemplatePage, {
    attachTo: document.body,
    global: {
      plugins: [ElementPlus, pinia, i18n],
      stubs: {
        DrawerForm: drawerStub,
        ModalForm: modalStub,
        teleport: true,
      },
      directives: {
        permission: permissionDirective,
      },
    },
  });
}

describe('business template page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setI18nLanguage('zh-CN');
  });

  it('loads list from api and updates row status through api', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(apiMocks.getBusinessTemplatesApi).toHaveBeenCalled();
    expect(wrapper.text()).toContain('客户资料维护');

    const disableButton = wrapper.findAll('button').find((item) => item.text().includes('停用'));
    expect(disableButton).toBeTruthy();
    await disableButton!.trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateBusinessTemplateApi).toHaveBeenCalledWith(
      'tpl-1',
      expect.objectContaining({
        status: 0,
      }),
    );
  });

  it('opens edit dialog and submits row updates through api', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const editButton = wrapper.findAll('button').find((item) => item.text().includes('编辑'));
    expect(editButton).toBeTruthy();
    await editButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('编辑业务示例');
    await wrapper.find('.modal-confirm').trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateBusinessTemplateApi).toHaveBeenCalledWith(
      'tpl-1',
      expect.objectContaining({
        name: '客户资料维护',
        owner: '业务中台',
        scene: '基础资料',
        status: 1,
        remark: '适合客户、供应商、项目档案等列表页复制使用',
      }),
    );
  });

  it('confirms and deletes a business template through api', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const deleteButton = wrapper.findAll('button').find((item) => item.text().includes('删除'));
    expect(deleteButton).toBeTruthy();
    await deleteButton!.trigger('click');
    await waitForPage(wrapper);

    expect(confirmMocks.confirmDelete).toHaveBeenCalledWith('确认删除“客户资料维护”吗？');
    expect(apiMocks.deleteBusinessTemplateApi).toHaveBeenCalledWith('tpl-1');
    expect(apiMocks.getBusinessTemplatesApi).toHaveBeenCalledTimes(2);
  });

  it('hides the delete action when the account lacks delete permission', async () => {
    const wrapper = mountPage(['demo:business-template:view']);

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('详情');
    expect(wrapper.text()).not.toContain('编辑');
    expect(wrapper.text()).not.toContain('停用');
    expect(wrapper.text()).not.toContain('新增业务');
    expect(wrapper.text()).not.toContain('删除');
  });

  it('shows edit and status actions only when the account has matching permissions', async () => {
    const wrapper = mountPage([
      'demo:business-template:view',
      'demo:business-template:edit',
      'demo:business-template:status',
    ]);

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('编辑');
    expect(wrapper.text()).toContain('停用');
    expect(wrapper.text()).not.toContain('新增业务');
    expect(wrapper.text()).not.toContain('删除');
  });
});
