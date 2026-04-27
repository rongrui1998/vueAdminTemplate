import type { TagProps } from 'element-plus';
import type { SystemMenuPayload, SystemMenuType } from '@/types/system-menu';

export const menuTypeOptions: Array<{ label: string; value: SystemMenuType }> = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
];

export const menuTypeLabelMap: Record<SystemMenuType, string> = {
  directory: '目录',
  menu: '菜单',
  button: '按钮',
};

export const menuTypeTagTypeMap: Record<SystemMenuType, TagProps['type']> = {
  directory: 'primary',
  menu: 'info',
  button: 'danger',
};

export const defaultMenuPayload: SystemMenuPayload = {
  parentId: null,
  type: 'menu',
  name: '',
  path: '',
  component: '',
  permission: '',
  icon: 'Menu',
  sort: 1,
  status: 1,
  hidden: false,
  keepAlive: true,
  affix: false,
  remark: '',
};
