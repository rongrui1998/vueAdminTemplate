# 设备管理接口文档

本文档描述 `backend` 中新增的设备管理接口。接口用于演示根据接口文档生成标准 CRUD 页面。

## 基础信息

- Base URL：`http://127.0.0.1:3100`
- 认证方式：除登录接口外，请求需要携带 `Authorization: Bearer <token>`
- 数据文件：`backend/data/devices.json`

统一成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {},
  "time": "2026-04-29T00:00:00.000Z",
  "tip": "成功"
}
```

常见错误：

- `401`：登录状态已失效
- `404`：接口不存在
- `500`：参数校验失败或服务异常

## 数据模型

### DeviceInfo

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 数据主键 |
| deviceId | string | 设备 ID / 设备编号 |
| deviceName | string | 设备名称 |
| deviceType | string | 设备类型 |
| status | number | 状态，`1` 启用，`0` 禁用 |
| createdAt | string | 创建时间 |
| createdBy | string | 创建人 |
| updatedAt | string | 更新时间 |
| updatedBy | string | 更新人 |

## 设备列表

### `POST /api/device/list`

获取设备分页列表。

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | number | 是 | 当前页，从 `1` 开始 |
| pageSize | number | 是 | 每页条数 |
| keyword | string | 否 | 关键词，匹配设备 ID、名称、类型、创建人、更新人 |
| status | number | 否 | 状态，`1` 启用，`0` 禁用 |
| startTime | string | 否 | 创建时间开始 |
| endTime | string | 否 | 创建时间结束 |

请求示例：

```json
{
  "pageNum": 1,
  "pageSize": 10,
  "keyword": "摄像头",
  "status": 1,
  "startTime": "2026-04-18 00:00:00",
  "endTime": "2026-04-30 23:59:59"
}
```

响应 `data`：

```json
{
  "total": 2,
  "list": [
    {
      "id": "dev-1",
      "deviceId": "DV-10001",
      "deviceName": "前门摄像头",
      "deviceType": "摄像头",
      "status": 1,
      "createdAt": "2026-04-18 09:12:00",
      "updatedAt": "2026-04-28 15:04:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ]
}
```

## 新增设备

### `POST /api/device/add`

新增一台设备。

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| deviceId | string | 是 | 设备 ID / 设备编号，不能重复 |
| deviceName | string | 是 | 设备名称 |
| deviceType | string | 是 | 设备类型 |

请求示例：

```json
{
  "deviceId": "DV-20001",
  "deviceName": "测试设备",
  "deviceType": "摄像头"
}
```

响应 `data`：

```json
{
  "id": "generated-uuid",
  "deviceId": "DV-20001",
  "deviceName": "测试设备",
  "deviceType": "摄像头",
  "status": 1,
  "createdBy": "system",
  "updatedBy": "system",
  "createdAt": "2026-04-29 10:00:00",
  "updatedAt": "2026-04-29 10:00:00"
}
```

## 更新设备

### `POST /api/device/update`

更新设备名称和设备类型。

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 数据主键 |
| deviceName | string | 是 | 设备名称 |
| deviceType | string | 是 | 设备类型 |

请求示例：

```json
{
  "id": "dev-1",
  "deviceName": "前门摄像头更新",
  "deviceType": "球机"
}
```

响应 `data`：更新后的 `DeviceInfo`。

## 删除设备

### `DELETE /api/device/delete`

根据主键删除设备。

Query 参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 数据主键 |

请求示例：

```text
DELETE /api/device/delete?id=dev-1
```

响应 `data`：

```json
true
```

## 更新设备状态

### `POST /api/device/status`

启用或禁用设备。

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 数据主键 |
| status | number | 是 | 状态，`1` 启用，`0` 禁用 |

请求示例：

```json
{
  "id": "dev-1",
  "status": 0
}
```

响应 `data`：更新后的 `DeviceInfo`。

