# 目录结构说明

## 核心目录

- `src/api/`：接口模块，按业务拆分请求方法
- `src/components/`：通用组件，如 `PageContainer`、`AppIcon`
- `src/constants/`：常量定义，如路由常量、应用常量
- `src/hooks/`：轻量 hooks，如主题切换、keepAlive 处理
- `src/layout/`：后台整体布局、侧边栏、顶部栏、面包屑、标签页
- `src/mock/`：本地 mock 数据与 mock 接口
- `src/router/`：静态路由、动态路由生成、守卫与辅助方法
- `src/store/`：Pinia 状态管理
- `src/styles/`：全局样式、主题变量、暗黑模式样式
- `src/types/`：TypeScript 类型定义
- `src/utils/`：工具方法，如 request、storage、auth
- `src/views/`：页面目录

## 页面目录约定

- `src/views/login/`：登录页
- `src/views/dashboard/`：首页仪表盘
- `src/views/demo/crud/`：Base 示例 CRUD 页面
- `src/views/error/`：异常页
- `src/views/redirect/`：标签刷新辅助页

## 新增业务页面建议

1. 在 `src/views/` 下新增页面目录
2. 在后端菜单或 mock 菜单里增加对应 `component` 字段
3. 保持 `component` 与 `src/views/**/*.vue` 路径一致
4. 如需缓存，给菜单项加 `keepAlive: true`
