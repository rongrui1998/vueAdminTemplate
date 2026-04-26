export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  time?: string;
  tip?: string;
}

export interface ApiListData<T> {
  total: number;
  list: T[];
}

export interface PaginationParams {
  pageNum: number;
  pageSize: number;
}
