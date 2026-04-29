<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, House } from '@element-plus/icons-vue';
import { DASHBOARD_PATH } from '@/constants/route';

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push(DASHBOARD_PATH);
}
</script>

<template>
  <div class="not-found-page">
    <section class="not-found-page__content">
      <div class="not-found-page__code">404</div>
      <div class="not-found-page__badge">Route Not Found</div>
      <h1>页面走丢了</h1>
      <p>当前地址没有匹配到可用页面。你可以返回首页，或回到上一页继续处理刚才的工作。</p>

      <div class="not-found-page__actions">
        <el-button type="primary" size="large" @click="router.push(DASHBOARD_PATH)">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </section>
    <section class="not-found-page__visual" aria-hidden="true">
      <div class="not-found-page__orb" />
      <div class="not-found-page__map">
        <span />
        <span />
        <span />
        <strong>?</strong>
      </div>
    </section>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(260px, 0.8fr);
  gap: 32px;
  align-items: center;
  padding: 40px;
  background:
    radial-gradient(circle at top left, rgb(230 162 60 / 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgb(64 158 255 / 0.12), transparent 28%),
    var(--app-bg-color);
}

.not-found-page__code {
  font-size: clamp(80px, 12vw, 148px);
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: -0.06em;
}

.not-found-page__badge {
  width: fit-content;
  margin-top: 18px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgb(230 162 60 / 0.12);
  color: var(--el-color-warning);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.not-found-page h1 {
  margin: 18px 0 0;
  font-size: clamp(32px, 4vw, 48px);
}

.not-found-page p {
  max-width: 560px;
  margin: 18px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 16px;
  line-height: 1.9;
}

.not-found-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.not-found-page__visual {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-page__orb {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(230 162 60 / 0.3), rgb(64 158 255 / 0.18));
  filter: blur(8px);
}

.not-found-page__map {
  position: relative;
  width: min(320px, 100%);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 28px;
  background: var(--app-card-bg-color);
  box-shadow: 0 24px 70px rgb(15 23 42 / 0.12);
}

.not-found-page__map span,
.not-found-page__map strong {
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: var(--el-fill-color-light);
}

.not-found-page__map strong {
  color: var(--el-color-warning);
  font-size: 56px;
}

@media (max-width: 768px) {
  .not-found-page {
    grid-template-columns: 1fr;
    padding: 28px;
  }

  .not-found-page__visual {
    min-height: 220px;
  }
}
</style>
