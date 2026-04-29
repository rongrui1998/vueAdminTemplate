import crypto from 'node:crypto';
import { readJson, writeJson } from '../utils/json.js';

const DATA_FILE = 'business-templates.json';

function formatNow() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function normalizePayload(data = {}) {
  return {
    name: String(data.name || '').trim(),
    owner: String(data.owner || '').trim() || '未分配',
    scene: String(data.scene || '').trim() || '通用业务',
    status: Number(data.status ?? 1),
    remark: String(data.remark || '').trim(),
  };
}

async function readTemplates() {
  return readJson(DATA_FILE);
}

async function writeTemplates(list) {
  await writeJson(DATA_FILE, list);
}

export async function getBusinessTemplates(query = {}) {
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const status = query.status;
  let list = await readTemplates();

  if (keyword) {
    list = list.filter((item) =>
      [item.name, item.owner, item.scene].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }

  if (status !== undefined && status !== '') {
    list = list.filter((item) => Number(item.status) === Number(status));
  }

  return list;
}

export async function getBusinessTemplateDetail(id) {
  const list = await readTemplates();
  const item = list.find((record) => record.id === id);

  if (!item) {
    throw new Error('业务模板不存在');
  }

  return item;
}

export async function createBusinessTemplate(payload) {
  const list = await readTemplates();
  const normalized = normalizePayload(payload);

  if (!normalized.name) {
    throw new Error('业务名称不能为空');
  }

  const item = {
    id: `tpl-${crypto.randomUUID()}`,
    ...normalized,
    updatedAt: formatNow(),
  };

  list.unshift(item);
  await writeTemplates(list);
  return item;
}

export async function updateBusinessTemplate(id, payload) {
  const list = await readTemplates();
  const index = list.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('业务模板不存在');
  }

  const normalized = normalizePayload({
    ...list[index],
    ...payload,
  });
  const item = {
    ...list[index],
    ...normalized,
    updatedAt: formatNow(),
  };

  list.splice(index, 1, item);
  await writeTemplates(list);
  return item;
}

export async function deleteBusinessTemplate(id) {
  const list = await readTemplates();
  const index = list.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('业务模板不存在');
  }

  list.splice(index, 1);
  await writeTemplates(list);
  return true;
}
