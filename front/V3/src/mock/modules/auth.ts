import type { MockMethod } from 'vite-plugin-mock';
import { findMockAccount } from '@/mock/data/auth';

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
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username?: string; password?: string } }) => {
      if (!body.username || !body.password) {
        return {
          code: 400,
          msg: '用户名或密码不能为空',
          data: null,
          tip: '登录失败',
        };
      }

      const account = findMockAccount(body.username, body.password);

      if (!account) {
        return {
          code: 401,
          msg: '账号或密码错误',
          data: null,
          tip: '登录失败',
        };
      }

      return success({
        token: account.token,
      });
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => success(true),
  },
] as MockMethod[];
