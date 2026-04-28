# Backend

最小 Node.js 后端，用于配合 `front/V2` 验证真实账号、角色、菜单、权限链路。

## 启动

```bash
cd backend
npm install
npm run dev
```

默认端口：

```text
http://127.0.0.1:3100
```

## 当前接口

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/user/info`
- `GET /api/menu/list`
- `GET /api/system/menus`
- `POST /api/system/menus`
- `PUT /api/system/menus/:id`
- `DELETE /api/system/menus/:id`
- `GET /api/system/roles`
- `POST /api/system/roles`
- `PUT /api/system/roles/:id`
- `DELETE /api/system/roles/:id`
- `PUT /api/system/roles/:id/menus`
- `GET /api/system/users`
- `POST /api/system/users`
- `PUT /api/system/users/:id`
- `DELETE /api/system/users/:id`
- `PUT /api/system/users/:id/password`

## 前端切换真实接口

`front/V2` 使用下面组合连接本后端：

```bash
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3100
VITE_USE_MOCK=false
VITE_MENU_SOURCE=api
VITE_STANDARD_DATA_SOURCE=api
```

开发环境由 Vite 代理 `/api` 到 `VITE_BACKEND_TARGET`，所以浏览器里仍然访问前端端口即可。
