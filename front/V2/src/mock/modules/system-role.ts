import type { MockMethod } from 'vite-plugin-mock';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemRoleMenusPayload, SystemRolePayload } from '@/types/system-role';
import { systemRoleData } from '@/mock/data/system-role';
import { systemUserData } from '@/mock/data/system-user';
import { getSystemMenuState } from './system-menu';

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

function collectPermissionsByMenuIds(menuIds: string[]) {
  const selectedIds = new Set(menuIds);
  const permissions = new Set<string>();

  function walk(list: BackendMenuItem[]) {
    list.forEach((item) => {
      if (selectedIds.has(item.id) && item.permission) {
        permissions.add(item.permission);
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(getSystemMenuState());
  return [...permissions];
}

function getRoleUserCount(roleId: string) {
  return systemUserData.filter((user) => user.roleIds.includes(roleId)).length;
}

function normalizePayload(data: Partial<SystemRolePayload>) {
  return {
    code: data.code?.trim() || 'custom',
    name: data.name?.trim() || '未命名角色',
    sort: Number(data.sort || 1),
    status: Number(data.status ?? 1),
    remark: data.remark?.trim() || '',
  };
}

export default [
  {
    url: '/api/system/roles',
    method: 'get',
    response: ({ query }: { query?: { keyword?: string } }) => {
      const keyword = (query?.keyword || '').trim();
      const list = systemRoleData
        .filter((item) => !keyword || item.name.includes(keyword) || item.code.includes(keyword))
        .map((item) => ({
          ...item,
          userCount: getRoleUserCount(item.id),
        }))
        .sort((prev, next) => prev.sort - next.sort);

      return success({
        total: list.length,
        list,
      });
    },
  },
  {
    url: '/api/system/roles',
    method: 'post',
    response: ({ body }: { body?: Partial<SystemRolePayload> }) => {
      const normalized = normalizePayload(body || {});
      systemRoleData.push({
        id: `role-${Date.now()}`,
        ...normalized,
        menuIds: [],
        permissions: [],
        userCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
      return success(true);
    },
  },
  {
    url: '/api/system/roles/:id',
    method: 'put',
    response: ({ body, url }: { body?: Partial<SystemRolePayload>; url: string }) => {
      const id = getUrlId(url);
      const index = systemRoleData.findIndex((item) => item.id === id);

      if (index < 0) {
        throw new Error('角色不存在');
      }

      systemRoleData.splice(index, 1, {
        ...systemRoleData[index],
        ...normalizePayload({
          ...systemRoleData[index],
          ...(body || {}),
        }),
      });
      return success(true);
    },
  },
  {
    url: '/api/system/roles/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const id = getUrlId(url);
      const index = systemRoleData.findIndex((item) => item.id === id);

      if (index < 0) {
        throw new Error('角色不存在');
      }

      systemRoleData.splice(index, 1);
      return success(true);
    },
  },
  {
    url: '/api/system/roles/:id/menus',
    method: 'put',
    response: ({ body, url }: { body?: Partial<SystemRoleMenusPayload>; url: string }) => {
      const id = getUrlId(url, 1);
      const role = systemRoleData.find((item) => item.id === id);

      if (!role) {
        throw new Error('角色不存在');
      }

      role.menuIds = body?.menuIds || [];
      role.permissions = collectPermissionsByMenuIds(role.menuIds);
      return success(true);
    },
  },
] as MockMethod[];
