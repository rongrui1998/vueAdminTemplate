import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { APP_LANGUAGE, APP_TITLE, type AppLanguage } from '@/constants/app';
import type { AppMenuItem } from '@/types/menu';

export function getPageTitle(title?: string) {
  return title ? `${title} - ${APP_TITLE}` : APP_TITLE;
}

export function resolveMenuTitle(
  menu: Pick<AppMenuItem, 'name' | 'nameEn'>,
  language: AppLanguage,
) {
  if (language === APP_LANGUAGE.enUS) {
    return menu.nameEn || menu.name;
  }

  return menu.name;
}

export function getRouteTitle(
  route: Pick<RouteLocationNormalizedLoaded, 'meta'>,
  language: AppLanguage = APP_LANGUAGE.zhCN,
) {
  if (language === APP_LANGUAGE.enUS) {
    return String(route.meta.titleEn || route.meta.title || 'Untitled');
  }

  return String(route.meta.title || '未命名页面');
}
