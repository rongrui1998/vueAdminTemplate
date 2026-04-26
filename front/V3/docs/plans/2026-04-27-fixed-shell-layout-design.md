# Fixed Shell Layout Design

**Goal:** 让后台布局中的左侧菜单、顶部导航和标签栏固定在视口中，仅中间主内容区滚动。

**Scope**

- 锁定整个应用壳层为一屏高度
- 禁止 `body` 参与页面滚动
- 左侧菜单区域整列固定，菜单内部滚动
- 顶部导航和标签栏固定在右侧内容区顶部
- 只允许主内容区独立滚动

**Approach**

- 使用 `100vh + overflow: hidden` 方式固定壳层布局
- 保持当前 `el-container` 结构，不改成大量 `position: fixed`
- 通过 flex 和 `min-height: 0` 建立稳定的内部滚动链路

**Why this design**

- 比直接用 fixed 偏移更稳定
- 和现有侧栏折叠、消息面板、标签栏结构兼容更好
- 改动范围小，更适合 Base 版
