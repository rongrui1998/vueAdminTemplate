import { findMockAccount, getMockUserInfoByToken, mockAccounts } from '@/mock/data/auth';
import { menuData } from '@/mock/data/menus';
import menuMock from '@/mock/modules/menu';
import systemMenuMock from '@/mock/modules/system-menu';
import systemRoleMock from '@/mock/modules/system-role';
import systemUserMock from '@/mock/modules/system-user';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemRoleRecord } from '@/types/system-role';

function collectMenuIds(list: typeof menuData) {
  const ids: string[] = [];

  function walk(items: typeof menuData) {
    items.forEach((item) => {
      ids.push(item.id);

      if (item.children?.length) {
        walk(item.children as typeof menuData);
      }
    });
  }

  walk(list);
  return ids;
}

function findMenuByName(list: BackendMenuItem[], name: string): BackendMenuItem | null {
  for (const item of list) {
    if (item.name === name) {
      return item;
    }

    if (item.children?.length) {
      const found = findMenuByName(item.children, name);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

describe('mock contracts', () => {
  it('exposes the login accounts and user payload shape', () => {
    expect(mockAccounts[0]).toEqual(
      expect.objectContaining({
        password: expect.any(String),
        token: expect.any(String),
        username: expect.any(String),
      }),
    );

    expect(findMockAccount('admin', '123456')?.token).toBe('mock-access-token-admin');
    expect(getMockUserInfoByToken('mock-access-token-editor')).toEqual(
      expect.objectContaining({
        nickname: expect.any(String),
        permissions: expect.any(Array),
        roles: expect.any(Array),
      }),
    );
  });

  it('exposes a menu tree with permission metadata', () => {
    expect(Array.isArray(menuData)).toBe(true);
    expect(menuData[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        path: expect.any(String),
        type: expect.any(String),
      }),
    );
    expect(menuData[1]?.path).toBe('system');
    expect(menuData[1]?.children?.[0]?.permission).toBe('system:user:view');
    expect(menuData[1]?.children?.[1]?.permission).toBe('system:role:view');
    expect(menuData[2]?.children?.[0]?.permission).toBe('demo:crud:view');
    expect(findMenuByName(menuData, '组件示例')).toEqual(
      expect.objectContaining({
        component: 'ParentView',
        type: 'directory',
      }),
    );
    expect(findMenuByName(menuData, 'DrawerForm 示例')).toEqual(
      expect.objectContaining({
        component: 'demo/components/drawer-form/index',
        permission: 'demo:components:drawer-form:view',
      }),
    );
    expect(findMenuByName(menuData, '导入导出示例')).toEqual(
      expect.objectContaining({
        component: 'demo/import-export/index',
        permission: 'demo:import-export:view',
      }),
    );
  });

  it('keeps every menu id unique so dynamic route names do not collide', () => {
    const ids = collectMenuIds(menuData);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes menus created in menu management to the admin sidebar mock', () => {
    const createMenu = systemMenuMock.find(
      (item) => item.url === '/api/system/menus' && item.method === 'post',
    );
    const sidebarMenu = menuMock.find((item) => item.url === '/api/menu/list');

    expect(createMenu).toBeTruthy();
    expect(sidebarMenu).toBeTruthy();

    createMenu!.response({
      body: {
        parentId: null,
        type: 'menu',
        name: '测试菜单',
        path: '/test',
        component: '/test/index',
        permission: 'test:view',
        icon: 'Grid',
        sort: 99,
        status: 1,
      },
    });

    const payload = sidebarMenu!.response({
      headers: {
        Authorization: 'Bearer mock-access-token-admin',
      },
    }) as { data: { list: BackendMenuItem[] } };

    expect(payload.data.list.some((item) => item.name === '测试菜单')).toBe(true);
  });

  it('links mock users, roles, menus, login and sidebar permissions as one flow', () => {
    const createMenu = systemMenuMock.find(
      (item) => item.url === '/api/system/menus' && item.method === 'post',
    );
    const listSystemMenus = systemMenuMock.find(
      (item) => item.url === '/api/system/menus' && item.method === 'get',
    );
    const createRole = systemRoleMock.find(
      (item) => item.url === '/api/system/roles' && item.method === 'post',
    );
    const listRoles = systemRoleMock.find(
      (item) => item.url === '/api/system/roles' && item.method === 'get',
    );
    const assignRoleMenus = systemRoleMock.find(
      (item) => item.url === '/api/system/roles/:id/menus' && item.method === 'put',
    );
    const createUser = systemUserMock.find(
      (item) => item.url === '/api/system/users' && item.method === 'post',
    );
    const sidebarMenu = menuMock.find((item) => item.url === '/api/menu/list');

    createMenu!.response({
      body: {
        parentId: null,
        type: 'menu',
        name: '闭环菜单',
        path: '/flow',
        component: '/flow/index',
        permission: 'flow:view',
        icon: 'Grid',
        sort: 100,
        status: 1,
      },
    });
    createRole!.response({
      body: {
        code: 'flow_role',
        name: '闭环角色',
        sort: 50,
        status: 1,
        remark: '用于验证 mock 权限闭环',
      },
    });

    const menuPayload = listSystemMenus!.response({}) as { data: { list: BackendMenuItem[] } };
    const rolePayload = listRoles!.response({}) as { data: { list: SystemRoleRecord[] } };
    const flowMenu = findMenuByName(menuPayload.data.list, '闭环菜单');
    const flowRole = rolePayload.data.list.find((item) => item.code === 'flow_role');

    expect(flowMenu).toBeTruthy();
    expect(flowRole).toBeTruthy();

    assignRoleMenus!.response({
      url: `/api/system/roles/${flowRole!.id}/menus`,
      body: {
        menuIds: [flowMenu!.id],
      },
    });
    createUser!.response({
      body: {
        username: 'flow_user',
        nickname: '闭环用户',
        password: '123456',
        roleIds: [flowRole!.id],
        status: 1,
        remark: '用于验证 mock 登录权限',
      },
    });

    const account = findMockAccount('flow_user', '123456');
    expect(account?.token).toBe('mock-access-token-flow_user');

    const userInfo = getMockUserInfoByToken(account!.token);
    expect(userInfo).toEqual(
      expect.objectContaining({
        username: 'flow_user',
        roles: ['flow_role'],
        permissions: ['flow:view'],
      }),
    );

    const sidebarPayload = sidebarMenu!.response({
      headers: {
        Authorization: `Bearer ${account!.token}`,
      },
    }) as { data: { list: BackendMenuItem[] } };

    expect(findMenuByName(sidebarPayload.data.list, '闭环菜单')).toBeTruthy();
    expect(findMenuByName(sidebarPayload.data.list, '系统管理')).toBeNull();
  });
});
