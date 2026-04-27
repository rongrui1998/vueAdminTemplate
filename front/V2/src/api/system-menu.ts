import type { ApiListData } from '@/types/api';
import type { SystemMenuPayload, SystemMenuQuery, SystemMenuRecord } from '@/types/system-menu';
import { request } from '@/utils/request';

export function getSystemMenusApi(params: SystemMenuQuery = {}) {
  return request<ApiListData<SystemMenuRecord>>({
    url: '/system/menus',
    method: 'get',
    params,
  });
}

export function createSystemMenuApi(data: SystemMenuPayload) {
  return request<boolean>({
    url: '/system/menus',
    method: 'post',
    data,
  });
}

export function updateSystemMenuApi(id: string, data: SystemMenuPayload) {
  return request<boolean>({
    url: `/system/menus/${id}`,
    method: 'put',
    data,
  });
}

export function deleteSystemMenuApi(id: string) {
  return request<boolean>({
    url: `/system/menus/${id}`,
    method: 'delete',
  });
}
