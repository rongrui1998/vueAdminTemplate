import crypto from 'node:crypto';
import { readJson, writeJson } from '../utils/json.js';

function normalizeRolePayload(data = {}) {
  return {
    code: String(data.code || '').trim() || 'custom',
    name: String(data.name || '').trim() || '未命名角色',
    sort: Number(data.sort || 1),
    status: Number(data.status ?? 1),
    remark: String(data.remark || '').trim(),
  };
}

function collectPermissionsByMenuIds(menus, menuIds = []) {
  const selectedIds = new Set(menuIds);
  const permissions = new Set();

  function walk(list = []) {
    list.forEach((item) => {
      if (selectedIds.has(item.id) && item.permission) {
        permissions.add(item.permission);
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(menus);
  return [...permissions];
}

async function readRoles() {
  return readJson('roles.json');
}

async function writeRoles(list) {
  await writeJson(
    'roles.json',
    list.sort((prev, next) => (prev.sort || 0) - (next.sort || 0)),
  );
}

async function getUserCountsByRoleId() {
  const users = await readJson('users.json');

  return users.reduce((result, user) => {
    (user.roleIds || []).forEach((roleId) => {
      result.set(roleId, (result.get(roleId) || 0) + 1);
    });
    return result;
  }, new Map());
}

export async function getSystemRoles(keyword = '') {
  const [roles, userCounts] = await Promise.all([readRoles(), getUserCountsByRoleId()]);
  const normalizedKeyword = String(keyword || '').trim();

  return roles
    .filter(
      (item) =>
        !normalizedKeyword ||
        item.name.includes(normalizedKeyword) ||
        item.code?.includes(normalizedKeyword) ||
        item.id.includes(normalizedKeyword),
    )
    .map((item) => ({
      code: item.code || item.id,
      sort: item.sort || 1,
      status: Number(item.status ?? 1),
      createdAt: item.createdAt || '',
      remark: item.remark || '',
      ...item,
      userCount: userCounts.get(item.id) || 0,
    }))
    .sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
}

export async function createSystemRole(payload) {
  const roles = await readRoles();
  const normalized = normalizeRolePayload(payload);

  if (roles.some((item) => item.code === normalized.code || item.id === normalized.code)) {
    throw new Error('角色编码已存在');
  }

  roles.push({
    id: normalized.code || crypto.randomUUID(),
    ...normalized,
    menuIds: [],
    permissions: [],
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  await writeRoles(roles);
  return true;
}

export async function updateSystemRole(id, payload) {
  const roles = await readRoles();
  const index = roles.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('角色不存在');
  }

  const normalized = normalizeRolePayload({
    ...roles[index],
    ...payload,
  });

  roles.splice(index, 1, {
    ...roles[index],
    ...normalized,
    code: roles[index].id === 'admin' ? 'admin' : normalized.code,
  });
  await writeRoles(roles);
  return true;
}

export async function deleteSystemRole(id) {
  if (id === 'admin') {
    throw new Error('系统管理员角色不可删除');
  }

  const roles = await readRoles();
  const index = roles.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('角色不存在');
  }

  roles.splice(index, 1);
  await writeRoles(roles);
  return true;
}

export async function updateSystemRoleMenus(id, menuIds = []) {
  const [roles, menus] = await Promise.all([readRoles(), readJson('menus.json')]);
  const role = roles.find((item) => item.id === id);

  if (!role) {
    throw new Error('角色不存在');
  }

  role.menuIds = [...new Set(menuIds.map(String))];
  role.permissions = collectPermissionsByMenuIds(menus, role.menuIds);
  await writeRoles(roles);
  return true;
}
