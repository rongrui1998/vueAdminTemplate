export type MenuType = 'directory' | 'menu' | 'button';

export interface BackendMenuItem {
  id: string;
  parentId?: string | null;
  name: string;
  path: string;
  component: string;
  icon?: string;
  sort?: number;
  type: MenuType;
  permission?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  affix?: boolean;
  status?: number;
  children?: BackendMenuItem[];
}

export interface AppMenuItem extends BackendMenuItem {
  fullPath: string;
  routeName: string;
  children: AppMenuItem[];
}
