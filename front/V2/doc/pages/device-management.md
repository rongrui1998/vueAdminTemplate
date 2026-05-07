# 设备管理

## 确认方式

- 可以直接在当前对话中确认
- 也可以通过本文件确认后，再回复“确认生成”

## 基本信息

- 模块名称：设备管理
- 页面标题：设备管理
- 菜单名称：设备管理
- 英文菜单名称：Device Management
- route path：`/monitor/device`
- component：`monitor/device/index`

## 权限设计

- 页面权限：`monitor:device:view`
- 按钮权限：
  - create：`monitor:device:create`
  - edit：`monitor:device:edit`
  - delete：`monitor:device:delete`
  - detail：`monitor:device:detail`
  - status：`monitor:device:status`
  - import：暂不启用
  - export：暂不启用

## 页面结构

### 搜索字段

- 关键词：`keyword`，用于搜索设备 ID、设备名称、设备类型
- 状态：`status`，可选全部、启用、停用
- 创建时间：`startTime`、`endTime`，使用时间范围选择器

### 表格字段

- 设备 ID：`deviceId`
- 设备名称：`deviceName`
- 设备类型：`deviceType`
- 状态：`status`
- 创建人：`createdBy`
- 创建时间：`createdAt`
- 更新人：`updatedBy`
- 更新时间：`updatedAt`
- 操作：详情、启用/停用、编辑、删除

### 表单字段

- 设备 ID：`deviceId`，新增必填，1-64 字符；编辑时不修改
- 设备名称：`deviceName`，新增/编辑必填，1-100 字符
- 设备类型：`deviceType`，新增/编辑必填，1-100 字符

### 详情字段

- ID：`id`
- 设备 ID：`deviceId`
- 设备名称：`deviceName`
- 设备类型：`deviceType`
- 状态：`status`
- 创建人：`createdBy`
- 创建时间：`createdAt`
- 更新人：`updatedBy`
- 更新时间：`updatedAt`

### 行操作

- 详情：打开详情抽屉
- 启用/停用：调用状态更新接口，使用状态开关或行内按钮
- 编辑：打开编辑弹窗
- 删除：使用二次确认后删除

### 批量操作

- 暂不启用批量操作

## 国际化说明

- 需要国际化的前端文案：页面标题、菜单建议名称、搜索项标签、占位符、表格表头、表单标签、校验提示、按钮文字、弹窗标题、抽屉标题、确认删除文案、成功/失败提示、空状态与加载失败文案
- 建议的 locale key 分组：`deviceManagement`
- 后端原值直出字段：`deviceId`、`deviceName`、`deviceType`、`createdBy`、`updatedBy`、`createdAt`、`updatedAt`、`id`

## 日期时间控件

- 使用日期/时间控件的字段：搜索条件中的创建时间范围
- 对应控件类型：`datetimerange`，提交时拆为 `startTime`、`endTime`
- 语言切换要求：`zh-CN` 中文，`en-US` 英文

## 交互与能力

- 状态开关：需要，状态值按接口枚举 `1=启用`、`0=停用`
- 导入：暂不需要
- 导出：暂不需要
- 页面交互模式：列表 + 搜索表单 + 新增/编辑弹窗 + 详情抽屉 + 删除确认

## 菜单管理填写说明

### 页面菜单

- name：设备管理
- nameEn：Device Management
- path：`/monitor/device`
- component：`monitor/device/index`
- permission：`monitor:device:view`
- icon：建议 `Monitor` 或 `Cpu`
- type：`menu`
- status：`1`
- sort：建议放在监控相关目录下，按现有菜单顺序填写

### 按钮权限项

- create：名称“新增设备”，权限 `monitor:device:create`，type `button`
- edit：名称“编辑设备”，权限 `monitor:device:edit`，type `button`
- delete：名称“删除设备”，权限 `monitor:device:delete`，type `button`
- detail：名称“设备详情”，权限 `monitor:device:detail`，type `button`
- status：名称“状态切换”，权限 `monitor:device:status`，type `button`
- import：暂不创建
- export：暂不创建

## 假设与待确认项

- Swagger 当前提供列表、添加、更新、删除、状态更新接口，未看到单独详情接口；详情抽屉先使用列表行数据展示。
- 列表接口为 `POST /api/device/list`，请求体包含 `pageNum`、`pageSize`、`keyword`、`status`、`startTime`、`endTime`。
- 新增接口为 `POST /api/device/add`，请求体为 `deviceId`、`deviceName`、`deviceType`。
- 编辑接口为 `POST /api/device/update`，请求体为 `id`、`deviceName`、`deviceType`，不提交 `deviceId`。
- 删除接口为 `DELETE /api/device/delete?id=xxx`。
- 状态接口为 `POST /api/device/status`，请求体为 `id`、`status`。
- 返回包装格式按 V2 当前 `request` 约定处理，成功时读取 `data`；若真实接口返回结构不同，生成时会保持适配层集中在设备 API 文件中。
- 页面文件预计创建在 `src/views/monitor/device/index.vue`，类型在 `src/types/device-management.ts`，接口在 `src/api/device-management.ts`；确认前不会创建这些实现文件。
