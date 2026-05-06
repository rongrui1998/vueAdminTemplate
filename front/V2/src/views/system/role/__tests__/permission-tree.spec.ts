import type { BackendMenuItem } from '@/types/menu';
import {
  buildSubmittedMenuIds,
  resolveReplayCheckedMenuIds,
  syncPermissionTreeCheckedIds,
} from '../permission-tree';

describe('permission tree replay', () => {
  it('replays only leaf selections so partially selected branches stay half checked', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'demo-root',
        parentId: null,
        name: '业务示例',
        path: '/demo',
        component: 'ParentView',
        type: 'directory',
        permission: '',
        status: 1,
        children: [
          {
            id: 'demo-crud',
            parentId: 'demo-root',
            name: 'CRUD 示例',
            path: '/demo/crud',
            component: 'demo/crud/index',
            type: 'menu',
            permission: 'demo:crud:view',
            status: 1,
            children: [],
          },
          {
            id: 'demo-business-template',
            parentId: 'demo-root',
            name: '标准业务模板',
            path: '/demo/business-template',
            component: 'demo/business-template/index',
            type: 'menu',
            permission: 'demo:business-template:view',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    const replayCheckedIds = resolveReplayCheckedMenuIds(menuTree, [
      'demo-root',
      'demo-business-template',
    ]);

    expect(replayCheckedIds).toEqual(['demo-business-template']);
  });

  it('keeps page and button permissions independently selectable while submitting ancestors', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'demo-root',
        parentId: null,
        name: '业务示例',
        path: '/demo',
        component: 'ParentView',
        type: 'directory',
        permission: '',
        status: 1,
        children: [
          {
            id: 'demo-business-template',
            parentId: 'demo-root',
            name: '标准业务模板',
            path: '/demo/business-template',
            component: 'demo/business-template/index',
            type: 'menu',
            permission: 'demo:business-template:view',
            status: 1,
            children: [
              {
                id: 'demo-business-template-delete',
                parentId: 'demo-business-template',
                name: '删除',
                path: '',
                component: '',
                type: 'button',
                permission: 'demo:business-template:delete',
                status: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    expect(resolveReplayCheckedMenuIds(menuTree, ['demo-root', 'demo-business-template'])).toEqual([
      'demo-business-template',
    ]);

    expect(buildSubmittedMenuIds(menuTree, ['demo-business-template'])).toEqual([
      'demo-business-template',
      'demo-root',
    ]);
  });

  it('replays a directly selected parent menu when all checked descendants are buttons', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-create',
            parentId: 'device-page',
            name: '新增',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:create',
            status: 1,
            children: [],
          },
          {
            id: 'device-status',
            parentId: 'device-page',
            name: '修改状态',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:status',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    expect(resolveReplayCheckedMenuIds(menuTree, ['device-page'])).toEqual(['device-page']);
  });

  it('replays both the page node and checked child buttons after saving page-level permissions', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-create',
            parentId: 'device-page',
            name: '新增',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:create',
            status: 1,
            children: [],
          },
          {
            id: 'device-status',
            parentId: 'device-page',
            name: '修改状态',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:status',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    const savedMenuIds = buildSubmittedMenuIds(menuTree, [
      'device-page',
      'device-create',
      'device-status',
    ]);

    expect(savedMenuIds).toEqual(['device-page', 'device-create', 'device-status']);
    expect(resolveReplayCheckedMenuIds(menuTree, savedMenuIds)).toEqual([
      'device-page',
      'device-create',
      'device-status',
    ]);
  });

  it('replays both the page node and a selected button when only one action is granted', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-delete',
            parentId: 'device-page',
            name: '删除',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:delete',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    expect(resolveReplayCheckedMenuIds(menuTree, ['device-page', 'device-delete'])).toEqual([
      'device-page',
      'device-delete',
    ]);
  });

  it('keeps a page menu independently checked without forcing child buttons', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-create',
            parentId: 'device-page',
            name: '新增',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:create',
            status: 1,
            children: [],
          },
          {
            id: 'device-status',
            parentId: 'device-page',
            name: '修改状态',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:status',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    expect(syncPermissionTreeCheckedIds(menuTree, ['device-page'], 'device-page', true)).toEqual([
      'device-page',
    ]);
  });

  it('auto-selects the page menu when a child button is checked', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-create',
            parentId: 'device-page',
            name: '新增',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:create',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    expect(
      syncPermissionTreeCheckedIds(menuTree, ['device-create'], 'device-create', true),
    ).toEqual(['device-create', 'device-page']);
  });

  it('clears child buttons when the page menu is unchecked', () => {
    const menuTree: BackendMenuItem[] = [
      {
        id: 'device-page',
        parentId: null,
        name: '设备管理',
        path: '/monitor/device',
        component: 'monitor/device/index',
        type: 'menu',
        permission: 'monitor:device:view',
        status: 1,
        children: [
          {
            id: 'device-create',
            parentId: 'device-page',
            name: '新增',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:create',
            status: 1,
            children: [],
          },
          {
            id: 'device-status',
            parentId: 'device-page',
            name: '修改状态',
            path: '',
            component: '',
            type: 'button',
            permission: 'monitor:device:status',
            status: 1,
            children: [],
          },
        ],
      },
    ];

    expect(
      syncPermissionTreeCheckedIds(
        menuTree,
        ['device-page', 'device-create', 'device-status'],
        'device-page',
        false,
      ),
    ).toEqual([]);
  });
});
