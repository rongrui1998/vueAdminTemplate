import crypto from 'node:crypto';
import { readJson, writeJson } from '../utils/json.js';

function filterMenusByIds(list, allowedIds) {
  return list.reduce((result, item) => {
    const children = item.children?.length ? filterMenusByIds(item.children, allowedIds) : [];
    const includeSelf = allowedIds.has(item.id);

    if (!includeSelf && !children.length) {
      return result;
    }

    result.push({
      ...item,
      hidden: item.hidden || !includeSelf,
      children,
    });
    return result;
  }, []);
}

function normalizeMenuPayload(data = {}) {
  const type = data.type || 'menu';

  return {
    parentId: data.parentId ?? null,
    type,
    name: String(data.name || '').trim() || '未命名菜单',
    path: type === 'button' ? '' : String(data.path || '').trim(),
    component:
      type === 'directory'
        ? 'ParentView'
        : type === 'button'
          ? ''
          : String(data.component || '').trim(),
    icon: String(data.icon || '').trim() || (type === 'button' ? 'Document' : 'Menu'),
    sort: Number(data.sort || 1),
    permission: type === 'directory' ? '' : String(data.permission || '').trim(),
    hidden: Boolean(data.hidden),
    keepAlive: type === 'menu' ? Boolean(data.keepAlive) : false,
    affix: type === 'menu' ? Boolean(data.affix) : false,
    status: Number(data.status ?? 1),
    remark: String(data.remark || '').trim(),
  };
}

function findNodeById(list, id) {
  for (const item of list) {
    if (item.id === id) {
      return {
        node: item,
        parentList: list,
      };
    }

    if (item.children?.length) {
      const found = findNodeById(item.children, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function sortTree(list = []) {
  list.sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
  list.forEach((item) => {
    if (item.children?.length) {
      sortTree(item.children);
    }
  });
  return list;
}

async function readMenus() {
  return readJson('menus.json');
}

async function writeMenus(list) {
  await writeJson('menus.json', sortTree(list));
}

export async function getMenuListForRoleIds(roleIds) {
  const [menus, roles] = await Promise.all([readMenus(), readJson('roles.json')]);
  const matchedRoles = roles.filter((item) => roleIds.includes(item.id));
  const allowedIds = new Set(matchedRoles.flatMap((item) => item.menuIds || []));
  return filterMenusByIds(menus, allowedIds);
}

export async function getAllSystemMenus() {
  return readMenus();
}

export async function createSystemMenu(payload) {
  const menus = await readMenus();
  const normalized = normalizeMenuPayload(payload);
  const nextItem = {
    id: crypto.randomUUID(),
    ...normalized,
    children: [],
  };

  if (!normalized.parentId) {
    menus.push(nextItem);
    await writeMenus(menus);
    return nextItem;
  }

  const parent = findNodeById(menus, normalized.parentId);

  if (!parent) {
    throw new Error('上级菜单不存在');
  }

  parent.node.children = parent.node.children || [];
  parent.node.children.push(nextItem);
  await writeMenus(menus);
  return nextItem;
}

export async function updateSystemMenu(id, payload) {
  const menus = await readMenus();
  const found = findNodeById(menus, id);

  if (!found) {
    throw new Error('菜单不存在');
  }

  const normalized = normalizeMenuPayload({
    ...found.node,
    ...payload,
  });

  const nextNode = {
    ...found.node,
    ...normalized,
    id,
    children: found.node.children || [],
  };

  found.parentList.splice(found.parentList.indexOf(found.node), 1, nextNode);
  await writeMenus(menus);
  return nextNode;
}

export async function deleteSystemMenu(id) {
  const menus = await readMenus();
  const found = findNodeById(menus, id);

  if (!found) {
    throw new Error('菜单不存在');
  }

  found.parentList.splice(found.parentList.indexOf(found.node), 1);
  await writeMenus(menus);
  return true;
}
