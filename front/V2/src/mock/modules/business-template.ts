import type { MockMethod } from 'vite-plugin-mock';
import { businessTemplateData } from '@/mock/data/business-template';
import type { BusinessTemplatePayload } from '@/types/business-template';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function fail(code: number, msg: string, tip = msg) {
  return {
    code,
    msg,
    data: null,
    time: new Date().toISOString(),
    tip,
  };
}

function getUrlId(url: string) {
  return url.split('/').filter(Boolean).pop() || '';
}

function formatNow() {
  return new Date().toLocaleString('zh-CN', { hour12: false });
}

function normalizePayload(data: Partial<BusinessTemplatePayload>) {
  return {
    name: String(data.name || '').trim(),
    owner: String(data.owner || '').trim() || '未分配',
    scene: String(data.scene || '').trim() || '通用业务',
    status: Number(data.status ?? 1),
    remark: String(data.remark || '').trim(),
  };
}

export default [
  {
    url: '/api/demo/business-templates',
    method: 'get',
    response: ({ query }: { query?: { keyword?: string; status?: string } }) => {
      const keyword = (query?.keyword || '').trim().toLowerCase();
      const status = query?.status;
      let list = [...businessTemplateData];

      if (keyword) {
        list = list.filter((item) =>
          [item.name, item.owner, item.scene].some((value) =>
            value.toLowerCase().includes(keyword),
          ),
        );
      }

      if (status !== undefined && status !== '') {
        list = list.filter((item) => item.status === Number(status));
      }

      return success({
        total: list.length,
        list,
      });
    },
  },
  {
    url: '/api/demo/business-templates/:id',
    method: 'get',
    response: ({ url }: { url: string }) => {
      const item = businessTemplateData.find((record) => record.id === getUrlId(url));

      if (!item) {
        return fail(404, '业务模板不存在', '获取详情失败');
      }

      return success(item);
    },
  },
  {
    url: '/api/demo/business-templates',
    method: 'post',
    response: ({ body }: { body?: Partial<BusinessTemplatePayload> }) => {
      const normalized = normalizePayload(body || {});

      if (!normalized.name) {
        return fail(400, '业务名称不能为空', '创建失败');
      }

      const item = {
        id: `tpl-${Date.now()}`,
        ...normalized,
        updatedAt: formatNow(),
      };

      businessTemplateData.unshift(item);
      return success(item);
    },
  },
  {
    url: '/api/demo/business-templates/:id',
    method: 'put',
    response: ({ body, url }: { body?: Partial<BusinessTemplatePayload>; url: string }) => {
      const id = getUrlId(url);
      const index = businessTemplateData.findIndex((item) => item.id === id);

      if (index < 0) {
        return fail(404, '业务模板不存在', '更新失败');
      }

      const item = {
        ...businessTemplateData[index],
        ...normalizePayload({
          ...businessTemplateData[index],
          ...(body || {}),
        }),
        updatedAt: formatNow(),
      };

      businessTemplateData.splice(index, 1, item);
      return success(item);
    },
  },
  {
    url: '/api/demo/business-templates/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const index = businessTemplateData.findIndex((item) => item.id === getUrlId(url));

      if (index < 0) {
        return fail(404, '业务模板不存在', '删除失败');
      }

      businessTemplateData.splice(index, 1);
      return success(true);
    },
  },
] as MockMethod[];
