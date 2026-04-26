export interface DemoUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: number;
  createdAt: string;
}

export interface DemoUserForm {
  name: string;
  email: string;
  role: string;
  department: string;
  status: number;
}

export interface DemoUserQuery {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: number | '';
}
