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

## 4. 当前文档入口

- `doc/plans/2026-04-27-v2-standard-design.md`
- `doc/plans/2026-04-27-v2-standard-plan.md`
- `doc/plans/2026-04-27-v2-standard-feature-plan.md`
- `doc/plans/2026-04-27-v2-standard-fullstack-design.md`
- `doc/plans/2026-04-27-v2-standard-fullstack-plan.md`
- `doc/plans/2026-04-27-v2-menu-management-design.md`
- `doc/plans/2026-04-27-v2-menu-management-plan.md`
- `doc/07-base-overview-and-usage.md`
- `doc/08-backend-integration-contract.md`
