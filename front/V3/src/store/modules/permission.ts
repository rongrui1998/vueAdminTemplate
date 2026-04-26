import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { getMenuListApi } from '@/api/menu';
import { useAuthStore } from '@/store/modules/auth';
import type { BackendMenuItem } from '@/types/menu';
import { getVisibleMenus, normalizeMenuTree } from '@/utils/menu';
import { collectDynamicRouteNames, generateDynamicRoutes } from '@/router/dynamic-routes';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    rawMenus: [] as BackendMenuItem[],
    menuTree: [] as ReturnType<typeof normalizeMenuTree>,
    dynamicRoutes: [] as ReturnType<typeof generateDynamicRoutes>,
    dynamicRouteNames: [] as string[],
    routeLoaded: false,
  }),
  getters: {
    visibleMenus: (state) => getVisibleMenus(state.menuTree),
  },
  actions: {
    async fetchMenus(force = false) {
      if (!force && this.menuTree.length) {
        return this.menuTree;
      }

      const result = await getMenuListApi();
      this.rawMenus = result.list;
      this.menuTree = normalizeMenuTree(result.list);
      return this.menuTree;
    },
    async generateRoutes() {
      const menus = await this.fetchMenus();
      const routes = generateDynamicRoutes(menus);
      this.dynamicRoutes = routes;
      this.dynamicRouteNames = collectDynamicRouteNames(routes);
      this.routeLoaded = true;
      return routes;
    },
    canAccessPermission(permission?: string) {
      const authStore = useAuthStore();
      return authStore.hasPermission(permission);
    },
    resetPermissionState(router?: Router) {
      if (router) {
        [...this.dynamicRouteNames].reverse().forEach((routeName) => {
          if (router.hasRoute(routeName)) {
            router.removeRoute(routeName);
          }
        });
      }

      this.rawMenus = [];
      this.menuTree = [];
      this.dynamicRoutes = [];
      this.dynamicRouteNames = [];
      this.routeLoaded = false;
    },
  },
});
