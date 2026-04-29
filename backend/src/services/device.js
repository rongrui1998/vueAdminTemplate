import crypto from 'node:crypto';
import { readJson, writeJson } from '../utils/json.js';

const DATA_FILE = 'devices.json';

function formatNow() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function toTimestamp(value) {
  const text = String(value || '').trim();

  if (!text) {
    return NaN;
  }

  const normalized = text.includes('T') ? text : text.replace(' ', 'T');
  return Number.isNaN(Date.parse(normalized)) ? NaN : Date.parse(normalized);
}

function normalizePayload(payload = {}, fallback = {}) {
  return {
    deviceId: String(payload.deviceId ?? fallback.deviceId ?? '').trim(),
    deviceName: String(payload.deviceName ?? fallback.deviceName ?? '').trim(),
    deviceType: String(payload.deviceType ?? fallback.deviceType ?? '').trim(),
    status: Number(payload.status ?? fallback.status ?? 1),
    createdBy: String(payload.createdBy ?? fallback.createdBy ?? 'system').trim() || 'system',
    updatedBy: String(payload.updatedBy ?? fallback.updatedBy ?? 'system').trim() || 'system',
  };
}

async function readDevices() {
  return readJson(DATA_FILE);
}

async function writeDevices(list) {
  await writeJson(DATA_FILE, list);
}

function matchesKeyword(item, keyword) {
  if (!keyword) {
    return true;
  }

  const target = keyword.toLowerCase();
  return [item.id, item.deviceId, item.deviceName, item.deviceType, item.createdBy, item.updatedBy]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(target));
}

function withinRange(item, startTime, endTime) {
  const createdAt = toTimestamp(item.createdAt);
  const start = toTimestamp(startTime);
  const end = toTimestamp(endTime);

  if (Number.isNaN(createdAt)) {
    return false;
  }

  if (!Number.isNaN(start) && createdAt < start) {
    return false;
  }

  if (!Number.isNaN(end) && createdAt > end) {
    return false;
  }

  return true;
}

export async function getDeviceList(query = {}) {
  const pageNum = Math.max(Number(query.pageNum || 1), 1);
  const pageSize = Math.max(Number(query.pageSize || 10), 1);
  const keyword = String(query.keyword || '').trim();
  const status = query.status;
  const startTime = query.startTime || '';
  const endTime = query.endTime || '';
  let list = await readDevices();

  list = list.filter((item) => matchesKeyword(item, keyword));

  if (status !== undefined && status !== '') {
    list = list.filter((item) => Number(item.status) === Number(status));
  }

  if (startTime || endTime) {
    list = list.filter((item) => withinRange(item, startTime, endTime));
  }

  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  return {
    total: list.length,
    list: list.slice(start, end),
  };
}

export async function createDevice(payload = {}) {
  const list = await readDevices();
  const normalized = normalizePayload(payload);

  if (!normalized.deviceId) {
    throw new Error('设备编号不能为空');
  }

  if (!normalized.deviceName) {
    throw new Error('设备名称不能为空');
  }

  if (!normalized.deviceType) {
    throw new Error('设备类型不能为空');
  }

  if (list.some((item) => item.deviceId === normalized.deviceId)) {
    throw new Error('设备编号已存在');
  }

  const now = formatNow();
  const item = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  list.unshift(item);
  await writeDevices(list);
  return item;
}

export async function updateDevice(id, payload = {}) {
  const list = await readDevices();
  const index = list.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('设备不存在');
  }

  const normalized = normalizePayload(
    {
      deviceId: list[index].deviceId,
      deviceName: list[index].deviceName,
      deviceType: list[index].deviceType,
      status: list[index].status,
      createdBy: list[index].createdBy,
      updatedBy: list[index].updatedBy,
      ...payload,
    },
    list[index],
  );

  if (!normalized.deviceName) {
    throw new Error('设备名称不能为空');
  }

  if (!normalized.deviceType) {
    throw new Error('设备类型不能为空');
  }

  const item = {
    ...list[index],
    ...normalized,
    updatedAt: formatNow(),
  };

  list.splice(index, 1, item);
  await writeDevices(list);
  return item;
}

export async function deleteDevice(id) {
  const list = await readDevices();
  const index = list.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('设备不存在');
  }

  list.splice(index, 1);
  await writeDevices(list);
  return true;
}

export async function updateDeviceStatus(id, payload = {}) {
  const list = await readDevices();
  const item = list.find((record) => record.id === id);

  if (!item) {
    throw new Error('设备不存在');
  }

  const nextStatus = Number(payload.status);

  if (![0, 1].includes(nextStatus)) {
    throw new Error('状态值非法');
  }

  item.status = nextStatus;
  item.updatedAt = formatNow();
  item.updatedBy = String(payload.updatedBy || item.updatedBy || 'system').trim() || 'system';

  await writeDevices(list);
  return item;
}
