import type { MockMethod } from 'vite-plugin-mock';
import type { SystemUserPayload } from '@/types/system-user';
import { systemRoleData } from '@/mock/data/system-role';
import { systemUserData } from '@/mock/data/system-user';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function getUrlId(url: string, offset = 0) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1 - offset] || '';
}

function getRoleNames(roleIds: string[]) {
  return roleIds.map((roleId) => systemRoleData.find((role) => role.id === roleId)?.name || roleId);
}

function toUserRecord(user: (typeof systemUserData)[number]) {
  const { password: _password, token: _token, ...record } = user;
  return {
    ...record,
    roleNames: getRoleNames(record.roleIds),
  };
}

function normalizePayload(data: Partial<SystemUserPayload>) {
  return {
    username: data.username?.trim() || 'user',
    nickname: data.nickname?.trim() || '未命名用户',
    password: data.password?.trim() || '123456',
    roleIds: data.roleIds?.length ? data.roleIds : [],
    status: Number(data.status ?? 1),
    remark: data.remark?.trim() || '',
  };
}

export default [
  {
    url: '/api/system/users',
    method: 'get',
    response: ({ query }: { query?: { keyword?: string } }) => {
      const keyword = (query?.keyword || '').trim();
      const list = systemUserData
        .filter(
          (item) => !keyword || item.username.includes(keyword) || item.nickname.includes(keyword),
        )
        .map(toUserRecord);

      return success({
        total: list.length,
        list,
      });
    },
  },
  {
    url: '/api/system/users',
    method: 'post',
    response: ({ body }: { body?: Partial<SystemUserPayload> }) => {
      const normalized = normalizePayload(body || {});
      systemUserData.push({
        id: `u-${Date.now()}`,
        ...normalized,
        token: `mock-access-token-${normalized.username}`,
        roleNames: getRoleNames(normalized.roleIds),
        lastLoginAt: '-',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
      return success(true);
    },
  },
  {
    url: '/api/system/users/:id',
    method: 'put',
    response: ({ body, url }: { body?: Partial<SystemUserPayload>; url: string }) => {
      const id = getUrlId(url);
      const index = systemUserData.findIndex((item) => item.id === id);

      if (index < 0) {
        throw new Error('用户不存在');
      }

      const normalized = normalizePayload({
        ...systemUserData[index],
        ...(body || {}),
      });

      systemUserData.splice(index, 1, {
        ...systemUserData[index],
        ...normalized,
        roleNames: getRoleNames(normalized.roleIds),
      });
      return success(true);
    },
  },
  {
    url: '/api/system/users/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const id = getUrlId(url);
      const index = systemUserData.findIndex((item) => item.id === id);

      if (index < 0) {
        throw new Error('用户不存在');
      }

      systemUserData.splice(index, 1);
      return success(true);
    },
  },
  {
    url: '/api/system/users/:id/password',
    method: 'put',
    response: ({ body, url }: { body?: { password?: string }; url: string }) => {
      const id = getUrlId(url, 1);
      const user = systemUserData.find((item) => item.id === id);

      if (!user) {
        throw new Error('用户不存在');
      }

      user.password = body?.password?.trim() || '123456';
      return success(true);
    },
  },
] as MockMethod[];
