# V2 Standard 演示与验收清单

## 1. 使用方式

这份清单用于交付前手动点验，建议分别在 mock 模式和 API 模式执行。

推荐顺序：

1. 先用 mock 模式确认前端体验。
2. 再用 API 模式确认真实后端闭环。
3. 最后运行自动化检查命令。

## 2. 启动检查

### Mock 模式

- 设置 `VITE_USE_MOCK=true`。
- 设置 `VITE_MENU_SOURCE=mock`。
- 设置 `VITE_STANDARD_DATA_SOURCE=mock`。
- 启动 `front/V2`。
- 打开本地前端地址。

### API 模式

- 先启动 `backend`。
- 设置 `VITE_USE_MOCK=false`。
- 设置 `VITE_MENU_SOURCE=api`。
- 设置 `VITE_STANDARD_DATA_SOURCE=api`。
- 再启动 `front/V2`。
- 打开本地前端地址。

## 3. 登录与权限

### admin

- 使用 `admin / 123456` 登录。
- 能看到首页、系统管理、业务示例。
- 能进入用户管理、角色管理、菜单管理。
- 能看到 CRUD 示例中的新增、编辑、删除等按钮。

### editor

- 使用 `editor / 123456` 登录。
- 系统管理菜单不应展示。
- 只能看到被授权的业务示例。
- 直接访问无权限页面时，应进入 `403`。

## 4. 首页演示

- 首页欢迎语显示当前用户。
- 统计卡片正常展示。
- API 模式下后端 `/api/dashboard/statistics` 正常返回；接口异常时页面应回退静态统计卡片。
- 快捷入口展示用户管理、角色授权、标准业务模板等入口。
- 点击“全局设置”快捷入口应打开右侧设置抽屉，不进入缺失路由。
- 系统状态展示 V2 Standard、数据模式和菜单来源。
- 其它快捷入口点击后能跳转到对应页面。

## 5. 系统管理演示

### 用户管理

- 查询用户列表。
- 新增用户。
- 编辑用户。
- 启停用用户。
- 重置密码。
- 删除用户时使用 Element Plus 确认弹窗，不使用 `window.confirm`。

### 角色管理

- 查询角色列表。
- 新增角色。
- 编辑角色。
- 启停用角色。
- 打开权限分配弹窗。
- 勾选菜单或按钮权限并保存。

### 菜单管理

- 查询菜单树。
- 新增目录、菜单或按钮。
- 编辑菜单节点。
- 删除菜单节点时使用统一确认弹窗。
- 新增菜单的 `component` 路径错误时，应能进入 `route-missing` 提示页。

## 6. 业务示例演示

### CRUD 示例

- 查询列表。
- 新增记录。
- 编辑记录。
- 打开详情抽屉。
- 删除记录。
- 权限按钮根据当前账号显示或隐藏。
- mock 模式下由 Vite mock 接管。
- API 模式下由 backend `/api/demo/users` 接管。

### 组件示例

- `SearchForm 示例`：查询和重置正常。
- `ProTable 示例`：loading、empty、error、retry 状态可见。
- `ModalForm 示例`：弹窗表单可打开和提交。
- `DrawerForm 示例`：抽屉表单可打开和提交。

### 导入导出示例

- 选择 CSV 文件。
- 后端或 mock 返回预览结果。
- 能看到总行数、有效行、异常行。
- 异常行显示错误原因。
- 确认导入后表格数据更新。
- 导出当前数据可下载 CSV。

### 标准业务模板

- 查询条件可用。
- 表格显示示例数据。
- 新增业务弹窗可打开。
- 编辑业务弹窗可打开并保存。
- 详情抽屉可打开。
- 状态切换可用。
- 删除业务时使用 Element Plus 确认弹窗，确认后列表刷新。
- mock 模式下由 Vite mock 接管。
- API 模式下由 backend `/api/demo/business-templates` 接管。
- 页面结构适合作为新业务页复制样板。

## 7. 右侧设置抽屉

- 任意后台页面右侧显示固定设置按钮。
- 点击后打开「界面设置」抽屉。
- 主题模式切换生效。
- 布局密度切换生效。
- 标签栏显示/隐藏生效。
- 页面缓存开关可切换。
- 刷新页面后偏好仍保留。

## 8. 错误页演示

- 无权限页面进入 `403`。
- 不存在地址进入 `404`。
- 菜单组件路径缺失进入 `route-missing`。
- 错误页都提供返回首页或明确处理入口。

## 9. 自动化检查

前端：

```bash
cd front/V2
pnpm test
pnpm lint
pnpm stylelint
pnpm build
```

后端：

```bash
cd backend
npm test
```

验收标准：

- 命令退出码均为 0。
- 前端测试全部通过。
- 后端测试全部通过。
- 允许保留当前已知 warning：JSON module experimental warning、Sass legacy JS API warning。
