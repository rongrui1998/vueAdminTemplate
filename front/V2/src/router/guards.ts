import NProgress from 'nprogress';
import type { Router } from 'vue-router';
import { DASHBOARD_PATH, FORBIDDEN_PATH, LOGIN_PATH } from '@/constants/route';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { useTabsStore } from '@/store/modules/tabs';
import { addDynamicRoutes } from '@/router/helper-runtime';
import { getPageTitle, getRouteTitle } from '@/utils/route';

NProgress.configure({ showSpinner: false });

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();
    const tabsStore = useTabsStore();

    appStore.setPageTransitionLoading(appStore.pageTransitionLoadingEnabled);
    appStore.setPageTransitionAnimationActive(false);

    if (appStore.pageTransitionProgressEnabled) {
      NProgress.start();
    }

    if (!authStore.isLoggedIn) {
      if (to.path === LOGIN_PATH) {
        next();
      } else {
        next({
          path: LOGIN_PATH,
          query: { redirect: to.fullPath },
          replace: true,
        });
      }
      return;
    }

    if (to.path === LOGIN_PATH) {
      next({ path: DASHBOARD_PATH, replace: true });
      return;
    }

    try {
      await authStore.fetchUserInfo();

      if (!permissionStore.routeLoaded) {
        const dynamicRoutes = await permissionStore.generateRoutes();
        addDynamicRoutes(router, dynamicRoutes);
        next({
          path: to.fullPath,
          replace: true,
        });
        return;
      }

      if (
        !permissionStore.canAccessPermission(
          typeof to.meta.permission === 'string' ? to.meta.permission : undefined,
        )
      ) {
        next({ path: FORBIDDEN_PATH, replace: true });
        return;
      }

      next();
    } catch {
      authStore.clearAuth();
      permissionStore.resetPermissionState(router);
      tabsStore.resetTabs();
      next({
        path: LOGIN_PATH,
        query: { redirect: to.fullPath },
        replace: true,
      });
    }
  });

  router.afterEach((to) => {
    const appStore = useAppStore();
    document.title = getPageTitle(getRouteTitle(to, appStore.currentLanguage));

    if (!to.meta.hidden && to.name) {
      const tabsStore = useTabsStore();
      tabsStore.addTabFromRoute(to);
    }

    if (appStore.pageTransitionProgressEnabled) {
      NProgress.done();
    }

    appStore.setPageTransitionLoading(false);

    if (appStore.pageTransitionAnimationEnabled) {
      appStore.setPageTransitionAnimationActive(true);
    }
  });

  router.onError(() => {
    const appStore = useAppStore();

    if (appStore.pageTransitionProgressEnabled) {
      NProgress.done();
    }

    appStore.setPageTransitionLoading(false);
    appStore.setPageTransitionAnimationActive(false);
  });
}
