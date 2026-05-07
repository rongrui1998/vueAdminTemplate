# Mock 与接口说明

## 环境变量

- `VITE_API_BASE_URL`：接口基础路径
- `VITE_BACKEND_TARGET`：开发环境代理到本地后端的目标地址
- `VITE_USE_MOCK`：是否启用 vite mock
- `VITE_MENU_SOURCE`：菜单来源切换
- `VITE_STANDARD_DATA_SOURCE`：Standard 模块数据来源切换

推荐先从 `.env.example` 复制环境模板：

```bash
cp .env.example .env.local
```

## 当前模式

### 1. mock 模式

- `VITE_USE_MOCK=true`
- `VITE_MENU_SOURCE=mock`
- 适合本地联调流程验证

### 2. static 菜单模式

- `VITE_MENU_SOURCE=static`
- 菜单不经过网络请求，直接读取本地菜单数据
- 适合快速排查菜单渲染问题

### 3. api 模式

- `VITE_MENU_SOURCE=api`
- 菜单走真实后端接口
- 建议同时设置 `VITE_USE_MOCK=false`
- Standard 模块同时建议设置 `VITE_STANDARD_DATA_SOURCE=api`

## mock 文件位置

- `src/mock/modules/auth.ts`：登录与退出
- `src/mock/modules/user.ts`：用户信息
- `src/mock/modules/menu.ts`：菜单接口
- `src/mock/modules/system-menu.ts`：菜单管理 CRUD 接口
- `src/mock/modules/dashboard.ts`：首页统计
- `src/mock/modules/demo.ts`：CRUD 示例接口
- `src/mock/data/menus.ts`：本地菜单数据
- `src/mock/data/system-menu.ts`：标准版菜单管理树数据

## 菜单管理说明

`系统管理 -> 菜单管理` 当前已经支持：

- 树形表格展示目录 / 菜单 / 按钮
- 新增菜单
- 新增下级
- 修改菜单
- 删除菜单

在 `mock` 模式下，这套 CRUD 会直接走 `src/mock/modules/system-menu.ts`。  
切到 `api` 模式后，对应走本地 Node.js 后端的：

- `GET /api/system/menus`
- `POST /api/system/menus`
- `PUT /api/system/menus/:id`
- `DELETE /api/system/menus/:id`

## request 层约定

统一返回结构：

- `code`
- `msg`
- `data`
- `tip`

列表接口通常使用：

- `data.total`
- `data.list`

请求层统一负责：

- token 注入
- 401 处理
- 业务 code 判断
- 错误提示

## 推荐联读

- `07-base-overview-and-usage.md`
- `08-backend-integration-contract.md`
