import type { LoginParams, LoginResult } from '@/types/auth';
import { request } from '@/utils/request';

export function loginApi(data: LoginParams) {
  return request<LoginResult>({
    url: '/auth/login',
    method: 'post',
    data,
  });
}

export function logoutApi() {
  return request<boolean>({
    url: '/auth/logout',
    method: 'post',
  });
}
