import type { ApiListData } from '@/types/api';
import type { DemoUserForm, DemoUserItem, DemoUserQuery } from '@/types/demo';
import { request } from '@/utils/request';

export function getDemoUsersApi(params: DemoUserQuery) {
  return request<ApiListData<DemoUserItem>>({
    url: '/demo/users',
    method: 'get',
    params,
  });
}

export function getDemoUserDetailApi(id: string) {
  return request<DemoUserItem>({
    url: `/demo/users/${id}`,
    method: 'get',
  });
}

export function createDemoUserApi(data: DemoUserForm) {
  return request<DemoUserItem>({
    url: '/demo/users',
    method: 'post',
    data,
  });
}

export function updateDemoUserApi(id: string, data: DemoUserForm) {
  return request<DemoUserItem>({
    url: `/demo/users/${id}`,
    method: 'put',
    data,
  });
}

export function deleteDemoUserApi(id: string) {
  return request<boolean>({
    url: `/demo/users/${id}`,
    method: 'delete',
  });
}
