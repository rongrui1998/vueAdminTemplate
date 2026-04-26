import type { MockMethod } from 'vite-plugin-mock';
import { dashboardStatistics } from '@/mock/data/dashboard';

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

export default [
  {
    url: '/api/dashboard/statistics',
    method: 'get',
    response: () => success(dashboardStatistics),
  },
] as MockMethod[];
