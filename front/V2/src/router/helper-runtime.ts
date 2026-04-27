import type { RouteRecordRaw, Router } from 'vue-router';
import { ROOT_ROUTE_NAME } from '@/constants/route';

export function addDynamicRoutes(router: Router, routes: RouteRecordRaw[]) {
  routes.forEach((route) => {
    router.addRoute(ROOT_ROUTE_NAME, route);
  });
}
