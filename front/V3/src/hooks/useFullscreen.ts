import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

function getFullscreenState() {
  return Boolean(document.fullscreenElement);
}

export function useFullscreen() {
  const isFullscreen = ref(false);

  function syncFullscreenState() {
    isFullscreen.value = getFullscreenState();
  }

  async function toggleFullscreen() {
    if (getFullscreenState()) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  }

  onMounted(() => {
    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', syncFullscreenState);
  });

  return {
    isFullscreen: computed(() => isFullscreen.value),
    toggleFullscreen,
  };
}
