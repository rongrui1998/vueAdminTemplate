/// <reference types="vite/client" />

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
    affix?: boolean;
    permission?: string;
    menuId?: string;
    cacheKey?: string;
    component?: string;
    componentMissing?: boolean;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BACKEND_TARGET: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_MENU_SOURCE: 'api' | 'mock' | 'static';
  readonly VITE_STANDARD_DATA_SOURCE: 'api' | 'mock';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
