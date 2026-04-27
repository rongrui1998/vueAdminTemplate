import { readJson } from '../utils/json.js';

function normalizeToken(headers = {}) {
  const raw = headers.authorization || headers.Authorization || '';

  if (typeof raw !== 'string') {
    return '';
  }

  return raw.replace(/^Bearer\s+/i, '').trim();
}

export async function findUserByCredentials(username, password) {
  const users = await readJson('users.json');
  return users.find((item) => item.username === username && item.password === password) || null;
}

export async function findUserByToken(headers) {
  const token = normalizeToken(headers);

  if (!token) {
    return null;
  }

  const users = await readJson('users.json');
  return users.find((item) => item.token === token) || null;
}

export async function buildUserAccessPayload(user) {
  const roles = await readJson('roles.json');
  const matchedRoles = roles.filter((item) => user.roleIds.includes(item.id));
  const permissions = [...new Set(matchedRoles.flatMap((item) => item.permissions || []))];

  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar || '',
    roles: matchedRoles.map((item) => item.id),
    permissions,
  };
}
