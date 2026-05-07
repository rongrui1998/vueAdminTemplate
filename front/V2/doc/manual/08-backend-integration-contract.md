# 后端对接约定

## 1. 文档定位

这份文档用于说明 `front/V2` 在接真实后端时，前后端需要统一的最小契约。

适用场景：

- mock 切 API 前的字段对齐
- 后端返回结构定义
- 菜单、权限、登录链路联调
- 新成员快速理解 Base 对后端的依赖点

## 2. 接入前要确认的环境变量

建议从项目根目录下的 `.env.example` 复制一份本地环境文件，再按实际接口地址调整：

- `VITE_API_BASE_URL`：后端接口前缀
- `VITE_USE_MOCK`：切真实后端时建议改成 `false`
- `VITE_MENU_SOURCE`：接后端菜单时改成 `api`
- `VITE_STANDARD_DATA_SOURCE`：用户、角色、菜单等 Standard 模块切真实接口时改成 `api`

推荐组合：

```bash
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
VITE_MENU_SOURCE=api
VITE_STANDARD_DATA_SOURCE=api
```

## 3. 通用响应结构

请求层默认按下面结构解析：

```ts
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  time?: string;
  tip?: string;
}
```

约定说明：

- `code === 200` 视为业务成功
- `msg` 为错误或提示文案
- `data` 为真实业务数据
- `tip` 为可选补充提示

列表接口通常约定为：

```ts
interface ApiListData<T> {
  total: number;
  list: T[];
}
```

## 4. 登录与用户信息接口

### 4.1 登录

请求：

```http
POST /auth/login
```

请求体：

```ts
interface LoginParams {
  username: string;
  password: string;
}
```

返回：

```ts
interface LoginResult {
  token: string;
}
```

### 4.2 退出登录

请求：

```http
POST /auth/logout
```

返回：

- `data` 建议返回 `true`

### 4.3 获取当前用户信息

请求：

```http
GET /user/info
```

返回数据至少需要包含：

```ts
interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}
```

说明：

- `roles` 用于角色判定和高权限兜底
- `permissions` 用于页面权限、按钮权限和组合式权限读取
- Base 默认将 `admin` 视作全权限账号

## 5. 菜单接口约定

请求：

```http
GET /menu/list
```

返回：

```ts
ApiResponse<ApiListData<BackendMenuItem>>;
```

菜单项结构：

```ts
type MenuType = 'directory' | 'menu' | 'button';

interface BackendMenuItem {
  id: string;
  parentId?: string | null;
  name: string;
  path: string;
  component: string;
  icon?: string;
  sort?: number;
  type: MenuType;
  permission?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  affix?: boolean;
  status?: number;
  children?: BackendMenuItem[];
}
```

关键要求：

- `id` 必须全局唯一
- `path` 在同级菜单下不能冲突
- `component` 必须能映射到 `src/views/**/*.vue` 的相对路径，且不要带 `.vue`
- `type=directory` 时 `component` 固定使用 `ParentView`
- `permission` 会写入路由 `meta.permission`
- `button` 类型菜单当前不参与左侧菜单渲染，但可以作为后端统一权限码来源

## 6. 权限与页面控制约定

Base 当前支持三类权限使用方式：

- 菜单权限：决定某个菜单项是否返回给当前用户
- 页面权限：决定当前页面路由是否允许访问
- 按钮权限：通过 `v-permission` 和 `usePermission()` 控制显隐

推荐后端实践：

- 页面型菜单一定返回 `permission`
- 按钮型权限码即使不渲染菜单，也建议统一放进 `permissions`
- 无权限页面不要返回到菜单树里

## 7. CRUD 与列表接口建议

虽然 Base 的 CRUD 示例是 mock，但建议真实接口保持以下习惯：

- 分页入参统一为 `pageNum / pageSize`
- 列表结果统一放在 `data.list / data.total`
- 详情接口在资源不存在时返回明确失败
- 删除和更新接口在资源不存在时不要静默成功

这样前端现有空态、异常态和重试逻辑就能直接复用。

## 8. 联调建议顺序

推荐按下面顺序切换：

1. 保持 `VITE_USE_MOCK=true`，先把页面流程跑通
2. 将 `VITE_MENU_SOURCE` 改为 `static`，排查前端菜单和视图映射
3. 将 `VITE_MENU_SOURCE` 改为 `api`，开始接后端菜单
4. 关闭 mock，逐步替换登录、用户信息、业务接口

## 9. 常见问题

### 9.1 直接访问页面出现 404

优先检查：

- 菜单 `id` 是否唯一
- `component` 路径是否能映射到真实页面文件
- 当前账号是否返回了目标菜单

### 9.2 页面显示 403

说明路由存在，但当前账号不具备该页面的 `permission`。

### 9.3 按钮不显示

优先检查：

- 用户 `permissions` 是否包含对应权限码
- `v-permission` 传入的权限码是否和后端保持一致

## 10. 推荐联读

- `07-base-overview-and-usage.md`
- `04-mock-and-api.md`
- `03-permission-and-auth.md`
