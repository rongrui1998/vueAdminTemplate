# Nested Demo Content Design

**Goal:** 将“二级菜单示例”页面从轻量说明页扩展为业务信息型页面，同时保留它作为多级菜单示例页的作用。

**Scope**

- 保留当前顶部说明性 `el-alert`
- 增加业务概览卡片区
- 增加项目进度和待处理事项双栏区
- 增加最近操作记录表格区

**Approach**

- 仅修改 `src/views/demo/nested/index.vue`
- 使用本地静态数组组织展示数据
- 保持 Element Plus 原生组件组合，避免引入图表库或复杂交互

**Why this design**

- 内容密度更接近真实后台页面
- 仍适合验证二级菜单、面包屑、标签页与缓存联动
- 改动范围小，符合 Base 版定位
