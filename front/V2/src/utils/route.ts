import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { APP_TITLE } from '@/constants/app';

export function getPageTitle(title?: string) {
  return title ? `${title} - ${APP_TITLE}` : APP_TITLE;
}

export function getRouteTitle(route: RouteLocationNormalizedLoaded) {
  return route.meta.title || '未命名页面';
}
