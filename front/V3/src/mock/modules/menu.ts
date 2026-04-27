import type { MockMethod } from 'vite-plugin-mock';
import { getMockUserInfoByToken, getTokenFromHeaders } from '@/mock/data/auth';
import { menuData } from '@/mock/data/menus';
import type { BackendMenuItem } from '@/types/menu';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function filterMenusByPermissions(
  menus: BackendMenuItem[],
  permissions: string[],
  isAdmin: boolean,
): BackendMenuItem[] {
  return menus.reduce<BackendMenuItem[]>((result, item) => {
    const children = item.children?.length
      ? filterMenusByPermissions(item.children, permissions, isAdmin)
      : [];
    const hasPermission = !item.permission || isAdmin || permissions.includes(item.permission);
    const isDirectory = item.type === 'directory';
    const visibleChildren = children.filter((child) => !child.hidden && child.type !== 'button');

    if (item.type === 'button' && !hasPermission) {
      return result;
    }

    if (isDirectory) {
      if (!children.length) {
        return result;
      }

      result.push({
        ...item,
        hidden: item.hidden || visibleChildren.length === 0,
        children,
      });
      return result;
    }

    result.push({
      ...item,
      hidden: item.hidden || !hasPermission,
      children,
    });
    return result;
  }, []);
}

export default [
  {
    url: '/api/menu/list',
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

      const filteredMenus = filterMenusByPermissions(
        menuData,
        userInfo.permissions,
        userInfo.roles.includes('admin'),
      );

      return success({
        total: filteredMenus.length,
        list: filteredMenus,
      });
    },
  },
] as MockMethod[];
