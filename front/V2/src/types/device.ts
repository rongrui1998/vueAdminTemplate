import type { PaginationParams } from '@/types/api';

export interface DeviceRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  status: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface DeviceListQuery extends PaginationParams {
  keyword?: string;
  status?: number | '';
  startTime?: string;
  endTime?: string;
}

export interface DeviceCreatePayload {
  deviceId: string;
  deviceName: string;
  deviceType: string;
}

export interface DeviceUpdatePayload {
  id: string;
  deviceName: string;
  deviceType: string;
}

export interface DeviceStatusPayload {
  id: string;
  status: number;
}
