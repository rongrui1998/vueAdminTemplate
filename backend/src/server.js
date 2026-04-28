import http from 'node:http';
import { URL } from 'node:url';
import { buildUserAccessPayload, findUserByCredentials, findUserByToken } from './services/auth.js';
import {
  createSystemMenu,
  deleteSystemMenu,
  getAllSystemMenus,
  getMenuListForRoleIds,
  updateSystemMenu,
} from './services/menu.js';
import {
  createSystemRole,
  deleteSystemRole,
  getSystemRoles,
  updateSystemRole,
  updateSystemRoleMenus,
} from './services/role.js';
import {
  createSystemUser,
  deleteSystemUser,
  getSystemUsers,
  resetSystemUserPassword,
  updateSystemUser,
} from './services/user.js';

function success(data) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function fail(code, msg, tip = msg) {
  return {
    code,
    msg,
    data: null,
    time: new Date().toISOString(),
    tip,
  };
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, success(true));
    return;
  }

  const url = new URL(request.url, 'http://127.0.0.1');

  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readBody(request);
    const user = await findUserByCredentials(body.username, body.password);

    if (!user) {
      sendJson(response, 401, fail(401, '账号或密码错误', '登录失败'));
      return;
    }

    sendJson(response, 200, success({ token: user.token }));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    sendJson(response, 200, success(true));
    return;
  }

  const authUser = await findUserByToken(request.headers);

  if (!authUser) {
    sendJson(response, 401, fail(401, '登录状态已失效', '请重新登录'));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/user/info') {
    sendJson(response, 200, success(await buildUserAccessPayload(authUser)));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/menu/list') {
    const list = await getMenuListForRoleIds(authUser.roleIds);
    sendJson(response, 200, success({ total: list.length, list }));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/system/menus') {
    const list = await getAllSystemMenus();
    sendJson(response, 200, success({ total: list.length, list }));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/system/menus') {
    await createSystemMenu(await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'PUT' && url.pathname.startsWith('/api/system/menus/')) {
    const id = url.pathname.split('/').pop();
    await updateSystemMenu(id, await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/api/system/menus/')) {
    const id = url.pathname.split('/').pop();
    await deleteSystemMenu(id);
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/system/roles') {
    const list = await getSystemRoles(url.searchParams.get('keyword') || '');
    sendJson(response, 200, success({ total: list.length, list }));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/system/roles') {
    await createSystemRole(await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'PUT' && url.pathname.endsWith('/menus')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2];
    const body = await readBody(request);
    await updateSystemRoleMenus(id, body.menuIds || []);
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'PUT' && url.pathname.startsWith('/api/system/roles/')) {
    const id = url.pathname.split('/').pop();
    await updateSystemRole(id, await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/api/system/roles/')) {
    const id = url.pathname.split('/').pop();
    await deleteSystemRole(id);
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/system/users') {
    const list = await getSystemUsers(url.searchParams.get('keyword') || '');
    sendJson(response, 200, success({ total: list.length, list }));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/system/users') {
    await createSystemUser(await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'PUT' && url.pathname.endsWith('/password')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2];
    const body = await readBody(request);
    await resetSystemUserPassword(id, body.password || '123456');
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'PUT' && url.pathname.startsWith('/api/system/users/')) {
    const id = url.pathname.split('/').pop();
    await updateSystemUser(id, await readBody(request));
    sendJson(response, 200, success(true));
    return;
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/api/system/users/')) {
    const id = url.pathname.split('/').pop();
    await deleteSystemUser(id);
    sendJson(response, 200, success(true));
    return;
  }

  sendJson(response, 404, fail(404, '接口不存在'));
}

export function createServer() {
  return http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      sendJson(response, 500, fail(500, error instanceof Error ? error.message : '服务器异常'));
    });
  });
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  const port = Number(process.env.PORT || 3100);
  createServer().listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`backend listening on http://127.0.0.1:${port}`);
  });
}
