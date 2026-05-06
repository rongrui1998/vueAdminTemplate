import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { defineStore } from 'pinia';
import { DASHBOARD_PATH } from '@/constants/route';
import { STORAGE_KEYS } from '@/constants/app';
import type { PersistedTabsState, TabViewItem } from '@/types/route';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

function createDefaultState(): PersistedTabsState {
  return {
    visitedViews: [],
    cachedViews: [],
    activePath: DASHBOARD_PATH,
  };
}

function persist(state: PersistedTabsState) {
  setStorage(STORAGE_KEYS.tabs, state);
}

export const useTabsStore = defineStore('tabs', {
  state: (): PersistedTabsState => getStorage(STORAGE_KEYS.tabs, createDefaultState()),
  actions: {
    addTabFromRoute(route: RouteLocationNormalizedLoaded) {
      if (!route.name || route.meta.hidden) {
        return;
      }

      const routeName = String(route.name);
      const currentIndex = this.visitedViews.findIndex((item) => item.routeName === routeName);
      const nextTab: TabViewItem = {
        title: String(route.meta.title || '未命名页面'),
        titleEn: String(route.meta.titleEn || route.meta.title || 'Untitled'),
        path: route.path,
        fullPath: route.fullPath,
        routeName,
        cacheKey: route.meta.keepAlive ? routeName : undefined,
        affix: Boolean(route.meta.affix),
      };

      if (currentIndex === -1) {
        this.visitedViews.push(nextTab);
      } else {
        this.visitedViews[currentIndex] = {
          ...this.visitedViews[currentIndex],
          ...nextTab,
        };
      }

      if (route.meta.keepAlive && !this.cachedViews.includes(routeName)) {
        this.cachedViews.push(routeName);
      }

      this.activePath = route.fullPath;
      persist(this.$state);
    },
    setActivePath(path: string) {
      this.activePath = path;
      persist(this.$state);
    },
    removeTab(fullPath: string) {
      const target = this.visitedViews.find((item) => item.fullPath === fullPath);

      if (!target || target.affix) {
        return;
      }

      this.visitedViews = this.visitedViews.filter((item) => item.fullPath !== fullPath);
      this.cachedViews = this.cachedViews.filter((item) => item !== target.routeName);

      if (this.activePath === fullPath) {
        this.activePath =
          this.visitedViews[this.visitedViews.length - 1]?.fullPath || DASHBOARD_PATH;
      }

      persist(this.$state);
    },
    removeOthers(fullPath: string) {
      this.visitedViews = this.visitedViews.filter(
        (item) => item.affix || item.fullPath === fullPath,
      );
      this.cachedViews = this.visitedViews
        .filter((item) => item.cacheKey)
        .map((item) => item.routeName);
      this.activePath = fullPath;
      persist(this.$state);
    },
    removeAll() {
      this.visitedViews = this.visitedViews.filter((item) => item.affix);
      this.cachedViews = this.visitedViews
        .filter((item) => item.cacheKey)
        .map((item) => item.routeName);
      this.activePath = this.visitedViews[0]?.fullPath || DASHBOARD_PATH;
      persist(this.$state);
    },
    removeCache(routeName: string) {
      this.cachedViews = this.cachedViews.filter((item) => item !== routeName);
      persist(this.$state);
    },
    reorderTabs(sourceFullPath: string, targetFullPath: string) {
      if (sourceFullPath === targetFullPath) {
        return;
      }

      const sourceIndex = this.visitedViews.findIndex((item) => item.fullPath === sourceFullPath);
      const targetIndex = this.visitedViews.findIndex((item) => item.fullPath === targetFullPath);

      if (sourceIndex === -1 || targetIndex === -1) {
        return;
      }

      const nextViews = [...this.visitedViews];
      const [source] = nextViews.splice(sourceIndex, 1);
      nextViews.splice(targetIndex, 0, source);
      this.visitedViews = nextViews;
      persist(this.$state);
    },
    resetTabs() {
      this.visitedViews = [];
      this.cachedViews = [];
      this.activePath = DASHBOARD_PATH;
      removeStorage(STORAGE_KEYS.tabs);
    },
  },
});
