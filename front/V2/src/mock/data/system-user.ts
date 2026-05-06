import type { SystemUserRecord } from '@/types/system-user';

type MockSystemUser = SystemUserRecord & { password: string; token: string };

const initialSystemUserData: MockSystemUser[] = [
  {
    id: 'u-1',
    username: 'admin',
    password: '123456',
    nickname: '系统管理员',
    roleIds: ['admin'],
    roleNames: ['系统管理员'],
    status: 1,
    token: 'mock-access-token-admin',
    lastLoginAt: '2026-04-28 09:00:00',
    createdAt: '2026-04-27 10:00:00',
    remark: '内置管理员账号',
  },
  {
    id: 'u-2',
    username: 'editor',
    password: '123456',
    nickname: '运营编辑',
    roleIds: ['editor'],
    roleNames: ['运营编辑'],
    status: 1,
    token: 'mock-access-token-editor',
    lastLoginAt: '2026-04-28 09:10:00',
    createdAt: '2026-04-27 10:00:00',
    remark: '运营内容账号',
  },
  {
    id: 'u-3',
    username: 'rongrui',
    password: '123456',
    nickname: '荣睿',
    roleIds: ['customer'],
    roleNames: ['客服'],
    status: 1,
    token: 'mock-access-token-rongrui',
    lastLoginAt: '-',
    createdAt: '2026-04-29 08:02:41',
    remark: '荣睿客服',
  },
];

const mockGlobal = globalThis as typeof globalThis & {
  __V2_MOCK_SYSTEM_USER_DATA__?: MockSystemUser[];
};

export const systemUserData = (mockGlobal.__V2_MOCK_SYSTEM_USER_DATA__ ??= initialSystemUserData);
