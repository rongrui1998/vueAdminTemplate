export interface SystemUserQuery {
  keyword?: string;
}

export interface SystemUserRecord {
  id: string;
  username: string;
  nickname: string;
  roleIds: string[];
  roleNames: string[];
  status: number;
  lastLoginAt: string;
  createdAt: string;
  remark?: string;
}

export interface SystemUserPayload {
  username: string;
  nickname: string;
  password?: string;
  roleIds: string[];
  status: number;
  remark: string;
}

export interface SystemUserPasswordPayload {
  password: string;
}
