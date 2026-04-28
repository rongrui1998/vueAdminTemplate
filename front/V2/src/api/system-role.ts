import type { ApiListData } from '@/types/api';
import type {
  SystemRoleMenusPayload,
  SystemRolePayload,
  SystemRoleQuery,
  SystemRoleRecord,
} from '@/types/system-role';
import { request } from '@/utils/request';

export function getSystemRolesApi(params: SystemRoleQuery = {}) {
  return request<ApiListData<SystemRoleRecord>>({
    url: '/system/roles',
    method: 'get',
    params,
  });
}

export function createSystemRoleApi(data: SystemRolePayload) {
  return request<boolean>({
    url: '/system/roles',
    method: 'post',
    data,
  });
}

export function updateSystemRoleApi(id: string, data: SystemRolePayload) {
  return request<boolean>({
    url: `/system/roles/${id}`,
    method: 'put',
    data,
  });
}

export function deleteSystemRoleApi(id: string) {
  return request<boolean>({
    url: `/system/roles/${id}`,
    method: 'delete',
  });
}

export function updateSystemRoleMenusApi(id: string, data: SystemRoleMenusPayload) {
  return request<boolean>({
    url: `/system/roles/${id}/menus`,
    method: 'put',
    data,
  });
}
