import type { RouteRecordRaw } from 'vue-router';
import type { AppMenuItem } from '@/types/menu';
import { buildRouteMeta, normalizeChildPath } from '@/router/helper';
import { ParentView, resolveRouteComponent } from '@/router/route-map';

function createRouteRecord(menu: AppMenuItem): RouteRecordRaw | null {
  if (menu.type === 'button') {
    return null;
  }

  const childRoutes = menu.children.map(createRouteRecord).filter(Boolean) as RouteRecordRaw[];
  const isDirectory = menu.type === 'directory' || childRoutes.length > 0;

  if (isDirectory && !childRoutes.length) {
    return null;
  }

  const resolved = isDirectory
    ? { component: ParentView, componentMissing: false }
    : resolveRouteComponent(menu.component);

  return {
    path: normalizeChildPath(menu.path),
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
  return menus.map(createRouteRecord).filter(Boolean) as RouteRecordRaw[];
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
