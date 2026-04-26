import type { MockMethod } from 'vite-plugin-mock';
import { getMockUserInfoByToken, getTokenFromHeaders } from '@/mock/data/auth';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }: { headers?: Record<string, unknown> }) => {
      const token = getTokenFromHeaders(headers);
      const userInfo = getMockUserInfoByToken(token);

      if (!userInfo) {
        return {
          code: 401,
          msg: '登录状态已失效',
          data: null,
          tip: '请重新登录',
        };
      }

      return success(userInfo);
    },
  },
] as MockMethod[];
