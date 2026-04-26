import type { RouteRecordRaw } from 'vue-router';
import {
  DASHBOARD_PATH,
  FORBIDDEN_PATH,
  LOGIN_PATH,
  NOT_FOUND_PATH,
  REDIRECT_PATH,
  ROOT_ROUTE_NAME,
} from '@/constants/route';

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: LOGIN_PATH,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    name: ROOT_ROUTE_NAME,
    component: () => import('@/layout/index.vue'),
    redirect: DASHBOARD_PATH,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: `${REDIRECT_PATH.replace(/^\//, '')}/:pathMatch(.*)*`,
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          hidden: true,
        },
      },
    ],
  },
  {
    path: FORBIDDEN_PATH,
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限访问',
      hidden: true,
    },
  },
  {
    path: NOT_FOUND_PATH,
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
    },
  },
];
