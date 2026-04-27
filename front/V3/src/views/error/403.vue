<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, House } from '@element-plus/icons-vue';
import { DASHBOARD_PATH } from '@/constants/route';

const router = useRouter();

function goDashboard() {
  router.push(DASHBOARD_PATH);
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push(DASHBOARD_PATH);
}
</script>

<template>
  <div class="forbidden-page">
    <div class="forbidden-page__shell">
      <section class="forbidden-page__content">
        <div class="forbidden-page__code">403</div>
        <div class="forbidden-page__badge">Permission Locked</div>
        <h1 class="forbidden-page__title">当前账号没有访问权限</h1>
        <p class="forbidden-page__desc">
          这个页面已经接入权限校验。当前账号暂未开通对应访问能力，你可以返回工作台继续操作，或联系管理员补齐权限后再试。
        </p>

        <div class="forbidden-page__actions">
          <el-button type="primary" size="large" @click="goDashboard">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上一页
          </el-button>
        </div>

        <div class="forbidden-page__tips">
          <div class="forbidden-page__tip">
            <span class="forbidden-page__tip-dot forbidden-page__tip-dot--blue" />
            页面存在，但当前账号不可访问
          </div>
          <div class="forbidden-page__tip">
            <span class="forbidden-page__tip-dot forbidden-page__tip-dot--green" />
            开通后无需换地址，可直接再次访问
          </div>
        </div>
      </section>

      <section class="forbidden-page__visual" aria-hidden="true">
        <div class="forbidden-page__halo forbidden-page__halo--primary" />
        <div class="forbidden-page__halo forbidden-page__halo--secondary" />

        <div class="permission-scene">
          <div class="permission-scene__pill permission-scene__pill--top">Access denied</div>
          <div class="permission-scene__pill permission-scene__pill--right">Role mismatch</div>
          <div class="permission-scene__pill permission-scene__pill--bottom">Need approval</div>

          <div class="permission-scene__card">
            <div class="permission-scene__shield">
              <div class="permission-scene__shield-core" />
            </div>

            <div class="permission-scene__lock">
              <div class="permission-scene__lock-ring" />
              <div class="permission-scene__lock-body">
                <span class="permission-scene__lock-hole" />
              </div>
            </div>

            <div class="permission-scene__grid">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.forbidden-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgb(38 132 255 / 0.14), transparent 28%),
    radial-gradient(circle at bottom right, rgb(31 210 170 / 0.14), transparent 26%),
    var(--app-bg-color);
}

.forbidden-page__shell {
  width: min(1120px, 100%);
  min-height: 560px;
  display: grid;
  grid-template-columns: minmax(320px, 1.02fr) minmax(320px, 0.98fr);
  gap: 28px;
  align-items: center;
}

.forbidden-page__content,
.forbidden-page__visual {
  position: relative;
}

.forbidden-page__content {
  z-index: 1;
}

.forbidden-page__code {
  font-size: clamp(76px, 11vw, 132px);
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--el-text-color-primary);
}

.forbidden-page__badge {
  width: fit-content;
  margin-top: 18px;
  padding: 7px 12px;
  border: 1px solid rgb(64 158 255 / 0.24);
  border-radius: 999px;
  background: rgb(64 158 255 / 0.1);
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.forbidden-page__title {
  margin: 18px 0 0;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.18;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.forbidden-page__desc {
  max-width: 560px;
  margin: 18px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 16px;
  line-height: 1.9;
}

.forbidden-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.forbidden-page__actions :deep(.el-button) {
  min-width: 132px;
  border-radius: 14px;
  padding-inline: 20px;
}

.forbidden-page__tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.forbidden-page__tip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.forbidden-page__tip-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.forbidden-page__tip-dot--blue {
  background: #409eff;
}

.forbidden-page__tip-dot--green {
  background: #32c5a1;
}

.forbidden-page__visual {
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forbidden-page__halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
}

.forbidden-page__halo--primary {
  width: 240px;
  height: 240px;
  top: 44px;
  left: 24px;
  background: rgb(64 158 255 / 0.16);
}

.forbidden-page__halo--secondary {
  width: 180px;
  height: 180px;
  right: 34px;
  bottom: 42px;
  background: rgb(50 197 161 / 0.16);
}

.permission-scene {
  position: relative;
  width: min(420px, 100%);
  height: 420px;
}

.permission-scene__pill {
  position: absolute;
  padding: 9px 14px;
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.64);
  backdrop-filter: blur(12px);
  color: var(--el-text-color-primary);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 14px 30px rgb(15 23 42 / 0.08);
}

.permission-scene__pill--top {
  top: 26px;
  left: 26px;
}

.permission-scene__pill--right {
  top: 126px;
  right: 10px;
}

.permission-scene__pill--bottom {
  left: 44px;
  bottom: 26px;
}

.permission-scene__card {
  position: absolute;
  inset: 58px 34px 40px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.26);
  border-radius: 30px;
  background:
    linear-gradient(160deg, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.5)),
    linear-gradient(135deg, rgb(64 158 255 / 0.18), rgb(50 197 161 / 0.18));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.34),
    0 28px 60px rgb(15 23 42 / 0.12);
  backdrop-filter: blur(16px);
}

