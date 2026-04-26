# TopNav Utilities Design

**Goal:** 为 Base 版顶部导航新增全屏按钮和消息按钮，并提供一个轻量的下拉式消息面板。

**Scope**

- 在顶部栏右侧增加全屏切换按钮
- 在顶部栏右侧增加消息按钮和未读红点
- 点击消息按钮打开下拉消息面板
- 使用本地静态 mock 消息数据，支持已读、清空、查看全部占位反馈

**Approach**

- 保持 `TopNav.vue` 作为入口，只负责按钮和面板开关状态
- 新增 `NotificationPanel.vue` 封装消息面板 UI
- 新增 `useFullscreen.ts` 封装 Fullscreen API 和监听逻辑
- 使用本地静态消息列表，并把已读状态持久化到 `localStorage`

**Why this design**

- 不把复杂模板继续堆进 `TopNav.vue`
- 不引入新的全局 store，保持 Base 版轻量
- 后续如果接真实接口，可以只替换消息数据来源

**Interaction**

- 点击全屏按钮进入/退出全屏，图标跟随状态变化
- 点击铃铛按钮展开/收起消息面板
- 点击面板外区域关闭消息面板
- 点击单条消息标记已读
- 点击“清空”清空本地消息列表
- 点击“查看所有消息”给出占位提示
