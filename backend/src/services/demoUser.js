import { readJson, writeJson } from '../utils/json.js';

const DATA_FILE = 'demo-users.json';

function formatNow() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function normalizePayload(payload = {}) {
  return {
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    role: String(payload.role || '').trim(),
    department: String(payload.department || '').trim(),
    status: Number(payload.status ?? 1),
  };
}

async function readDemoUsers() {
  return readJson(DATA_FILE);
}

async function writeDemoUsers(list) {
  await writeJson(DATA_FILE, list);
}

export async function getDemoUsers(query = {}) {
  const pageNum = Math.max(Number(query.pageNum || 1), 1);
  const pageSize = Math.max(Number(query.pageSize || 10), 1);
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const status = query.status;
  let list = await readDemoUsers();

  if (keyword) {
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword),
    );
  }

  if (status !== undefined && status !== '') {
    list = list.filter((item) => Number(item.status) === Number(status));
  }

  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  return {
    total: list.length,
    list: list.slice(start, end),
  };
}

export async function getDemoUserDetail(id) {
  const list = await readDemoUsers();
  const item = list.find((user) => user.id === id);

  if (!item) {
    throw new Error('账号不存在');
  }

  return item;
}

export async function createDemoUser(payload) {
  const list = await readDemoUsers();
  const normalized = normalizePayload(payload);

  if (!normalized.name) {
    throw new Error('姓名不能为空');
  }

  if (!normalized.email) {
    throw new Error('邮箱不能为空');
  }

  const item = {
    id: String(Date.now()),
    ...normalized,
    createdAt: formatNow(),
  };

  list.unshift(item);
  await writeDemoUsers(list);
  return item;
}

export async function updateDemoUser(id, payload) {
  const list = await readDemoUsers();
  const index = list.findIndex((user) => user.id === id);

  if (index < 0) {
    throw new Error('账号不存在');
  }

  const item = {
    ...list[index],
    ...normalizePayload({
      ...list[index],
      ...payload,
    }),
  };

  list.splice(index, 1, item);
  await writeDemoUsers(list);
  return item;
}

export async function deleteDemoUser(id) {
  const list = await readDemoUsers();
  const index = list.findIndex((user) => user.id === id);

  if (index < 0) {
    throw new Error('账号不存在');
  }

  list.splice(index, 1);
  await writeDemoUsers(list);
  return true;
}
