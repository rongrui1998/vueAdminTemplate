# Base 版本功能总览与使用说明

## 1. 文档定位

这份文档用于统一说明 `front/V3` 当前 Base 版本的：

- 功能能力边界
- 启动与使用方式
- 菜单、权限、mock、路由的基本工作方式
- 新页面接入流程
- 使用时需要注意的事项

如果你是第一次接手这个项目，建议按下面顺序阅读：

1. 先看本文件，建立整体认知
2. 再看 `00-base-completion-summary.md`，确认当前 Base 已完成范围
3. 如果想确认当前是否已达到定版交付状态，再看 `09-base-release-notes.md`
4. 如果要接真实后端，再看 `08-backend-integration-contract.md`
5. 按需深入 `02 ~ 05` 这几份分章节文档

## 2. Base 版本是什么

`front/V3` 的定位是一个 **可复用的后台管理基础模板**。

它不是一个完整业务系统，也不是一个已经做完用户/角色/菜单管理后台的 Standard 平台，而是一个可以直接拿来做新项目起步的 Base 工程。

当前 Base 版本强调 4 件事：

- 能启动
- 能演示
- 能复用
- 能说明白

## 3. 当前已具备的能力

### 3.1 基础工程能力

- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- Vue Router 路由体系
- Element Plus 组件体系
- SCSS 样式组织
- ESLint / Prettier / Stylelint
- Vitest 基础测试
- Husky + lint-staged 提交前校验
- GitHub Actions 基础 CI

### 3.2 布局与导航能力

- 左侧菜单栏
- 顶部导航栏
- 面包屑导航
- 标签页导航
- 左侧和顶部固定，中间内容区独立滚动
- 明暗主题切换
- 全屏切换
- 消息通知面板

### 3.3 登录与权限能力

- 登录页
- token 存储与恢复
- 登录态守卫
- 用户信息拉取
- 菜单级权限控制
- 页面级权限兜底
- 按钮级权限指令 `v-permission`
- 权限组合式 API `usePermission()`
- `403 / 404` 错误页分流

### 3.4 菜单与动态路由能力

- 登录后拉菜单
- 动态生成路由
- 多级菜单支持
- 菜单来源切换：`api / mock / static`
- 缺失页面组件时降级到 `route-missing`
- 刷新后动态路由恢复

### 3.5 示例页面能力

当前 Base 内置了几类示例页面：

- `首页`：基础欢迎页与统计展示
- `CRUD 示例`：查询、表格、分页、弹窗表单、抽屉详情、空态、异常态、重试
- `权限示例`：`admin / editor` 权限差异、按钮权限、组合式权限用法
- `多级菜单`：二级目录、标签联动、面包屑联动

## 4. 适用场景

当前 Base 适合：

- 团队内部后台项目快速起步
- 新成员熟悉后台模板结构
- 本地 mock 联调和前端先行开发
- 后续继续演进成 Standard 版本

当前 Base 不适合直接承担：

- 完整 RBAC 平台
- 用户/角色/菜单管理后台
- 数据权限体系
- 高度定制化低代码平台能力

## 5. 快速开始

### 5.1 安装与启动

```bash
cd front/V3
cp .env.example .env.local
pnpm install
pnpm dev
```

默认本地地址通常为：

```text
http://localhost:5174
```

### 5.2 常用命令

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

### 5.3 演示账号

- `admin / 123456`
- `editor / 123456`

推荐验证方式：

- 用 `admin` 查看完整功能
- 用 `editor` 查看权限收缩后的页面和按钮表现

## 6. 环境变量说明

当前项目常用环境变量如下：

- `VITE_APP_TITLE`：页面标题前缀
- `VITE_API_BASE_URL`：请求基础路径
- `VITE_USE_MOCK`：是否启用 vite mock
- `VITE_MENU_SOURCE`：菜单来源，支持 `api / mock / static`

建议优先复制模板文件：

```bash
cp .env.example .env.local
```

常见组合：

- 本地演示：`VITE_USE_MOCK=true` + `VITE_MENU_SOURCE=mock`
- 菜单排查：`VITE_MENU_SOURCE=static`
- 对接后端：`VITE_MENU_SOURCE=api`

## 7. 主要工作链路

### 7.1 登录与进入页面

1. 登录页提交账号密码
2. 登录成功后写入 token
3. 路由守卫检查登录态
4. 拉取用户信息
5. 拉取菜单并生成动态路由
6. 校验页面权限
7. 渲染页面并同步标签页

### 7.2 页面权限与按钮权限

当前权限分为两层：

- 页面权限：通过菜单项 `permission` 写入路由 `meta.permission`
- 按钮权限：通过 `v-permission` 或 `usePermission()` 控制

补充说明：

- 菜单可见性和页面可访问性不是完全等价的
- 某些无权限页面会以隐藏路由形式注入
- 这样用户手动输入地址时会进入 `403`，而不是被误判成 `404`

示例：

```vue
<el-button v-permission="'demo:crud:create'">新增账号</el-button>
```

```ts
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
```

### 7.3 请求与错误处理

请求层统一负责：

- token 自动注入
- 业务 code 解析
- 401 统一清理登录态并回登录页
- 统一错误提示

