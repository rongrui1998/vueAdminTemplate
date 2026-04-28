import { getActivePinia } from 'pinia';
import type { Directive } from 'vue';
import { pinia } from '@/store';
import { usePermissionStore } from '@/store/modules/permission';

interface PermissionAnchorState {
  anchor: Comment;
}

const anchorState = new WeakMap<HTMLElement, PermissionAnchorState>();

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
  const state = anchorState.get(el);

  if (!state) {
    return;
  }

  if (hasPermission(value)) {
    if (!el.parentNode) {
      state.anchor.after(el);
    }
    return;
  }

  if (el.parentNode) {
    el.remove();
  }
}

export const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const anchor = document.createComment('v-permission');
    el.before(anchor);
    anchorState.set(el, { anchor });
    updateVisibility(el, binding.value);
  },
  updated(el, binding) {
    updateVisibility(el, binding.value);
  },
  unmounted(el) {
    anchorState.get(el)?.anchor.remove();
    anchorState.delete(el);
  },
};
