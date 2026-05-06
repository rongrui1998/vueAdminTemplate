import { request } from '@/utils/request';
import {
  createDeviceApi,
  deleteDeviceApi,
  getDevicesApi,
  updateDeviceApi,
  updateDeviceStatusApi,
} from '@/api/device';

vi.mock('@/utils/request', () => ({
  request: vi.fn(),
}));

describe('device api', () => {
  beforeEach(() => {
    vi.mocked(request).mockResolvedValue({});
  });

  it('sends device CRUD and status requests to the backend contract', async () => {
    await getDevicesApi({
      keyword: '摄像头',
      status: 1,
      startTime: '2026-05-01 00:00:00',
      endTime: '2026-05-06 23:59:59',
      pageNum: 1,
      pageSize: 10,
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/device/list',
      method: 'post',
      data: {
        keyword: '摄像头',
        status: 1,
        startTime: '2026-05-01 00:00:00',
        endTime: '2026-05-06 23:59:59',
        pageNum: 1,
        pageSize: 10,
      },
    });

    await createDeviceApi({
      deviceId: 'dev-001',
      deviceName: '前门摄像头',
      deviceType: 'camera',
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/device/add',
      method: 'post',
      data: {
        deviceId: 'dev-001',
        deviceName: '前门摄像头',
        deviceType: 'camera',
      },
    });

    await updateDeviceApi({
      id: 'row-1',
      deviceName: '前门摄像头A',
      deviceType: 'camera',
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/device/update',
      method: 'post',
      data: {
        id: 'row-1',
        deviceName: '前门摄像头A',
        deviceType: 'camera',
      },
    });

    await updateDeviceStatusApi({
      id: 'row-1',
      status: 0,
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/device/status',
      method: 'post',
      data: {
        id: 'row-1',
        status: 0,
      },
    });

    await deleteDeviceApi('row-1');
    expect(request).toHaveBeenLastCalledWith({
      url: '/device/delete',
      method: 'delete',
      params: {
        id: 'row-1',
      },
    });
  });
});
