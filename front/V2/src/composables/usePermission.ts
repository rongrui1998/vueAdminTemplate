import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

export function usePermission() {
  const authStore = useAuthStore();
  const accessCodes = computed(() => authStore.userInfo.permissions);

  function hasPermission(permission?: string) {
    return authStore.hasPermission(permission);
  }

  function hasAnyPermission(permissionList: string[]) {
    return permissionList.some((permission) => hasPermission(permission));
  }

  function hasAllPermissions(permissionList: string[]) {
    return permissionList.every((permission) => hasPermission(permission));
  }

  return {
    accessCodes,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
