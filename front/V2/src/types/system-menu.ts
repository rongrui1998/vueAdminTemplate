import type { BackendMenuItem } from '@/types/menu';

export type SystemMenuType = BackendMenuItem['type'];

export interface SystemMenuQuery {
  keyword?: string;
}

export type SystemMenuFormMode = 'create-root' | 'create-child' | 'edit';

export interface SystemMenuPayload {
  parentId: string | null;
  type: SystemMenuType;
  name: string;
  path: string;
  component: string;
  permission: string;
  icon: string;
  sort: number;
  status: number;
  hidden: boolean;
  keepAlive: boolean;
  affix: boolean;
  remark: string;
}

export type SystemMenuRecord = BackendMenuItem;
