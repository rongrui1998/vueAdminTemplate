# 权限示例页与构建拆包设计

## 背景

上一轮补强已经让 `front/V3` 具备了按钮权限、`403`、测试和质量工具，但还有两个明显的后续点：

- 权限能力虽然已经落地，当前缺少一个专门的页面来直观看到 `admin / editor` 的差异
- 生产构建虽然成功，但主 chunk 仍明显偏大，影响 Base 作为模板时的首包质量

## 目标

本次继续补两项：

- 增加一个权限示例页，集中演示页面权限、按钮权限、组合式权限和不同账号差异
- 调整打包策略，把主 chunk 拆成更合理的 vendor 分组，尽量消除当前的超大块告警

## 方案

### 1. 权限示例页

新增 `src/views/demo/permission/index.vue`，并挂到 `业务示例` 目录下，作为 `CRUD 示例` 与 `多级菜单` 之外的第三个基础演示页。

页面内容分三层：

- 顶部说明区：展示当前登录账号、角色和建议测试方式
- 中部能力卡片：用 `usePermission()` 把当前账号具备的能力可视化
- 底部操作演示区：用 `v-permission` 控制按钮显隐，并配一张权限码对照表

这样做的目标不是“做一个业务页”，而是让团队成员进来就能快速理解 Base 的权限能力应该怎么用。

### 2. mock 权限补充

在现有 mock 账号上新增一组权限示例页的页面权限和按钮权限码：

- `demo:permission:view`
- `demo:permission:create`
- `demo:permission:export`
- `demo:permission:approve`
- `demo:permission:delete`

`admin` 保持全量，`editor` 只保留其中一部分，这样页面差异才明显。

### 3. 构建拆包

当前最大的体积问题不是页面本身，而是所有依赖几乎都挤在一个主 chunk 里。

本次采用保守拆法：

- `vue` / `vue-router` / `pinia` 拆成 `framework`
- `element-plus` 拆成 `element-plus`
- `@element-plus/icons-vue` 单独拆成 `element-icons`
- `axios` / `nprogress` 等工具依赖拆成 `utils`

这样可以在不改业务代码的前提下，明显降低主入口 chunk 体积。若后续仍然偏大，再考虑更进一步的按页面或重依赖细拆。

## 非目标

本次不做：

- 真实后端权限管理
- 权限示例页的复杂 CRUD
- icon 按需注册重构
- bundle 可视化平台接入

## 验证

完成后验证：

- `pnpm test`
- `pnpm lint`
- `pnpm stylelint`
- `pnpm build`

并重点看构建产物中主 chunk 是否明显下降，以及 500 kB 告警是否被消除或显著缓解。
