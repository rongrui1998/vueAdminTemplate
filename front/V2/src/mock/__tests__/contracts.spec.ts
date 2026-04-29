import { findMockAccount, getMockUserInfoByToken, mockAccounts } from '@/mock/data/auth';
import { menuData } from '@/mock/data/menus';
import businessTemplateMock from '@/mock/modules/business-template';
import menuMock from '@/mock/modules/menu';
import importExportMock from '@/mock/modules/import-export';
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
    expect(findMenuByName(menuData, '标准业务模板')).toEqual(
      expect.objectContaining({
        component: 'demo/business-template/index',
        permission: 'demo:business-template:view',
      }),
    );
    expect(findMenuByName(menuData, '全局设置')).toBeNull();
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

  it('previews, confirms, and exports import export mock data', () => {
    const preview = importExportMock.find(
      (item) => item.url === '/api/demo/import-export/preview' && item.method === 'post',
    );
    const confirm = importExportMock.find(
      (item) => item.url === '/api/demo/import-export/confirm' && item.method === 'post',
    );
    const exportCsv = importExportMock.find(
      (item) => item.url === '/api/demo/import-export/export' && item.method === 'get',
    );

    expect(preview).toBeTruthy();
    expect(confirm).toBeTruthy();
    expect(exportCsv).toBeTruthy();

    const previewPayload = preview!.response({
      body: {
        csvText: [
          'name,email,role,status',
          '测试用户,test@example.com,admin,启用',
          ',bad,guest,未知',
        ].join('\n'),
      },
    }) as { data: { total: number; validCount: number; invalidCount: number; rows: unknown[] } };

    expect(previewPayload.data.total).toBe(2);
    expect(previewPayload.data.validCount).toBe(1);
    expect(previewPayload.data.invalidCount).toBe(1);

    const confirmPayload = confirm!.response({
      body: {
        rows: [
          {
            name: '测试用户',
            email: 'test@example.com',
            role: 'admin',
            status: '启用',
          },
        ],
      },
    }) as { data: { importedCount: number } };

    expect(confirmPayload.data.importedCount).toBe(1);

    const exportPayload = exportCsv!.response({}) as { data: { csvText: string } };
    expect(exportPayload.data.csvText).toContain('测试用户,test@example.com,admin,启用');
  });

  it('supports business template mock CRUD contract', () => {
    const list = businessTemplateMock.find(
      (item) => item.url === '/api/demo/business-templates' && item.method === 'get',
    );
    const create = businessTemplateMock.find(
      (item) => item.url === '/api/demo/business-templates' && item.method === 'post',
    );
    const detail = businessTemplateMock.find(
      (item) => item.url === '/api/demo/business-templates/:id' && item.method === 'get',
    );
    const update = businessTemplateMock.find(
      (item) => item.url === '/api/demo/business-templates/:id' && item.method === 'put',
    );

    expect(list).toBeTruthy();
    expect(create).toBeTruthy();
    expect(detail).toBeTruthy();
    expect(update).toBeTruthy();

    const createPayload = create!.response({
      body: {
        name: '接口模式样例',
        owner: '模板组',
        scene: '标准页面',
        status: 1,
        remark: 'mock 创建',
      },
    }) as { data: { id: string; name: string } };

    expect(createPayload.data.name).toBe('接口模式样例');

    const listPayload = list!.response({
      query: {
        keyword: '接口模式',
      },
    }) as { data: { total: number; list: Array<{ id: string }> } };

    expect(listPayload.data.total).toBeGreaterThan(0);

    const detailPayload = detail!.response({
      url: `/api/demo/business-templates/${createPayload.data.id}`,
    }) as { data: { owner: string } };

    expect(detailPayload.data.owner).toBe('模板组');

    const updatePayload = update!.response({
      url: `/api/demo/business-templates/${createPayload.data.id}`,
      body: {
        name: '接口模式样例',
        owner: '模板组',
        scene: '标准页面',
        status: 0,
        remark: 'mock 更新',
      },
    }) as { data: { status: number } };

    expect(updatePayload.data.status).toBe(0);
  });
});
