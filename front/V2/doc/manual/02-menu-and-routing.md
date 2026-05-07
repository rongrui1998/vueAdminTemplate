# 菜单与动态路由说明

## Base 方案

Base 版本采用“后端返回菜单，前端动态渲染”的方案，不使用纯静态菜单模板。

## 菜单加载链路

1. 登录后进入路由守卫
2. 守卫中拉取用户信息
3. `permission` store 调用菜单接口获取菜单树
4. 菜单树先做标准化，再生成动态路由
5. 路由注入到根布局下
6. 左侧菜单根据标准化后的菜单树渲染

关键文件：

- `src/store/modules/permission.ts`
- `src/api/menu.ts`
- `src/utils/menu.ts`
- `src/router/dynamic-routes.ts`
- `src/router/helper-runtime.ts`
- `src/layout/components/Sidebar.vue`

## 菜单字段约定

菜单项至少包含：

- `id`
- `name`
- `path`
- `component`
- `icon`
- `sort`
- `type`
- `permission`
- `hidden`
- `keepAlive`
- `affix`
- `status`
- `children`

## component 字段说明

`component` 会映射到 `src/views/**/*.vue`：

- `dashboard/index` -> `src/views/dashboard/index.vue`
- `demo/crud/index` -> `src/views/demo/crud/index.vue`
- `demo/nested/index` -> `src/views/demo/nested/index.vue`
- `demo/nested/extra` -> `src/views/demo/nested/extra.vue`
- `ParentView` -> 作为目录路由使用

## 菜单来源切换

通过环境变量 `VITE_MENU_SOURCE` 切换：

- `api`：真实后端菜单接口
- `mock`：走 `/api/menu/list`，由 vite mock 拦截
- `static`：直接读取本地菜单数据

该开关只影响“菜单从哪里来”，不影响动态菜单主链路。

## 多级菜单示例

当前 Base 已内置一个二级菜单目录示例：

- `业务示例 / 多级菜单 / 二级菜单示例`
- `业务示例 / 多级菜单 / 二级菜单扩展`

可用于验证：

- 多级目录展开
- 面包屑路径联动
- 标签页联动
- keepAlive 与刷新恢复
