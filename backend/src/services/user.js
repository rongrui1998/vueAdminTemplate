import crypto from 'node:crypto';
import { readJson, writeJson } from '../utils/json.js';

function normalizeUserPayload(data = {}) {
  return {
    username: String(data.username || '').trim(),
    nickname: String(data.nickname || '').trim() || '未命名用户',
    password: String(data.password || '').trim() || '123456',
    roleIds: Array.isArray(data.roleIds) ? data.roleIds.map(String) : [],
    status: Number(data.status ?? 1),
    remark: String(data.remark || '').trim(),
  };
}

async function readUsers() {
  return readJson('users.json');
}

async function writeUsers(list) {
  await writeJson('users.json', list);
}

async function getRoleNameMap() {
  const roles = await readJson('roles.json');
  return roles.reduce((result, role) => {
    result.set(role.id, role.name);
    return result;
  }, new Map());
}

function toUserRecord(user, roleNameMap) {
  const { password: _password, token: _token, ...record } = user;

  return {
    status: Number(user.status ?? 1),
    lastLoginAt: user.lastLoginAt || '-',
    createdAt: user.createdAt || '',
    remark: user.remark || '',
    ...record,
    roleNames: (user.roleIds || []).map((roleId) => roleNameMap.get(roleId) || roleId),
  };
}

export async function getSystemUsers(keyword = '') {
  const [users, roleNameMap] = await Promise.all([readUsers(), getRoleNameMap()]);
  const normalizedKeyword = String(keyword || '').trim();

  return users
    .filter(
      (item) =>
        !normalizedKeyword ||
        item.username.includes(normalizedKeyword) ||
        item.nickname.includes(normalizedKeyword),
    )
    .map((item) => toUserRecord(item, roleNameMap));
}

export async function createSystemUser(payload) {
  const users = await readUsers();
  const normalized = normalizeUserPayload(payload);

  if (!normalized.username) {
    throw new Error('登录账号不能为空');
  }

  if (users.some((item) => item.username === normalized.username)) {
    throw new Error('登录账号已存在');
  }

  users.push({
    id: crypto.randomUUID(),
    ...normalized,
    token: `backend-token-${normalized.username}`,
    lastLoginAt: '-',
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  await writeUsers(users);
  return true;
}

export async function updateSystemUser(id, payload) {
  const users = await readUsers();
  const index = users.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('用户不存在');
  }

  const normalized = normalizeUserPayload({
    ...users[index],
    ...payload,
  });

  users.splice(index, 1, {
    ...users[index],
    username: users[index].username,
    nickname: normalized.nickname,
    roleIds: normalized.roleIds,
    status: normalized.status,
    remark: normalized.remark,
  });

  await writeUsers(users);
  return true;
}

export async function deleteSystemUser(id) {
  const users = await readUsers();
  const index = users.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('用户不存在');
  }

  if (users[index].username === 'admin') {
    throw new Error('内置管理员不可删除');
  }

  users.splice(index, 1);
  await writeUsers(users);
  return true;
}

export async function resetSystemUserPassword(id, password = '123456') {
  const users = await readUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error('用户不存在');
  }

  user.password = String(password || '123456');
  await writeUsers(users);
  return true;
}
