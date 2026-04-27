import type { MockMethod } from 'vite-plugin-mock';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemMenuPayload } from '@/types/system-menu';
import { systemMenuData } from '@/mock/data/system-menu';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function cloneMenuTree(list: BackendMenuItem[]): BackendMenuItem[] {
  return list.map((item) => ({
    ...item,
    children: item.children?.length ? cloneMenuTree(item.children) : [],
  }));
}

const systemMenuState = cloneMenuTree(systemMenuData);

function normalizePayload(data: Partial<SystemMenuPayload>) {
  const type = data.type || 'menu';

  return {
    parentId: data.parentId ?? null,
    type,
    name: data.name?.trim() || '未命名菜单',
    path: data.path?.trim() || '',
    component:
      type === 'directory' ? 'ParentView' : type === 'button' ? '' : data.component?.trim() || '',
    permission: data.permission?.trim() || '',
    icon: data.icon?.trim() || 'Menu',
    sort: Number(data.sort || 1),
    status: Number(data.status ?? 1),
    hidden: Boolean(data.hidden),
    keepAlive: Boolean(data.keepAlive),
    affix: Boolean(data.affix),
    remark: data.remark?.trim() || '',
  };
}

function filterMenus(list: BackendMenuItem[], keyword: string): BackendMenuItem[] {
  return list.reduce<BackendMenuItem[]>((result, item) => {
    const children = item.children?.length ? filterMenus(item.children, keyword) : [];
    const matched =
      !keyword ||
      item.name.includes(keyword) ||
      item.path.includes(keyword) ||
      item.permission?.includes(keyword) ||
      item.component.includes(keyword);

    if (!matched && !children.length) {
      return result;
    }

    result.push({
      ...item,
      children,
    });
    return result;
  }, []);
}

function findNodeById(
  list: BackendMenuItem[],
  id: string,
): { node: BackendMenuItem; parentList: BackendMenuItem[] } | null {
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

function insertMenuItem(payload: Partial<SystemMenuPayload>) {
  const normalized = normalizePayload(payload);
  const id = `system-menu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const nextItem: BackendMenuItem = {
    id,
    ...normalized,
    children: [],
  };

  if (!normalized.parentId) {
    systemMenuState.push(nextItem);
    return nextItem;
  }

  const parent = findNodeById(systemMenuState, normalized.parentId);

  if (!parent) {
    throw new Error('上级菜单不存在');
  }

  parent.node.children = parent.node.children || [];
  parent.node.children.push(nextItem);
  parent.node.children.sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
  return nextItem;
}

function updateMenuItem(id: string, payload: Partial<SystemMenuPayload>) {
  const found = findNodeById(systemMenuState, id);

  if (!found) {
    throw new Error('菜单不存在');
  }

  const normalized = normalizePayload({
    ...found.node,
    ...payload,
  });
  const { children = [] } = found.node;

  found.parentList.splice(found.parentList.indexOf(found.node), 1, {
    ...found.node,
    ...normalized,
    id,
    children,
  });
}

function deleteMenuItem(id: string) {
  const found = findNodeById(systemMenuState, id);

  if (!found) {
    throw new Error('菜单不存在');
  }

  found.parentList.splice(found.parentList.indexOf(found.node), 1);
}

function getUrlId(url: string) {
  return url.split('/').pop() || '';
}

export default [
  {
    url: '/api/system/menus',
    method: 'get',
    response: ({ query }: { query?: { keyword?: string } }) => {
      const keyword = (query?.keyword || '').trim();
      const list = filterMenus(systemMenuState, keyword);

      return success({
        total: list.length,
        list,
      });
    },
  },
  {
    url: '/api/system/menus',
    method: 'post',
    response: ({ body }: { body?: Partial<SystemMenuPayload> }) => {
      insertMenuItem(body || {});
      return success(true);
    },
  },
  {
    url: '/api/system/menus/:id',
    method: 'put',
    response: ({ body, url }: { body?: Partial<SystemMenuPayload>; url: string }) => {
      updateMenuItem(getUrlId(url), body || {});
      return success(true);
    },
  },
  {
    url: '/api/system/menus/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      deleteMenuItem(getUrlId(url));
      return success(true);
    },
  },
] as MockMethod[];
