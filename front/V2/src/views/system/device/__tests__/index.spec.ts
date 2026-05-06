import { mount } from '@vue/test-utils';
import ElementPlus, { ElMessage } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { permissionDirective } from '@/directives/permission';
import { useAuthStore } from '@/store/modules/auth';
import DeviceManagementPage from '@/views/system/device/index.vue';

const apiMocks = vi.hoisted(() => ({
  createDeviceApi: vi.fn(async () => true),
  deleteDeviceApi: vi.fn(async () => true),
  getDevicesApi: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'device-1',
        deviceId: 'dev-001',
        deviceName: '前门摄像头',
        deviceType: 'camera',
        status: 1,
        createdBy: 'admin',
        createdAt: '2026-05-01 09:00:00',
        updatedBy: 'admin',
        updatedAt: '2026-05-02 10:00:00',
      },
      {
        id: 'device-2',
        deviceId: 'dev-002',
        deviceName: '后门门禁',
        deviceType: 'access-control',
        status: 0,
        createdBy: 'ops',
        createdAt: '2026-05-03 09:00:00',
        updatedBy: 'ops',
        updatedAt: '2026-05-04 10:00:00',
      },
    ],
  })),
  updateDeviceApi: vi.fn(async () => true),
  updateDeviceStatusApi: vi.fn(async () => true),
}));

const confirmMocks = vi.hoisted(() => ({
  confirmDelete: vi.fn(async () => true),
}));

vi.mock('@/api/device', () => ({
  createDeviceApi: apiMocks.createDeviceApi,
  deleteDeviceApi: apiMocks.deleteDeviceApi,
  getDevicesApi: apiMocks.getDevicesApi,
  updateDeviceApi: apiMocks.updateDeviceApi,
  updateDeviceStatusApi: apiMocks.updateDeviceStatusApi,
}));

vi.mock('@/utils/confirm', () => ({
  confirmDelete: confirmMocks.confirmDelete,
}));

const modalStub = {
  props: ['visible', 'title'],
  emits: ['confirm', 'update:visible', 'submit'],
  template:
    "<section v-if=\"visible\"><h2>{{ title }}</h2><slot /><button class=\"dialog-submit\" @click=\"$emit('submit', { deviceId: 'dev-009', deviceName: '测试设备', deviceType: 'sensor' })\">submit</button></section>",
};

const drawerStub = {
  props: ['visible', 'title', 'record'],
  template:
    '<section v-if="visible"><h2>设备详情</h2><div class="drawer-device-name">{{ record?.deviceName }}</div></section>',
};

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

function mountPage(
  permissions: string[] = [
    'system:device:view',
    'system:device:create',
    'system:device:edit',
    'system:device:delete',
    'system:device:detail',
    'system:device:status',
  ],
) {
  const pinia = createPinia();
  setActivePinia(pinia);

  const authStore = useAuthStore();
  authStore.userInfoLoaded = true;
  authStore.userInfo = {
    id: 'u-1',
    username: 'operator',
    nickname: '设备管理员',
    avatar: '',
    roles: ['operator'],
    permissions,
  };

  return mount(DeviceManagementPage, {
    attachTo: document.body,
    global: {
      plugins: [ElementPlus, pinia, i18n],
      stubs: {
        DeviceFormDialog: modalStub,
        DeviceDetailDrawer: drawerStub,
        teleport: true,
      },
      directives: {
        permission: permissionDirective,
      },
    },
  });
}

describe('system device page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setI18nLanguage('zh-CN');
  });

  it('renders device table, search fields, and permission actions', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    expect(apiMocks.getDevicesApi).toHaveBeenCalledWith({
      keyword: '',
      status: '',
      startTime: '',
      endTime: '',
      pageNum: 1,
      pageSize: 10,
    });
    expect(wrapper.text()).toContain('设备管理');
    expect(wrapper.text()).toContain('新增设备');
    expect(wrapper.text()).toContain('设备编号');
    expect(wrapper.text()).toContain('设备名称');
    expect(wrapper.text()).toContain('设备类型');
    expect(wrapper.text()).toContain('前门摄像头');
    expect(wrapper.text()).toContain('后门门禁');
    expect(wrapper.text()).toContain('详情');
    expect(wrapper.text()).toContain('编辑');
    expect(wrapper.text()).toContain('删除');
  });

  it('opens create dialog and submits a new device', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const createButton = wrapper.findAll('button').find((item) => item.text().includes('新增设备'));

    expect(createButton).toBeTruthy();
    await createButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('新增设备');
    await wrapper.find('.dialog-submit').trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.createDeviceApi).toHaveBeenCalledWith({
      deviceId: 'dev-009',
      deviceName: '测试设备',
      deviceType: 'sensor',
    });
  });

  it('opens detail drawer with selected device row', async () => {
    const wrapper = mountPage();

    await waitForPage(wrapper);

    const detailButton = wrapper.findAll('button').find((item) => item.text().includes('详情'));

    expect(detailButton).toBeTruthy();
    await detailButton!.trigger('click');
    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('设备详情');
    expect(wrapper.find('.drawer-device-name').text()).toContain('前门摄像头');
  });

  it('updates row status through status api', async () => {
    vi.spyOn(ElMessage, 'success').mockImplementation(vi.fn());

    const wrapper = mountPage();
    await waitForPage(wrapper);

    const switches = wrapper.findAllComponents({ name: 'ElSwitch' });
    expect(switches.length).toBeGreaterThan(0);

    await switches[0].vm.$emit('change', 0);
    await waitForPage(wrapper);

    expect(apiMocks.updateDeviceStatusApi).toHaveBeenCalledWith({
      id: 'device-1',
      status: 0,
    });
    expect(ElMessage.success).toHaveBeenCalled();
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
  });

  it('hides high-risk and write actions when permissions are missing', async () => {
    const wrapper = mountPage(['system:device:view', 'system:device:detail']);

    await waitForPage(wrapper);

    expect(wrapper.text()).toContain('详情');
    expect(wrapper.text()).not.toContain('新增设备');
    expect(wrapper.text()).not.toContain('编辑');
    expect(wrapper.text()).not.toContain('删除');
  });
});
