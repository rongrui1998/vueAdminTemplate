<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useKeepAlive } from '@/hooks/useKeepAlive';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const cachedViews = useKeepAlive();
const contentRef = ref<HTMLElement | null>(null);

const contentClass = computed(() => ({
  'app-main__content': true,
  [`app-main__content--${appStore.pageTransitionAnimationName}`]:
    appStore.pageTransitionAnimationEnabled && appStore.pageTransitionAnimationActive,
}));

function handleContentAnimationEnd() {
  appStore.setPageTransitionAnimationActive(false);
}

onBeforeUnmount(() => {
  appStore.setPageTransitionAnimationActive(false);
});
</script>

<template>
  <div class="app-main">
    <div ref="contentRef" :class="contentClass" @animationend="handleContentAnimationEnd">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="appStore.keepAliveEnabled ? cachedViews : []">
          <component
            :is="Component"
            v-if="route.meta.keepAlive && appStore.keepAliveEnabled"
            :key="String(route.name || route.fullPath)"
          />
        </keep-alive>
        <component
          :is="Component"
          v-if="!route.meta.keepAlive || !appStore.keepAliveEnabled"
          :key="route.fullPath"
        />
      </router-view>
    </div>

    <transition name="app-main-loading-fade">
      <div
        v-if="appStore.pageTransitionLoadingEnabled && appStore.pageTransitionLoading"
        class="app-main__loading"
      >
        <el-skeleton animated :rows="6" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.app-main {
  position: relative;
  min-height: 100%;
}

.app-main__content {
  min-height: 100%;
}

.app-main__loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  padding: 8px 0;
  pointer-events: none;
  background: color-mix(in srgb, var(--app-bg-color) 82%, transparent);
  backdrop-filter: blur(2px);
}

.app-main-loading-fade-enter-active,
.app-main-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.app-main-loading-fade-enter-from,
.app-main-loading-fade-leave-to {
  opacity: 0;
}

.app-main__content--fade {
  animation: app-main-fade 0.34s ease;
}

.app-main__content--fade-slide-up {
  animation: app-main-fade-slide-up 0.36s ease;
}

.app-main__content--fade-slide-right {
  animation: app-main-fade-slide-right 0.36s ease;
}

.app-main__content--zoom-fade {
  animation: app-main-zoom-fade 0.36s ease;
  transform-origin: center top;
}

@keyframes app-main-fade {
  from {
    opacity: 0.08;
  }

  to {
    opacity: 1;
  }
}

@keyframes app-main-fade-slide-up {
  from {
    opacity: 0.08;
    transform: translate3d(0, 10px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes app-main-fade-slide-right {
  from {
    opacity: 0.08;
    transform: translate3d(12px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes app-main-zoom-fade {
  from {
    opacity: 0.08;
    transform: scale(0.985);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
