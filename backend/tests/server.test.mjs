import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDataDir = path.resolve(__dirname, '../data');

async function startTestServer() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vue-admin-backend-'));
  const dataDir = path.join(tempDir, 'data');
  await fs.cp(sourceDataDir, dataDir, { recursive: true });
  process.env.BACKEND_DATA_DIR = dataDir;

  const server = createServer();

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }),
    cleanup: () => fs.rm(tempDir, { recursive: true, force: true }),
  };
}

test('login returns a token for valid credentials', async () => {
  const app = await startTestServer();

  try {
    const response = await fetch(`${app.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456',
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.code, 200);
    assert.equal(typeof payload.data.token, 'string');
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('menu list is filtered by the authenticated account roles', async () => {
  const app = await startTestServer();

  try {
    const loginResponse = await fetch(`${app.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'editor',
        password: '123456',
      }),
    });
    const loginPayload = await loginResponse.json();
    const token = loginPayload.data.token;

    const menuResponse = await fetch(`${app.baseUrl}/api/menu/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const menuPayload = await menuResponse.json();

    assert.equal(menuResponse.status, 200);
    assert.equal(menuPayload.code, 200);
    assert.equal(menuPayload.data.list.some((item) => item.id === 'system-root'), false);
    assert.equal(menuPayload.data.list.some((item) => item.id === 'demo-root'), true);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('system menu endpoints support create, update, and delete', async () => {
  const app = await startTestServer();

  try {
    const loginResponse = await fetch(`${app.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456',
      }),
    });
    const loginPayload = await loginResponse.json();
    const token = loginPayload.data.token;

    const createResponse = await fetch(`${app.baseUrl}/api/system/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parentId: 'system-root',
        type: 'menu',
        name: '部门管理',
        path: '/system/dept',
        component: 'system/dept/index',
        permission: 'system:dept:view',
        icon: 'Document',
        sort: 9,
        status: 1,
        hidden: false,
        keepAlive: true,
        affix: false,
        remark: '部门管理页面',
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 200);
    assert.equal(createPayload.code, 200);

    const listAfterCreateResponse = await fetch(`${app.baseUrl}/api/system/menus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listAfterCreatePayload = await listAfterCreateResponse.json();
    const createdMenu = listAfterCreatePayload.data.list[1].children.find((item) => item.name === '部门管理');

    assert.ok(createdMenu);

    const updateResponse = await fetch(`${app.baseUrl}/api/system/menus/${createdMenu.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parentId: 'system-root',
        type: 'menu',
        name: '部门组织管理',
        path: '/system/dept',
        component: 'system/dept/index',
        permission: 'system:dept:view',
        icon: 'Document',
        sort: 9,
        status: 1,
        hidden: false,
        keepAlive: true,
        affix: false,
        remark: '更新后的部门管理页面',
      }),
    });
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.code, 200);

    const deleteResponse = await fetch(`${app.baseUrl}/api/system/menus/${createdMenu.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const deletePayload = await deleteResponse.json();

    assert.equal(deleteResponse.status, 200);
    assert.equal(deletePayload.code, 200);
  } finally {
    await app.close();
    await app.cleanup();
  }
});
