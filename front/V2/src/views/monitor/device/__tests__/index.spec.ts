import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { permissionDirective } from '@/directives/permission';
import { useAuthStore } from '@/store/modules/auth';
import DeviceManagementPage from '@/views/monitor/device/index.vue';

const apiMocks = vi.hoisted(() => ({
  createDeviceApi: vi.fn(async () => ({
    id: 'device-new',
    deviceId: 'DV-20001',
    deviceName: '新增摄像头',
    deviceType: '摄像头',
    status: 1,
    createdBy: 'system',
    createdAt: '2026-05-07 10:00:00',
    updatedBy: 'system',
    updatedAt: '2026-05-07 10:00:00',
  })),
  deleteDeviceApi: vi.fn(async () => true),
  getDeviceListApi: vi.fn(async () => ({
    total: 1,
    list: [
      {
        id: 'device-1',
        deviceId: 'DV-10001',
        deviceName: '前门摄像头',
        deviceType: '摄像头',
        status: 1,
        createdBy: 'admin',
        createdAt: '2026-05-01 09:00:00',
        updatedBy: 'admin',
        updatedAt: '2026-05-06 18:30:00',
      },
    ],
  })),
  updateDeviceApi: vi.fn(async (_id: string, data: Record<string, unknown>) => ({
    id: 'device-1',
    deviceId: 'DV-10001',
    deviceName: data.deviceName,
    deviceType: data.deviceType,
    status: 1,
    createdBy: 'admin',
    createdAt: '2026-05-01 09:00:00',
    updatedBy: 'admin',
    updatedAt: '2026-05-07 11:00:00',
  })),
  updateDeviceStatusApi: vi.fn(async (_id: string, status: number) => ({
    id: 'device-1',
    deviceId: 'DV-10001',
    deviceName: '前门摄像头',
    deviceType: '摄像头',
    status,
    createdBy: 'admin',
    createdAt: '2026-05-01 09:00:00',
    updatedBy: 'admin',
    updatedAt: '2026-05-07 11:00:00',
  })),
}));

const confirmMocks = vi.hoisted(() => ({
  confirmDelete: vi.fn(async () => true),
}));

vi.mock('@/api/device-management', () => ({
  createDeviceApi: apiMocks.createDeviceApi,
  deleteDeviceApi: apiMocks.deleteDeviceApi,
  getDeviceListApi: apiMocks.getDeviceListApi,
  updateDeviceApi: apiMocks.updateDeviceApi,
  updateDeviceStatusApi: apiMocks.updateDeviceStatusApi,
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
    'monitor:device:view',
    'monitor:device:create',
    'monitor:device:detail',
    'monitor:device:edit',
    'monitor:device:status',
    'monitor:device:delete',
  ],
) {
  const pinia = createPinia();
  setActivePinia(pinia);

  const authStore = useAuthStore();
  authStore.userInfoLoaded = true;
  authStore.userInfo = {
    id: 'u-test',
    username: 'admin',
    nickname: '管理员',
    avatar: '',
    roles: ['operator'],
    permissions,
  };

  return mount(DeviceManagementPage, {
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

describe('device management page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setI18nLanguage('zh-CN');
  });

  it('loads devices with default pagination and updates status through api', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(apiMocks.getDeviceListApi).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNum: 1,
        pageSize: 10,
      }),
    );
    expect(wrapper.text()).toContain('前门摄像头');

    const switchInput = wrapper.find('.el-switch input');
    expect(switchInput.exists()).toBe(true);
    await switchInput.setValue(false);
    await waitForPage(wrapper);

    expect(apiMocks.updateDeviceStatusApi).toHaveBeenCalledWith('device-1', 0);
  });

  it('opens edit dialog and submits update payload without device id', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const editButton = wrapper.findAll('button').find((item) => item.text().includes('编辑'));
    expect(editButton).toBeTruthy();
    await editButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('编辑设备');
    await wrapper.find('.modal-confirm').trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.updateDeviceApi).toHaveBeenCalledWith('device-1', {
      deviceName: '前门摄像头',
      deviceType: '摄像头',
    });
  });

  it('confirms and deletes a device through api', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const deleteButton = wrapper.findAll('button').find((item) => item.text().includes('删除'));
    expect(deleteButton).toBeTruthy();
    await deleteButton!.trigger('click');
    await waitForPage(wrapper);

    expect(confirmMocks.confirmDelete).toHaveBeenCalledWith('确认删除“前门摄像头”吗？');
    expect(apiMocks.deleteDeviceApi).toHaveBeenCalledWith('device-1');
    expect(apiMocks.getDeviceListApi).toHaveBeenCalledTimes(2);
  });

  it('renders detail drawer from row data when detail permission is granted', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const detailButton = wrapper.findAll('button').find((item) => item.text().includes('详情'));
    expect(detailButton).toBeTruthy();
    await detailButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('设备详情');
    expect(wrapper.text()).toContain('DV-10001');
    expect(wrapper.text()).toContain('2026-05-06 18:30:00');
  });

  it('hides row actions when matching button permissions are missing', async () => {
    const wrapper = mountPage(['monitor:device:view']);

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('前门摄像头');
    expect(wrapper.text()).not.toContain('新增设备');
    expect(wrapper.text()).not.toContain('详情');
    expect(wrapper.text()).not.toContain('编辑');
    expect(wrapper.text()).not.toContain('删除');
    expect(wrapper.find('.el-switch').exists()).toBe(false);
  });

  it('renders English frontend copy from locale messages', async () => {
    setI18nLanguage('en-US');
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('Device Management');
    expect(wrapper.text()).toContain('Add Device');
    expect(wrapper.text()).toContain('Device Name');
  });
});
