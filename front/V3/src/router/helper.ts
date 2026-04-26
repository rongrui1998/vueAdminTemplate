import type { AppMenuItem } from '@/types/menu';

export function normalizeChildPath(path: string) {
  return path.replace(/^\/+/, '');
}

export function buildRouteMeta(menu: AppMenuItem) {
  return {
    title: menu.name,
    icon: menu.icon,
    hidden: menu.hidden,
    keepAlive: menu.keepAlive,
    affix: menu.affix,
    permission: menu.permission,
    menuId: menu.id,
    cacheKey: menu.routeName,
    component: menu.component,
    componentMissing: false,
  };
}