.permission-scene__shield {
  position: absolute;
  inset: 54px 72px auto;
  height: 178px;
  display: flex;
  justify-content: center;
}

.permission-scene__shield::before {
  content: '';
  width: 168px;
  height: 178px;
  border-radius: 42% 42% 50% 50% / 26% 26% 68% 68%;
  background: linear-gradient(180deg, #58b0ff 0%, #2f6dff 100%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.26),
    0 18px 36px rgb(47 109 255 / 0.26);
}

.permission-scene__shield-core {
  position: absolute;
  top: 26px;
  width: 116px;
  height: 118px;
  border-radius: 38% 38% 48% 48% / 26% 26% 64% 64%;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.32));
}

.permission-scene__lock {
  position: absolute;
  top: 138px;
  left: 50%;
  transform: translateX(-50%);
  width: 116px;
  height: 118px;
}

.permission-scene__lock-ring {
  width: 64px;
  height: 58px;
  margin: 0 auto;
  border: 10px solid #0f2142;
  border-bottom: 0;
  border-radius: 40px 40px 0 0;
}

.permission-scene__lock-body {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 76px;
  border-radius: 22px;
  background: linear-gradient(180deg, #11264d 0%, #0a1833 100%);
  box-shadow: 0 18px 28px rgb(10 24 51 / 0.24);
}

.permission-scene__lock-hole {
  position: absolute;
  top: 18px;
  left: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.92);
  transform: translateX(-50%);
}

.permission-scene__lock-hole::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  width: 6px;
  height: 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  transform: translateX(-50%);
}

.permission-scene__grid {
  position: absolute;
  right: 28px;
  bottom: 26px;
  display: grid;
  grid-template-columns: repeat(3, 14px);
  gap: 10px;
}

.permission-scene__grid span {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(180deg, #6ac4ff 0%, #3a79ff 100%);
  box-shadow: 0 0 0 6px rgb(64 158 255 / 0.08);
}

@media (max-width: 960px) {
  .forbidden-page {
    padding: 24px 18px;
  }

  .forbidden-page__shell {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .forbidden-page__content {
    order: 2;
    text-align: center;
  }

  .forbidden-page__desc {
    max-width: none;
  }

  .forbidden-page__actions,
  .forbidden-page__tips {
    justify-content: center;
    align-items: center;
  }

  .forbidden-page__visual {
    order: 1;
    min-height: 340px;
  }

  .permission-scene {
    width: min(360px, 100%);
    height: 320px;
  }

  .permission-scene__card {
    inset: 44px 20px 28px;
  }

  .permission-scene__shield {
    inset: 44px 52px auto;
    height: 144px;
  }

  .permission-scene__shield::before {
    width: 138px;
    height: 144px;
  }

  .permission-scene__shield-core {
    width: 94px;
    height: 96px;
  }

  .permission-scene__lock {
    top: 118px;
    width: 98px;
    height: 100px;
  }

  .permission-scene__lock-ring {
    width: 54px;
    height: 46px;
    border-width: 8px;
  }

  .permission-scene__lock-body {
    height: 64px;
  }
}
</style>
