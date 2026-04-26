import { computed } from 'vue';
import { useTabsStore } from '@/store/modules/tabs';

export function useKeepAlive() {
  const tabsStore = useTabsStore();

  return computed(() => tabsStore.cachedViews);
}
