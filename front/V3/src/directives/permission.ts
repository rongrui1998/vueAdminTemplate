import { getActivePinia } from 'pinia';
import type { Directive } from 'vue';
import { pinia } from '@/store';
import { usePermissionStore } from '@/store/modules/permission';

function hasPermission(value: string | string[] | undefined) {
  const permissionStore = usePermissionStore(getActivePinia() ?? pinia);

  if (!value) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((permission) => permissionStore.canAccessPermission(permission));
  }

  return permissionStore.canAccessPermission(value);
}

function updateVisibility(el: HTMLElement, value: string | string[] | undefined) {
  if (hasPermission(value)) {
    return;
  }

  el.remove();
}

export const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updateVisibility(el, binding.value);
  },
  updated(el, binding) {
    updateVisibility(el, binding.value);
  },
};
