import type { RouteRecordRaw } from 'vue-router';
import type { AppMenuItem } from '@/types/menu';
import { buildRouteMeta, normalizeChildPath } from '@/router/helper';
import { ParentView, resolveRouteComponent } from '@/router/route-map';

function getRoutePath(menu: AppMenuItem, parentFullPath = '') {
  const fullPath = menu.fullPath || menu.path;
  const normalizedParent = parentFullPath.replace(/\/+$/, '');

  if (normalizedParent && fullPath.startsWith(`${normalizedParent}/`)) {
    return normalizeChildPath(fullPath.slice(normalizedParent.length + 1));
  }

  return normalizeChildPath(fullPath);
}

function createRouteRecord(menu: AppMenuItem, parentFullPath = ''): RouteRecordRaw | null {
  if (menu.type === 'button') {
    return null;
  }

  const childRoutes = menu.children
    .map((child) => createRouteRecord(child, menu.fullPath))
    .filter(Boolean) as RouteRecordRaw[];
  const isDirectory = menu.type === 'directory' || childRoutes.length > 0;

  if (isDirectory && !childRoutes.length) {
    return null;
  }

  const resolved = isDirectory
    ? { component: ParentView, componentMissing: false }
    : resolveRouteComponent(menu.component);

  return {
    path: getRoutePath(menu, parentFullPath),
    name: menu.routeName,
    component: resolved.component,
    meta: {
      ...buildRouteMeta(menu),
      componentMissing: resolved.componentMissing,
    },
    children: childRoutes,
  };
}

export function generateDynamicRoutes(menus: AppMenuItem[]) {
  return menus.map((menu) => createRouteRecord(menu)).filter(Boolean) as RouteRecordRaw[];
}

export function collectDynamicRouteNames(routes: RouteRecordRaw[]) {
  const routeNames: string[] = [];

  function walk(items: RouteRecordRaw[]) {
    items.forEach((item) => {
      if (item.name) {
        routeNames.push(String(item.name));
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(routes);
  return routeNames;
}
