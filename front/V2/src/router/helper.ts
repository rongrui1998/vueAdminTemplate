import type { AppMenuItem } from '@/types/menu';
import { resolveMenuTitle } from '@/utils/route';
import { APP_LANGUAGE } from '@/constants/app';

export function normalizeChildPath(path: string) {
  return path.replace(/^\/+/, '');
}

export function buildRouteMeta(menu: AppMenuItem) {
  return {
    title: resolveMenuTitle(menu, APP_LANGUAGE.zhCN),
    titleEn: resolveMenuTitle(menu, APP_LANGUAGE.enUS),
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
