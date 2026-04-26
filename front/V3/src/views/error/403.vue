<template>
  <div class="error-state">
    <span>403</span>
    <h1>当前账号没有访问权限</h1>
    <p>请联系管理员开通对应页面或按钮权限后再试。</p>
  </div>
</template>

<style scoped>
.error-state {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.error-state span {
  color: var(--el-color-primary);
  font-size: 54px;
  font-weight: 700;
}

.error-state p {
  color: var(--el-text-color-secondary);
}
</style>
