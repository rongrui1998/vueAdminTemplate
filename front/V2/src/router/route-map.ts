import { h, defineComponent } from 'vue';
import { RouterView } from 'vue-router';

const viewModules = import.meta.glob('/src/views/**/*.vue');
const missingRouteView = () => import('@/views/error/route-missing.vue');

export const ParentView = defineComponent({
  name: 'ParentView',
  render() {
    return h(RouterView);
  },
});

export function resolveRouteComponent(componentKey: string) {
  if (componentKey === 'ParentView') {
    return {
      component: ParentView,
      componentMissing: false,
    };
  }

  const normalizedKey = componentKey.replace(/^\/+/, '').replace(/\.vue$/, '');
  const targetPath = `/src/views/${normalizedKey}.vue`;
  const loader = viewModules[targetPath];

  if (!loader) {
    console.warn(`[dynamic-route] missing view component: ${targetPath}`);
    return {
      component: missingRouteView,
      componentMissing: true,
    };
  }

  return {
    component: loader,
    componentMissing: false,
  };
}
