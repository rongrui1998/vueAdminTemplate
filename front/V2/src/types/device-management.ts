import type { PaginationParams } from '@/types/api';

export type DeviceStatus = 0 | 1;

export interface DeviceRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  status: DeviceStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DeviceListQuery extends PaginationParams {
  keyword?: string;
  status?: DeviceStatus | '';
  startTime?: string;
  endTime?: string;
}

export interface DeviceCreatePayload {
  deviceId: string;
  deviceName: string;
  deviceType: string;
}

export interface DeviceUpdatePayload {
  deviceName: string;
  deviceType: string;
}
