import type { ApiListData } from '@/types/api';
import { menuData } from '@/mock/data/menus';
import type { BackendMenuItem } from '@/types/menu';
import { request } from '@/utils/request';

function getRemoteMenuList() {
  return request<ApiListData<BackendMenuItem>>({
    url: '/menu/list',
    method: 'get',
  });
}

function getStaticMenuList(): ApiListData<BackendMenuItem> {
  return {
    total: menuData.length,
    list: menuData,
  };
}

export function getMenuListApi() {
  const menuSource = import.meta.env.VITE_MENU_SOURCE;

  if (menuSource === 'static') {
    return Promise.resolve(getStaticMenuList());
  }

  return getRemoteMenuList();
}
