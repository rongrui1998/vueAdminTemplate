# V2 Standard 版本路线图

## 1. 当前定位

`front/V2` 以 `V3 Base` 为起点，当前目标不是继续补 Base，而是进入 **Standard 版本** 的功能建设阶段。

## 2. Standard 目标

Standard 版本建议在 Base 之上重点补齐：

- 用户管理
- 角色管理
- 菜单管理
- Node.js 最小后端服务
- 更完整的权限模型
- 更统一的 CRUD 页面封装
- 上传、导入导出能力
- 操作日志 / 权限审计示例

## 3. 建议分期

### Phase 1：后台标准管理骨架

- 用户 / 角色基础页面
- 菜单管理树表格与 CRUD 弹窗闭环
- 前端 `mock / api` 双模式切换
- Node.js 最小后端接口骨架
- 菜单与权限真实闭环验证

### Phase 2：通用业务组件

- SearchForm / ProTable 风格封装
- ModalForm / DrawerForm 统一封装
- 通用列表页模板

### Phase 3：标准后台增强能力

- 字典能力
- 上传
- 导入导出
- 操作日志
- 更多全局设置能力

## 4. 当前完成状态

- 已完成：系统管理入口。
- 已完成：菜单管理树表格、CRUD 弹窗、mock/api 接口和后端 JSON 持久化。
- 已完成：角色管理列表、新增、修改、删除、启停用、菜单权限分配、mock/api 接口和后端 JSON 持久化。
- 已完成：用户管理列表、新增、修改、删除、启停用、重置密码、角色绑定、mock/api 接口和后端 JSON 持久化。
- 已完成：真实账号、角色、菜单和按钮权限的第一阶段闭环验证。
- 已完成：mock 模式下账号、用户、角色、菜单、登录态、用户信息和侧边栏菜单权限统一到运行态数据源，支持新增用户后登录、角色授权后刷新权限、菜单新增后参与权限过滤。
- 已完成：通用业务组件第一阶段，已补 `SearchForm`、`ProTable`、`ModalForm`、`DrawerForm` 基础封装，并完成独立组件示例页，使用者可以选择原生 Element Plus 写法或模板封装写法。
- 已完成：CSV 导入预览、确认导入、CSV 导出下载的 mock/API 后端闭环示例。
- 已完成：标准业务页面模板示例，组合查询、表格、弹窗、抽屉、状态切换和行操作布局。
- 已完成：右侧固定设置抽屉，支持主题、布局密度、标签栏和页面缓存等本地偏好配置。
- 已完成：Dashboard 快捷入口、系统状态和版本模式信息增强。
- 已完成：`404` 与动态路由缺失页视觉和引导文案统一增强。
- 进行中：操作日志等 Standard 增强能力。

## 5. 当前文档入口

- `doc/plans/2026-04-27-v2-standard-design.md`
- `doc/plans/2026-04-27-v2-standard-plan.md`
- `doc/plans/2026-04-27-v2-standard-feature-plan.md`
- `doc/plans/2026-04-27-v2-standard-fullstack-design.md`
- `doc/plans/2026-04-27-v2-standard-fullstack-plan.md`
- `doc/plans/2026-04-27-v2-menu-management-design.md`
- `doc/plans/2026-04-27-v2-menu-management-plan.md`
- `doc/plans/2026-04-28-v2-role-management-design.md`
- `doc/plans/2026-04-28-v2-role-management-plan.md`
- `doc/plans/2026-04-28-v2-user-management-design.md`
- `doc/plans/2026-04-28-v2-user-management-plan.md`
- `doc/plans/2026-04-28-v2-component-showcase-plan.md`
- `doc/plans/2026-04-29-v2-import-export-backend-design.md`
- `doc/plans/2026-04-29-v2-import-export-backend-plan.md`
- `doc/plans/2026-04-29-v2-standard-polish-plan.md`
- `doc/07-base-overview-and-usage.md`
- `doc/08-backend-integration-contract.md`
- `doc/11-standard-usage-guide.md`
- `doc/12-standard-demo-checklist.md`
