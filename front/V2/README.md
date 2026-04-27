# V2 Standard Admin

基于 `Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus` 的后台管理基础模板。

当前 `front/V2` 的定位是 **Standard 版本工作目录**。

它已经继承了 `V3 Base` 的完整基础能力，当前阶段的目标是在这套基线上继续实现 Standard 版本功能，而不是重新搭建一份基础模板。

## 快速开始

推荐使用 `pnpm`。

```bash
cd front/V2
cp .env.example .env.local
pnpm install
pnpm dev
```

本地默认访问地址通常为：

```text
http://localhost:5174
```

演示账号：

- `admin / 123456`
- `editor / 123456`

## 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm type-check
pnpm lint
pnpm stylelint
pnpm test
pnpm format
```

当前目录继承了和 `V3 Base` 相同的基础质量门槛，本地建议保持以下校验：

- `pnpm lint`
- `pnpm stylelint`
- `pnpm test`
- `pnpm build`

## 当前继承能力范围

- 登录、退出登录、401 统一处理
- 用户信息获取与本地持久化
- 动态菜单、动态路由、动态路由恢复
- 页面级权限校验
- 按钮级权限指令 `v-permission`
- 权限组合式 API `usePermission()`
- 权限示例页（支持 `admin / editor` 差异演示）
- 左侧菜单、顶部导航、面包屑、标签页
- 明暗主题、全屏切换、消息通知面板
- mock 登录链路、mock 菜单、mock CRUD
- 基础测试护栏：路由、请求层、mock 契约

## 环境变量

当前项目主要使用以下变量：

| 变量名                      | 说明                  | 默认值                  |
| --------------------------- | --------------------- | ----------------------- |
| `VITE_APP_TITLE`            | 页面标题前缀          | `Vue Admin Template`    |
| `VITE_API_BASE_URL`         | 请求基础路径          | `/api`                  |
| `VITE_BACKEND_TARGET`       | 本地后端目标地址      | `http://127.0.0.1:3100` |
| `VITE_USE_MOCK`             | 是否启用本地 mock     | `true`                  |
| `VITE_MENU_SOURCE`          | 菜单来源模式          | `mock`                  |
| `VITE_STANDARD_DATA_SOURCE` | Standard 模块数据来源 | `mock`                  |

推荐先复制一份环境模板：

```bash
cp .env.example .env.local
```

## 登录与权限链路

1. 登录页提交账号密码。
2. 登录成功后写入 token。
3. 全局守卫拉取用户信息。
4. 权限模块拉取菜单并生成动态路由。
5. 页面级权限通过 `route.meta.permission` 兜底校验。
6. 局部按钮和操作区通过 `v-permission` 或 `usePermission()` 控制。
7. 无权限页面跳转 `403`，未知页面跳转 `404`。

## 如何新增页面

1. 在 `src/views/` 下创建页面组件。
2. 在 `src/mock/data/menus.ts` 或真实后端菜单里补菜单节点。
3. 保证菜单 `component` 与 `src/views` 相对路径一致，不带 `.vue`。
4. 页面标题使用 `name`，页面权限码写在 `permission`。
5. 页面内需要按钮权限时，使用：

```vue
<el-button v-permission="'demo:crud:create'">新增</el-button>
```

或：

```ts
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
```

## 文档入口

更细的实现说明在 `doc/` 目录：

- `doc/10-standard-roadmap.md`
- `doc/07-base-overview-and-usage.md`
- `doc/00-base-completion-summary.md`
- `doc/02-menu-and-routing.md`
- `doc/03-permission-and-auth.md`
- `doc/04-mock-and-api.md`
- `doc/05-page-and-component-conventions.md`
- `doc/06-extension-suggestions.md`
- `doc/08-backend-integration-contract.md`
- `doc/plans/2026-04-27-v2-standard-design.md`
- `doc/plans/2026-04-27-v2-standard-plan.md`
- `doc/plans/2026-04-27-v2-menu-management-design.md`
- `doc/plans/2026-04-27-v2-menu-management-plan.md`

## Standard 方向

当前建议优先推进：

- 用户/角色/菜单管理
- 先完成菜单管理的树表格与 CRUD 闭环，再向角色/用户授权联动推进
- 更完整的权限模型
- 字典能力
- 更完整的通用业务组件封装
- 上传、导入导出、操作日志等标准能力
