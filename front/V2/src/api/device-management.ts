import type { ApiListData } from '@/types/api';
import type {
  DeviceCreatePayload,
  DeviceListQuery,
  DeviceRecord,
  DeviceUpdatePayload,
} from '@/types/device-management';
import { request } from '@/utils/request';

export function getDeviceListApi(data: DeviceListQuery) {
  return request<ApiListData<DeviceRecord>>({
    url: '/device/list',
    method: 'post',
    data,
  });
}

export function createDeviceApi(data: DeviceCreatePayload) {
  return request<DeviceRecord>({
    url: '/device/add',
    method: 'post',
    data,
  });
}

export function updateDeviceApi(id: string, data: DeviceUpdatePayload) {
  return request<DeviceRecord>({
    url: '/device/update',
    method: 'post',
    data: {
      id,
      ...data,
    },
  });
}

export function deleteDeviceApi(id: string) {
  return request<boolean>({
    url: '/device/delete',
    method: 'delete',
    params: {
      id,
    },
  });
}

export function updateDeviceStatusApi(id: string, status: number) {
  return request<DeviceRecord>({
    url: '/device/status',
    method: 'post',
    data: {
      id,
      status,
    },
  });
}
