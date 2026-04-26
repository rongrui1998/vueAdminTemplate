import { collectDynamicRouteNames, generateDynamicRoutes } from '@/router/dynamic-routes';
import { normalizeMenuTree } from '@/utils/menu';
import type { BackendMenuItem } from '@/types/menu';

describe('dynamic routes', () => {
  it('transforms nested menus and skips button nodes', () => {
    const menus: BackendMenuItem[] = [
      {
        id: 'demo-root',
        parentId: null,
        name: '业务示例',
        path: 'demo',
        component: 'ParentView',
        type: 'directory',
        children: [
          {
            id: 'demo-page',
            parentId: 'demo-root',
            name: '页面示例',
            path: 'page',
            component: 'demo/nested/index',
            type: 'menu',
            children: [],
          },
          {
            id: 'demo-button',
            parentId: 'demo-root',
            name: '导出',
            path: '',
            component: '',
            type: 'button',
            permission: 'demo:export',
            children: [],
          },
        ],
      },
    ];

    const routes = generateDynamicRoutes(normalizeMenuTree(menus));

    expect(routes).toHaveLength(1);
    expect(routes[0]?.path).toBe('demo');
    expect(routes[0]?.children).toHaveLength(1);
    expect(routes[0]?.children?.[0]?.path).toBe('page');
    expect(collectDynamicRouteNames(routes)).toEqual(['route_demo-root', 'route_demo-page']);
  });
});
