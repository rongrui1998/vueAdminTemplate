import type { ApiListData } from '@/types/api';
import type {
  DeviceCreatePayload,
  DeviceListQuery,
  DeviceRecord,
  DeviceStatusPayload,
  DeviceUpdatePayload,
} from '@/types/device';
import { request } from '@/utils/request';

export function getDevicesApi(data: DeviceListQuery) {
  return request<ApiListData<DeviceRecord>>({
    url: '/device/list',
    method: 'post',
    data,
  });
}

export function createDeviceApi(data: DeviceCreatePayload) {
  return request<boolean>({
    url: '/device/add',
    method: 'post',
    data,
  });
}

export function updateDeviceApi(data: DeviceUpdatePayload) {
  return request<boolean>({
    url: '/device/update',
    method: 'post',
    data,
  });
}

export function updateDeviceStatusApi(data: DeviceStatusPayload) {
  return request<boolean>({
    url: '/device/status',
    method: 'post',
    data,
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
