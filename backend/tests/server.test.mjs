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

test('menu list includes page and button permission nodes for authorized roles', async () => {
  const app = await startTestServer();

  function collectPermissions(list) {
    const permissions = new Set();

    function walk(items) {
      items.forEach((item) => {
        if (item.permission) {
          permissions.add(item.permission);
        }

        if (item.children?.length) {
          walk(item.children);
        }
      });
    }

    walk(list);
    return permissions;
  }

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

    const menuResponse = await fetch(`${app.baseUrl}/api/menu/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const menuPayload = await menuResponse.json();
    const permissions = collectPermissions(menuPayload.data.list);

    [
      'demo:crud:create',
      'demo:crud:edit',
      'demo:crud:delete',
      'demo:permission:create',
      'demo:permission:export',
      'demo:permission:approve',
      'demo:permission:delete',
      'device:manage:create',
      'device:manage:edit',
      'device:manage:status',
      'device:manage:delete',
    ].forEach((permission) => {
      assert.equal(permissions.has(permission), true, permission);
    });
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
        nameEn: 'Departments',
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
    assert.equal(createdMenu.nameEn, 'Departments');

    const adminMenuResponse = await fetch(`${app.baseUrl}/api/menu/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const adminMenuPayload = await adminMenuResponse.json();

    assert.equal(
      adminMenuPayload.data.list.some((item) =>
        item.children?.some((child) => child.name === '部门管理'),
      ),
      true,
    );

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
        nameEn: 'Department Center',
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

    const listAfterUpdateResponse = await fetch(`${app.baseUrl}/api/system/menus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listAfterUpdatePayload = await listAfterUpdateResponse.json();
    const updatedMenu = listAfterUpdatePayload.data.list[1].children.find(
      (item) => item.id === createdMenu.id,
    );

    assert.ok(updatedMenu);
    assert.equal(updatedMenu.name, '部门组织管理');
    assert.equal(updatedMenu.nameEn, 'Department Center');

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

test('system role endpoints support listing and menu authorization', async () => {
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

    const roleListResponse = await fetch(`${app.baseUrl}/api/system/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const roleListPayload = await roleListResponse.json();

    assert.equal(roleListResponse.status, 200);
    assert.equal(roleListPayload.code, 200);
    assert.equal(roleListPayload.data.list.some((item) => item.id === 'editor'), true);
    assert.equal(typeof roleListPayload.data.list[0].userCount, 'number');

    const updateMenusResponse = await fetch(`${app.baseUrl}/api/system/roles/editor/menus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        menuIds: ['dashboard', 'system-root', 'system-role'],
      }),
    });
    const updateMenusPayload = await updateMenusResponse.json();

    assert.equal(updateMenusResponse.status, 200);
    assert.equal(updateMenusPayload.code, 200);

    const infoResponse = await fetch(`${app.baseUrl}/api/user/info`, {
      headers: {
        Authorization: 'Bearer backend-token-editor',
      },
    });
    const infoPayload = await infoResponse.json();

    assert.equal(infoPayload.data.permissions.includes('system:role:view'), true);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('system user endpoints support listing and role assignment', async () => {
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

    const userListResponse = await fetch(`${app.baseUrl}/api/system/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userListPayload = await userListResponse.json();

    assert.equal(userListResponse.status, 200);
    assert.equal(userListPayload.code, 200);
    assert.equal(userListPayload.data.list.some((item) => item.username === 'editor'), true);
    assert.equal(Array.isArray(userListPayload.data.list[0].roleNames), true);

    const updateResponse = await fetch(`${app.baseUrl}/api/system/users/u-2`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: 'editor',
        nickname: '运营管理员',
        roleIds: ['admin'],
        status: 1,
        remark: '临时提升权限',
      }),
    });
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.code, 200);

    const infoResponse = await fetch(`${app.baseUrl}/api/user/info`, {
      headers: {
        Authorization: 'Bearer backend-token-editor',
      },
    });
    const infoPayload = await infoResponse.json();

    assert.equal(infoPayload.data.permissions.includes('system:menu:view'), true);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('demo import export endpoints preview, confirm, and export csv data', async () => {
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

    const previewResponse = await fetch(`${app.baseUrl}/api/demo/import-export/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        csvText: [
          'name,email,role,status',
          '测试管理员,test-admin@example.com,admin,启用',
          ',broken-email,editor,未知',
        ].join('\n'),
      }),
    });
    const previewPayload = await previewResponse.json();

    assert.equal(previewResponse.status, 200);
    assert.equal(previewPayload.code, 200);
    assert.equal(previewPayload.data.total, 2);
    assert.equal(previewPayload.data.validCount, 1);
    assert.equal(previewPayload.data.invalidCount, 1);
    assert.equal(previewPayload.data.rows[0].valid, true);
    assert.equal(previewPayload.data.rows[1].valid, false);
    assert.equal(previewPayload.data.rows[1].errors.includes('名称不能为空'), true);

    const confirmResponse = await fetch(`${app.baseUrl}/api/demo/import-export/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rows: previewPayload.data.rows.filter((row) => row.valid).map((row) => row.data),
      }),
    });
    const confirmPayload = await confirmResponse.json();

    assert.equal(confirmResponse.status, 200);
    assert.equal(confirmPayload.code, 200);
    assert.equal(confirmPayload.data.importedCount, 1);

    const exportResponse = await fetch(`${app.baseUrl}/api/demo/import-export/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const exportPayload = await exportResponse.json();

    assert.equal(exportResponse.status, 200);
    assert.equal(exportPayload.code, 200);
    assert.match(exportPayload.data.csvText, /name,email,role,status/);
    assert.match(exportPayload.data.csvText, /测试管理员,test-admin@example.com,admin,启用/);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('dashboard statistics endpoint returns summary cards', async () => {
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

    const response = await fetch(`${app.baseUrl}/api/dashboard/statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.code, 200);
    assert.equal(Array.isArray(payload.data.cards), true);
    assert.equal(payload.data.cards.some((item) => item.key === 'users'), true);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('device endpoints support listing, create, update, status, and delete', async () => {
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

    const listResponse = await fetch(`${app.baseUrl}/api/device/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pageNum: 1,
        pageSize: 2,
        keyword: '摄像头',
      }),
    });
    const listPayload = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.code, 200);
    assert.equal(listPayload.data.list.length, 2);
    assert.ok(listPayload.data.total >= 2);

    const createResponse = await fetch(`${app.baseUrl}/api/device/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deviceId: 'DV-20001',
        deviceName: '测试设备',
        deviceType: '摄像头',
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 200);
    assert.equal(createPayload.code, 200);
    assert.equal(createPayload.data.deviceId, 'DV-20001');

    const updateResponse = await fetch(`${app.baseUrl}/api/device/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: createPayload.data.id,
        deviceName: '测试设备更新',
        deviceType: '录像机',
      }),
    });
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.code, 200);
    assert.equal(updatePayload.data.deviceType, '录像机');

    const statusResponse = await fetch(`${app.baseUrl}/api/device/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: createPayload.data.id,
        status: 0,
      }),
    });
    const statusPayload = await statusResponse.json();

    assert.equal(statusResponse.status, 200);
    assert.equal(statusPayload.code, 200);
    assert.equal(statusPayload.data.status, 0);

    const deleteResponse = await fetch(
      `${app.baseUrl}/api/device/delete?id=${createPayload.data.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const deletePayload = await deleteResponse.json();

    assert.equal(deleteResponse.status, 200);
    assert.equal(deletePayload.code, 200);
    assert.equal(deletePayload.data, true);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('device action endpoints stay accessible without device-specific permissions', async () => {
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

    const listResponse = await fetch(`${app.baseUrl}/api/device/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pageNum: 1,
        pageSize: 1,
      }),
    });
    const listPayload = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.code, 200);

    const createResponse = await fetch(`${app.baseUrl}/api/device/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deviceId: 'DV-NO-PERMISSION',
        deviceName: '无权限设备',
        deviceType: '摄像头',
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 200);
    assert.equal(createPayload.code, 200);
    assert.equal(createPayload.data.deviceId, 'DV-NO-PERMISSION');
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('demo user endpoints support CRUD and pagination', async () => {
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

    const listResponse = await fetch(`${app.baseUrl}/api/demo/users?pageNum=1&pageSize=2`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listPayload = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.code, 200);
    assert.equal(listPayload.data.list.length, 2);
    assert.equal(typeof listPayload.data.total, 'number');

    const createResponse = await fetch(`${app.baseUrl}/api/demo/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '测试账号',
        email: 'demo-user@example.com',
        role: '测试角色',
        department: '质量中心',
        status: 1,
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 200);
    assert.equal(createPayload.code, 200);
    assert.equal(createPayload.data.email, 'demo-user@example.com');

    const detailResponse = await fetch(`${app.baseUrl}/api/demo/users/${createPayload.data.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const detailPayload = await detailResponse.json();

    assert.equal(detailResponse.status, 200);
    assert.equal(detailPayload.data.name, '测试账号');

    const updateResponse = await fetch(`${app.baseUrl}/api/demo/users/${createPayload.data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '测试账号更新',
        email: 'demo-user@example.com',
        role: '测试角色',
        department: '质量中心',
        status: 0,
      }),
    });
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.data.status, 0);

    const deleteResponse = await fetch(`${app.baseUrl}/api/demo/users/${createPayload.data.id}`, {
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

test('business template endpoints support listing, create, detail, update, and delete', async () => {
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

    const listResponse = await fetch(`${app.baseUrl}/api/demo/business-templates?keyword=客户`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listPayload = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.code, 200);
    assert.equal(listPayload.data.list.some((item) => item.name === '客户资料维护'), true);

    const createResponse = await fetch(`${app.baseUrl}/api/demo/business-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '合同模板维护',
        owner: '法务中台',
        scene: '合同管理',
        status: 1,
        remark: '接口创建的业务模板',
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 200);
    assert.equal(createPayload.code, 200);
    assert.equal(createPayload.data.name, '合同模板维护');

    const detailResponse = await fetch(
      `${app.baseUrl}/api/demo/business-templates/${createPayload.data.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const detailPayload = await detailResponse.json();

    assert.equal(detailResponse.status, 200);
    assert.equal(detailPayload.data.owner, '法务中台');

    const updateResponse = await fetch(
      `${app.baseUrl}/api/demo/business-templates/${createPayload.data.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: '合同配置维护',
          owner: '法务中台',
          scene: '合同管理',
          status: 0,
          remark: '已停用',
        }),
      },
    );
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.data.status, 0);

    const deleteResponse = await fetch(
      `${app.baseUrl}/api/demo/business-templates/${createPayload.data.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const deletePayload = await deleteResponse.json();

    assert.equal(deleteResponse.status, 200);
    assert.equal(deletePayload.code, 200);
  } finally {
    await app.close();
    await app.cleanup();
  }
});

test('business template endpoints enforce action permissions for customer accounts', async () => {
  const app = await startTestServer();

  try {
    const loginResponse = await fetch(`${app.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'rongrui',
        password: '123456',
      }),
    });
    const loginPayload = await loginResponse.json();
    const token = loginPayload.data.token;

    const listResponse = await fetch(`${app.baseUrl}/api/demo/business-templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listPayload = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.code, 200);

    const createResponse = await fetch(`${app.baseUrl}/api/demo/business-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '客服新建模板',
        owner: '客服中心',
        scene: '客服场景',
        status: 1,
        remark: '不应允许创建',
      }),
    });
    const createPayload = await createResponse.json();

    assert.equal(createResponse.status, 403);
    assert.equal(createPayload.code, 403);

    const updateResponse = await fetch(`${app.baseUrl}/api/demo/business-templates/tpl-1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '客户资料维护',
        owner: '业务中台',
        scene: '基础资料',
        status: 0,
        remark: '不应允许修改',
      }),
    });
    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 403);
    assert.equal(updatePayload.code, 403);

    const deleteResponse = await fetch(`${app.baseUrl}/api/demo/business-templates/tpl-1`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const deletePayload = await deleteResponse.json();

    assert.equal(deleteResponse.status, 403);
    assert.equal(deletePayload.code, 403);
  } finally {
    await app.close();
    await app.cleanup();
  }
});
