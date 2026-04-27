import type { DashboardStatistics } from '@/types/dashboard';
import { request } from '@/utils/request';

export function getDashboardStatisticsApi() {
  return request<DashboardStatistics>({
    url: '/dashboard/statistics',
    method: 'get',
  });
}
