# Backend

最小 Node.js 后端，用于配合 `front/V2` 验证真实账号、角色、菜单、权限链路。

## 启动

```bash
cd backend
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
