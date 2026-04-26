import type { App } from 'vue';
import { ElLoadingDirective } from 'element-plus/es/components/loading/index.mjs';

export function setupElementPlus(app: App) {
  app.directive('loading', ElLoadingDirective);
}
