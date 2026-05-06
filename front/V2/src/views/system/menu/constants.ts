import type { TagProps } from 'element-plus';
import type { SystemMenuPayload, SystemMenuType } from '@/types/system-menu';
import { i18n } from '@/plugins/i18n';

export const menuTypeOptions: Array<{ label: string; value: SystemMenuType }> = [
  { label: i18n.global.t('systemMenu.type.directory'), value: 'directory' },
  { label: i18n.global.t('systemMenu.type.menu'), value: 'menu' },
  { label: i18n.global.t('systemMenu.type.button'), value: 'button' },
];

export const menuTypeLabelMap: Record<SystemMenuType, string> = {
  directory: i18n.global.t('systemMenu.type.directory'),
  menu: i18n.global.t('systemMenu.type.menu'),
  button: i18n.global.t('systemMenu.type.button'),
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
  nameEn: '',
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
