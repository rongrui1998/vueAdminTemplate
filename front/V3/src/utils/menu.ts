import type { AppMenuItem, BackendMenuItem } from '@/types/menu';

function ensureLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function joinFullPath(parentPath: string, currentPath: string) {
  if (!currentPath) {
    return parentPath || '/';
  }

  if (currentPath.startsWith('/')) {
    return currentPath;
  }

  if (!parentPath || parentPath === '/') {
    return ensureLeadingSlash(currentPath);
  }

  return `${parentPath}/${currentPath}`.replace(/\/+/g, '/');
}

function sortMenus(menus: BackendMenuItem[]) {
  return [...menus].sort((a, b) => (a.sort || 0) - (b.sort || 0));
}

export function normalizeMenuTree(menus: BackendMenuItem[], parentPath = ''): AppMenuItem[] {
  return sortMenus(menus)
    .filter((item) => item.status !== 0)
    .map((item) => {
      const fullPath = joinFullPath(parentPath, item.path);
      const children = item.children?.length ? normalizeMenuTree(item.children, fullPath) : [];

      return {
        ...item,
        fullPath,
        routeName: `route_${item.id}`,
        children,
      };
    });
}

export function getVisibleMenus(menus: AppMenuItem[]) {
  return menus.filter((item) => !item.hidden && item.type !== 'button');
}
