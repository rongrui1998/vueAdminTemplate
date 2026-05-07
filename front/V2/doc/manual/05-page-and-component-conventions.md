# 页面与组件开发规范

## 页面结构建议

Base 页面优先使用：

- `PageContainer` 作为页面容器
- `el-card` 作为块级内容容器
- `el-form / el-table / el-dialog / el-drawer` 组合出标准后台页面

## 页面状态要求

Base 页面至少应覆盖：

- 加载态
- 空状态
- 异常状态
- 重试入口
- 异步操作 loading

推荐优先使用 Element Plus 原生组件：

- `el-skeleton`
- `el-empty`
- `el-result`
- `el-button` 的 `loading`

## CRUD 页面约定

示例 CRUD 页面建议具备：

- 查询 / 重置
- 分页
- 删除确认
- 状态切换
- 弹窗表单
- 抽屉详情
- 页面级异常态与空态
- 行级异步操作防重复点击

## 组件复用建议

- 通用页面标题与内容区：`src/components/PageContainer`
- 菜单图标：`src/components/AppIcon`
- 详情抽屉、表单弹窗优先复用已有结构，而不是每页重新发明模式
- 标签页同时支持顶部按钮操作和标签右键菜单操作

## 样式原则

- 优先使用 Element Plus 默认样式
- 只在必要时补轻量 scoped 样式
- Base 不做复杂主题系统，只维护亮色 / 暗黑两种模式
