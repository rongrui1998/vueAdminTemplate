export interface BusinessTemplateRecord {
  id: string;
  name: string;
  owner: string;
  scene: string;
  status: number;
  updatedAt: string;
  remark: string;
}

export interface BusinessTemplatePayload {
  name: string;
  owner: string;
  scene: string;
  status: number;
  remark: string;
}

export interface BusinessTemplateQuery {
  keyword?: string;
  status?: number | '';
}
