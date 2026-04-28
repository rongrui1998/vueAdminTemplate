import type { ApiListData } from '@/types/api';
import type {
  SystemUserPasswordPayload,
  SystemUserPayload,
  SystemUserQuery,
  SystemUserRecord,
} from '@/types/system-user';
import { request } from '@/utils/request';

export function getSystemUsersApi(params: SystemUserQuery = {}) {
  return request<ApiListData<SystemUserRecord>>({
    url: '/system/users',
    method: 'get',
    params,
  });
}

export function createSystemUserApi(data: SystemUserPayload) {
  return request<boolean>({
    url: '/system/users',
    method: 'post',
    data,
  });
}

export function updateSystemUserApi(id: string, data: SystemUserPayload) {
  return request<boolean>({
    url: `/system/users/${id}`,
    method: 'put',
    data,
  });
}

export function deleteSystemUserApi(id: string) {
  return request<boolean>({
    url: `/system/users/${id}`,
    method: 'delete',
  });
}

export function resetSystemUserPasswordApi(id: string, data: SystemUserPasswordPayload) {
  return request<boolean>({
    url: `/system/users/${id}/password`,
    method: 'put',
    data,
  });
}
