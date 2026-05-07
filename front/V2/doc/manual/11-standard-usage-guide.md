# V2 Standard 使用手册

## 1. 文档定位

这份文档是 `front/V2` 的 Standard 总入口，适合用于：

- 新成员接手项目
- 本地演示 V2 Standard 能力
- 从 mock 模式切到 API 模式
- 基于模板复制新业务页面
- 交付前确认当前能力边界

如果只想快速跑起来，先看第 2 节和第 3 节。如果要做二开，重点看第 5 节到第 8 节。

## 2. 当前版本定位

`front/V2` 当前是 Vue 后台模板的 Standard 工作区。

它已经具备：

- Base 主链路：登录、布局、动态菜单、动态路由、权限、标签页、主题、错误页。
- Standard 管理能力：用户管理、角色管理、菜单管理。
- Standard 业务示例：CRUD、权限示例、组件示例、导入导出、标准业务模板。
- mock/API 双模式：前端 mock 可演示，Node JSON 后端可验证真实闭环。
- 右侧固定设置抽屉：主题、布局密度、标签栏显示、页面缓存偏好。

暂不包含：

- 上传组件封装。
- 操作日志 / 权限审计。
- 字典管理。
- 数据权限体系。
- 复杂异步导入任务。

## 3. 快速启动

前端：

```bash
cd front/V2
pnpm install
pnpm dev
```

后端：

```bash
cd backend
npm install
npm run dev
```

常用账号：

- `admin / 123456`：完整权限。
- `editor / 123456`：运营编辑权限，用于验证菜单和按钮收缩。

## 4. 环境模式

### 4.1 Mock 模式

适合纯前端演示和页面开发。

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3100
VITE_USE_MOCK=true
VITE_MENU_SOURCE=mock
VITE_STANDARD_DATA_SOURCE=mock
```

### 4.2 API 模式

适合验证真实登录、角色、菜单、权限、导入导出闭环。

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3100
VITE_USE_MOCK=false
VITE_MENU_SOURCE=api
VITE_STANDARD_DATA_SOURCE=api
```

API 模式需要先启动 `backend`，再启动 `front/V2`。当前 backend 已覆盖登录、用户信息、动态菜单、首页统计、系统管理、CRUD 示例、导入导出和标准业务模板接口。

## 5. 功能地图

### 首页

- 统计卡片。
- 快捷入口。
- 系统状态。
- 版本定位和数据模式信息。
- API 模式下优先读取 `/api/dashboard/statistics`，接口异常时回退到静态统计数据。

### 系统管理

- 用户管理：列表、新增、编辑、删除、启停用、重置密码、角色绑定。
- 角色管理：列表、新增、编辑、删除、启停用、菜单/按钮权限分配。
- 菜单管理：目录、菜单、按钮节点维护。

### 业务示例

- CRUD 示例：标准增删改查、详情抽屉、权限按钮。
- 权限示例：页面权限、按钮权限、组合式权限。
- 组件示例：`SearchForm`、`ProTable`、`ModalForm`、`DrawerForm`。
- 导入导出示例：CSV 预览校验、确认导入、CSV 导出，支持 mock/API 闭环。
- 标准业务模板：可复制的标准列表页骨架，默认走 mock，API 模式走 `/api/demo/business-templates`。
- CRUD 示例：默认走 mock，API 模式走 `/api/demo/users`。
- 多级菜单：动态路由和菜单层级示例。

### 右侧设置抽屉

任意后台页面右侧有固定设置按钮，点击后打开设置抽屉。

当前支持：

- 主题模式。
- 布局密度。
- 标签栏显示/隐藏。
- 页面缓存启用/关闭。

这些偏好存储在浏览器本地，不依赖后端。

## 6. 新页面接入规则

新增动态菜单页面时，需要同步：

- `front/V2/src/mock/data/menus.ts`
- `front/V2/src/mock/data/system-menu.ts`
- `front/V2/src/mock/data/system-role.ts`
- `backend/data/menus.json`
- `backend/data/roles.json`
- 真实视图文件：`front/V2/src/views/**`

`component` 字段必须对应真实视图路径，不带 `.vue`。

示例：

```ts
component: 'demo/business-template/index';
```

对应：

```text
front/V2/src/views/demo/business-template/index.vue
```

如果路径写错，页面会进入 `route-missing`，用于提示动态路由配置异常。

## 7. 组件使用建议

优先复用：

- `SearchForm`：常规查询区。
- `ProTable`：表格外壳、loading、empty、error、retry。
- `ModalForm`：新增/编辑弹窗。
- `DrawerForm`：详情、预览、复杂编辑侧栏。

复杂交互不必强行套封装，可以直接使用 Element Plus。

推荐复制入口：

```text
front/V2/src/views/demo/business-template/index.vue
```

## 8. API 模式联调重点

API 模式下重点验证：

- 登录是否返回 token。
- `/api/user/info` 是否返回角色和权限。
- `/api/menu/list` 是否按角色返回菜单。
- 用户、角色、菜单管理是否能读写 JSON 数据。
- 角色授权后重新登录或刷新用户信息，权限是否变化。
- 导入导出是否走后端接口。
- 标准业务模板是否走后端接口完成列表、详情、新增和状态更新。

后端数据目录：

```text
backend/data
```

## 9. 质量门槛

前端建议执行：

```bash
cd front/V2
pnpm test
pnpm lint
pnpm stylelint
pnpm build
```

后端建议执行：

```bash
cd backend
npm test
```

已知非阻塞提示：

- `stylelint` 可能出现 Node JSON module experimental warning。
- `build` 可能出现 Sass legacy JS API warning。

命令退出码为 0 时，当前视为通过。
