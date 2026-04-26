# Mock 与接口说明

## 环境变量

- `VITE_API_BASE_URL`：接口基础路径
- `VITE_USE_MOCK`：是否启用 vite mock
- `VITE_MENU_SOURCE`：菜单来源切换

## 当前模式

### 1. mock 模式

- `VITE_USE_MOCK=true`
- `VITE_MENU_SOURCE=mock`
- 适合本地联调流程验证

### 2. static 菜单模式

- `VITE_MENU_SOURCE=static`
- 菜单不经过网络请求，直接读取本地菜单数据
- 适合快速排查菜单渲染问题

### 3. api 模式

- `VITE_MENU_SOURCE=api`
- 菜单走真实后端接口

## mock 文件位置

- `src/mock/modules/auth.ts`：登录与退出
- `src/mock/modules/user.ts`：用户信息
- `src/mock/modules/menu.ts`：菜单接口
- `src/mock/modules/dashboard.ts`：首页统计
- `src/mock/modules/demo.ts`：CRUD 示例接口
- `src/mock/data/menus.ts`：本地菜单数据

## request 层约定

统一返回结构：

- `code`
- `msg`
- `data`
- `tip`

列表接口通常使用：

- `data.total`
- `data.list`

请求层统一负责：

- token 注入
- 401 处理
- 业务 code 判断
- 错误提示
