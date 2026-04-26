import type { UserInfo } from '@/types/user';

export interface MockAccount {
  username: string;
  password: string;
  token: string;
  userInfo: UserInfo;
}

export const mockAccounts: MockAccount[] = [
  {
    username: 'admin',
    password: '123456',
    token: 'mock-access-token-admin',
    userInfo: {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: [
        'dashboard:view',
        'demo:crud:view',
        'demo:crud:create',
        'demo:crud:edit',
        'demo:crud:delete',
        'demo:permission:view',
        'demo:permission:create',
        'demo:permission:export',
        'demo:permission:approve',
        'demo:permission:delete',
        'demo:nested:view',
        'demo:nested:extra:view',
      ],
    },
  },
  {
    username: 'editor',
    password: '123456',
    token: 'mock-access-token-editor',
    userInfo: {
      id: 'u-2',
      username: 'editor',
      nickname: '运营编辑',
      avatar: '',
      roles: ['editor'],
      permissions: [
        'dashboard:view',
        'demo:crud:view',
        'demo:crud:edit',
        'demo:permission:view',
        'demo:permission:create',
        'demo:permission:export',
        'demo:nested:view',
      ],
    },
  },
];

export function findMockAccount(username = '', password = '') {
  return (
    mockAccounts.find((item) => item.username === username && item.password === password) || null
  );
}

export function getMockUserInfoByToken(token = '') {
  return mockAccounts.find((item) => item.token === token)?.userInfo || null;
}

export function getTokenFromHeaders(headers?: Record<string, unknown>) {
  const authorization = headers?.Authorization || headers?.authorization;

  if (typeof authorization !== 'string') {
    return '';
  }

  return authorization.replace(/^Bearer\s+/i, '').trim();
}
