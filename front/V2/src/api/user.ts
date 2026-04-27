import type { UserInfo } from '@/types/user';
import { request } from '@/utils/request';

export function getUserInfoApi() {
  return request<UserInfo>({
    url: '/user/info',
    method: 'get',
  });
}
