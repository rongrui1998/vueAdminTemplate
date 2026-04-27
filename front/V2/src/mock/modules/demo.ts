import type { MockMethod } from 'vite-plugin-mock';
import { demoUsers } from '@/mock/data/demo';

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

function parseId(url: string) {
  const segments = url.split('/');
  return segments[segments.length - 1];
}

function formatNow() {
  return new Date().toLocaleString('zh-CN', { hour12: false });
}

export default [
  {
    url: '/api/demo/users',
    method: 'get',
    response: ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; keyword?: string; status?: string };
    }) => {
      const pageNum = Number(query.pageNum || 1);
      const pageSize = Number(query.pageSize || 10);
      const keyword = (query.keyword || '').trim().toLowerCase();
      const status = query.status;

      let list = [...demoUsers];

      if (keyword) {
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword),
        );
      }

      if (status !== undefined && status !== '') {
        list = list.filter((item) => item.status === Number(status));
      }

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;

      return success({
        total: list.length,
        list: list.slice(start, end),
      });
    },
  },
  {
    url: '/api/demo/users/:id',
    method: 'get',
    response: ({ url }: { url: string }) => {
      const id = parseId(url);
      const item = demoUsers.find((user) => user.id === id);

      if (!item) {
        return fail(404, '账号不存在', '获取详情失败');
      }

      return success(item);
    },
  },
  {
    url: '/api/demo/users',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const item = {
        id: String(Date.now()),
        createdAt: formatNow(),
        name: String(body.name || ''),
        email: String(body.email || ''),
        role: String(body.role || ''),
        department: String(body.department || ''),
        status: Number(body.status ?? 1),
      };

      demoUsers.unshift(item);
      return success(item);
    },
  },
  {
    url: '/api/demo/users/:id',
    method: 'put',
    response: ({ url, body }: { url: string; body: Record<string, unknown> }) => {
      const id = parseId(url);
      const index = demoUsers.findIndex((user) => user.id === id);
      const current = index !== -1 ? demoUsers[index] : null;

      if (!current) {
        return fail(404, '账号不存在', '更新失败');
      }

      const item = {
        id,
        createdAt: current.createdAt || formatNow(),
        name: String(body.name || current.name || ''),
        email: String(body.email || current.email || ''),
        role: String(body.role || current.role || ''),
        department: String(body.department || current.department || ''),
        status: Number(body.status ?? current.status ?? 1),
      };

      demoUsers.splice(index, 1, item);

      return success(item);
    },
  },
  {
    url: '/api/demo/users/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const id = parseId(url);
      const index = demoUsers.findIndex((user) => user.id === id);

      if (index === -1) {
        return fail(404, '账号不存在', '删除失败');
      }

      demoUsers.splice(index, 1);
      return success(true);
    },
  },
] as MockMethod[];
