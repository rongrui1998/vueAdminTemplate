import type { ApiListData } from '@/types/api';
import type {
  BusinessTemplatePayload,
  BusinessTemplateQuery,
  BusinessTemplateRecord,
} from '@/types/business-template';
import { request } from '@/utils/request';

export function getBusinessTemplatesApi(params: BusinessTemplateQuery = {}) {
  return request<ApiListData<BusinessTemplateRecord>>({
    url: '/demo/business-templates',
    method: 'get',
    params,
  });
}

export function getBusinessTemplateDetailApi(id: string) {
  return request<BusinessTemplateRecord>({
    url: `/demo/business-templates/${id}`,
    method: 'get',
  });
}

export function createBusinessTemplateApi(data: BusinessTemplatePayload) {
  return request<BusinessTemplateRecord>({
    url: '/demo/business-templates',
    method: 'post',
    data,
  });
}

export function updateBusinessTemplateApi(id: string, data: BusinessTemplatePayload) {
  return request<BusinessTemplateRecord>({
    url: `/demo/business-templates/${id}`,
    method: 'put',
    data,
  });
}

export function deleteBusinessTemplateApi(id: string) {
  return request<boolean>({
    url: `/demo/business-templates/${id}`,
    method: 'delete',
  });
}
