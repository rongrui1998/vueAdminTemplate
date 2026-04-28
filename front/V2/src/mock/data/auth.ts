import type { UserInfo } from '@/types/user';
import { systemRoleData } from '@/mock/data/system-role';
import { systemUserData } from '@/mock/data/system-user';

export interface MockAccount {
  username: string;
  password: string;
  token: string;
  userInfo: UserInfo;
}

function buildMockUserInfo(user: (typeof systemUserData)[number]): UserInfo | null {
  if (user.status !== 1) {
    return null;
  }

  const roles = systemRoleData.filter(
    (role) => role.status === 1 && user.roleIds.includes(role.id),
  );

  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: '',
    roles: roles.map((role) => role.code),
    permissions: [...new Set(roles.flatMap((role) => role.permissions))],
  };
}

function buildMockAccount(user: (typeof systemUserData)[number]): MockAccount | null {
  const userInfo = buildMockUserInfo(user);

  if (!userInfo) {
    return null;
  }

  return {
    username: user.username,
    password: user.password,
    token: user.token,
    userInfo,
  };
}

export const mockAccounts: MockAccount[] = systemUserData
  .map((user) => buildMockAccount(user))
  .filter(Boolean) as MockAccount[];

export function findMockAccount(username = '', password = '') {
  const user = systemUserData.find(
    (item) => item.username === username && item.password === password,
  );

  return user ? buildMockAccount(user) : null;
}

export function getMockUserInfoByToken(token = '') {
  const user = systemUserData.find((item) => item.token === token);

  return user ? buildMockUserInfo(user) : null;
}

export function getTokenFromHeaders(headers?: Record<string, unknown>) {
  const authorization = headers?.Authorization || headers?.authorization;

  if (typeof authorization !== 'string') {
    return '';
  }

  return authorization.replace(/^Bearer\s+/i, '').trim();
}
