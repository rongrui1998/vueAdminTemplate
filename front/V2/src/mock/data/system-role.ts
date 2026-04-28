import type { SystemRoleRecord } from '@/types/system-role';

const initialSystemRoleData: SystemRoleRecord[] = [
  {
    id: 'admin',
    code: 'admin',
    name: '系统管理员',
    sort: 1,
    status: 1,
    menuIds: [
      'dashboard',
      'system-root',
      'system-user',
      'system-user-create',
      'system-user-edit',
      'system-user-delete',
      'system-user-reset',
      'system-role',
      'system-role-create',
      'system-role-edit',
      'system-role-delete',
      'system-role-auth',
      'system-menu',
      'system-menu-create',
      'system-menu-edit',
      'system-menu-delete',
      'demo-root',
      'demo-crud',
    ],
    permissions: [
      'dashboard:view',
      'system:user:view',
      'system:user:create',
      'system:user:edit',
      'system:user:delete',
      'system:user:reset',
      'system:role:view',
      'system:role:create',
      'system:role:edit',
      'system:role:delete',
      'system:role:auth',
      'system:menu:view',
      'system:menu:create',
      'system:menu:edit',
      'system:menu:delete',
      'demo:crud:view',
    ],
    userCount: 1,
    createdAt: '2026-04-27 10:00:00',
    remark: '拥有系统全部管理权限',
  },
  {
    id: 'editor',
    code: 'editor',
    name: '运营编辑',
    sort: 2,
    status: 1,
    menuIds: ['dashboard', 'demo-root', 'demo-crud'],
    permissions: ['dashboard:view', 'demo:crud:view'],
    userCount: 1,
    createdAt: '2026-04-27 10:00:00',
    remark: '负责运营内容维护',
  },
];

const mockGlobal = globalThis as typeof globalThis & {
  __V2_MOCK_SYSTEM_ROLE_DATA__?: SystemRoleRecord[];
};

export const systemRoleData = (mockGlobal.__V2_MOCK_SYSTEM_ROLE_DATA__ ??= initialSystemRoleData);