### 7.4 mock 与数据模式

mock 主要用于：

- 本地登录演示
- 菜单返回
- 首页统计
- CRUD 示例

当你还没有后端接口时，可以直接依靠 mock 先把页面流程做完。

## 8. 目录怎么理解

最常用的目录如下：

- `src/api/`：接口请求方法
- `src/components/`：通用组件
- `src/constants/`：常量
- `src/hooks/`：轻量 hooks
- `src/layout/`：整体布局
- `src/mock/`：mock 数据与 mock 接口
- `src/router/`：静态路由、动态路由、守卫
- `src/store/`：Pinia store
- `src/styles/`：全局样式与主题样式
- `src/utils/`：request、auth、storage 等工具
- `src/views/`：页面目录

补充几个配套文件：

- `.env.example`：环境变量模板
- `doc/08-backend-integration-contract.md`：后端联调契约
- `.github/workflows/front-v3-ci.yml`：自动质量校验

## 9. 如何新增一个业务页面

推荐按下面流程：

### 第 1 步：创建页面组件

例如新增客户列表：

```text
src/views/customer/list.vue
```

### 第 2 步：补菜单配置

在后端菜单或本地菜单中增加：

- `name`
- `path`
- `component`
- `permission`
- `icon`

其中：

- `component` 必须和 `src/views/**/*.vue` 的相对路径一致
- 不要带 `.vue`

例如：

````ts
{
  id: 'customer-list',
  name: '客户列表',
  path: 'customer/list',
  component: 'customer/list',
  icon: 'User',
  type: 'menu',
  permission: 'customer:list',
  children: [],
}

## 10. 测试与质量护栏

当前 Base 已内置以下验证：

- 路由守卫测试：覆盖登录拦截、403 分流、动态路由恢复、权限页直达
- mock 契约测试：覆盖菜单 id 唯一性和基础返回结构
- 页面测试：覆盖权限示例页的按钮权限差异
- 组件测试：覆盖 `TopNav` 消息面板开关和 `TagViews` 右键菜单关键行为
- 工程质量：`eslint + stylelint + vitest + build`

本地推荐执行：

```bash
pnpm lint
pnpm stylelint
pnpm test
pnpm build
````

## 11. 推荐阅读路径

- 想快速上手：先看本文件，再看 `00-base-completion-summary.md`
- 想理解菜单和动态路由：看 `02-menu-and-routing.md`
- 想理解权限链路：看 `03-permission-and-auth.md`
- 想切换 mock / api：看 `04-mock-and-api.md`
- 想接后端：看 `08-backend-integration-contract.md`

```

### 第 3 步：补权限码

如果页面中有新增、删除、导出等按钮，需要补对应权限码，并在页面里接权限控制。

### 第 4 步：按页面规范组织内容

建议优先使用：

- `PageContainer`
- `el-card`
- `el-form`
- `el-table`
- `el-dialog`
- `el-drawer`

### 第 5 步：补验证

至少确认：

- 菜单能显示
- 页面能进入
- 刷新后路由能恢复
- 权限表现符合预期
- `pnpm lint` / `pnpm test` / `pnpm build` 通过

## 10. 使用时的注意事项

### 10.1 这是 Base，不是 Standard

当前 Base 还没有：

- 用户管理
- 角色管理
- 菜单管理
- 数据权限
- 完整 RBAC

所以不要把它当成已经具备“后台平台管理能力”的成品。

### 10.2 菜单是整条主链路的核心输入

如果出现页面进不去、菜单不显示、路由不生效，优先检查：

- 菜单 `component` 路径是否正确
- `permission` 是否与当前账号权限一致
- `type` 是否正确
- `status` 是否被关闭

### 10.3 mock 适合演示，不等于真实后端契约

当前 mock 已足够演示 Base 流程，但真实后端接入时仍需要重新确认：

- 字段命名
- 返回结构
- 权限码规则
- 菜单结构约定

### 10.4 Base 推荐“轻扩展”

如果是基于 Base 做新项目，建议优先：

- 复用现有布局和 request 层
- 保持页面结构一致
- 在示例页基础上扩展业务页
- 尽量不要一开始就重写整套框架

## 11. 当前质量门槛

本地开发和提交前建议至少保证：

- `pnpm lint`
- `pnpm stylelint`
- `pnpm test`
- `pnpm build`

当前仓库也已经接入 `front/V3` 专属 CI，会自动校验以上内容。

## 12. 推荐阅读顺序

- `00-base-completion-summary.md`：确认当前 Base 已完成范围
- `01-directory-structure.md`：看目录和页面放置约定
- `02-menu-and-routing.md`：看动态菜单与路由链路
- `03-permission-and-auth.md`：看登录、页面权限、按钮权限
- `04-mock-and-api.md`：看 mock 与 request 约定
- `05-page-and-component-conventions.md`：看页面结构规范
- `06-extension-suggestions.md`：看后续演进方向

## 13. 一句话总结

当前 `front/V3 Base` 已经是一个 **可以直接起项目、可以演示完整后台主链路、可以继续往 Standard 演进** 的后台模板基础版。
```
