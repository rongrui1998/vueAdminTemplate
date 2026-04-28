export interface SystemRoleQuery {
  keyword?: string;
}

export interface SystemRoleRecord {
  id: string;
  code: string;
  name: string;
  sort: number;
  status: number;
  menuIds: string[];
  permissions: string[];
  userCount: number;
  createdAt: string;
  remark?: string;
}

export interface SystemRolePayload {
  code: string;
  name: string;
  sort: number;
  status: number;
  remark: string;
}

export interface SystemRoleMenusPayload {
  menuIds: string[];
}
