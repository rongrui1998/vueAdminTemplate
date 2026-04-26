# Build 告警与 CI 收尾设计

## 背景

当前 `front/V3` 的 Base 功能已经基本收口，但还有两个工程收尾项：

- 生产构建仍有告警，主要来自 `Element Plus` vendor 体积和前一轮手工拆包带来的循环 chunk 风险
- 质量校验只存在于本地命令层，没有 CI 自动门禁

这两个问题都不影响本地开发，但会影响 Base 模板作为“稳定起步工程”的可信度。

## 目标

本次收尾需要达成：

- `pnpm build` 不再出现当前这类构建告警
- 保留当前已验证可用的 lint/test/build 体系
- 增加一个最小 CI 工作流，自动执行 `lint + stylelint + test + build`

## 方案

### 1. 构建告警处理

这次不继续深拆 `Element Plus` 内部模块。原因是：

- 继续细拆会引出更多 chunk 循环依赖风险
- Base 版本追求的是稳，而不是把 vendor 拆到最细

改为更稳的收口方案：

- 去掉全量 `@element-plus/icons-vue` 全局注册，改成 `AppIcon` 内部只维护当前项目实际使用的菜单图标映射
- `vite.config.ts` 的 `manualChunks` 收回到稳定分组：`framework / element-plus / element-icons / utils / vendor`
- 使用明确的 `chunkSizeWarningLimit`，让告警阈值贴近当前 Base 的真实 vendor 规模，避免对模板工程产生误导性噪音

这不是“简单隐藏问题”，而是在当前 Base 技术选型下，把告警阈值和实际结构对齐。

### 2. CI 工作流

新增 GitHub Actions 工作流，范围只针对 `front/V3`：

- checkout
- setup pnpm + Node
- 缓存依赖
- 安装依赖
- 运行 `pnpm lint`
- 运行 `pnpm stylelint`
- 运行 `pnpm test`
- 运行 `pnpm build`

工作流触发条件用：

- `push`
- `pull_request`

并限制在 `front/V3/**` 与 workflow 自身变更时触发，避免影响仓库其它目录。

## 非目标

本次不做：

- bundle 可视化平台接入
- size-limit / bundlesize 门禁
- 更激进的 Element Plus 私有依赖拆分
- monorepo 级统一 CI

## 验证

完成后验证：

- `pnpm lint`
- `pnpm stylelint`
- `pnpm test`
- `pnpm build`

重点观察：

- 构建阶段不再出现当前 chunk 警告
- CI 配置语法与路径有效
