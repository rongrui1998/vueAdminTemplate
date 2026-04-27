import { defineStore } from 'pinia';
import { logoutApi, loginApi } from '@/api/auth';
import { getUserInfoApi } from '@/api/user';
import { STORAGE_KEYS } from '@/constants/app';
import type { LoginParams } from '@/types/auth';
import type { UserInfo } from '@/types/user';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/utils/auth';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

const emptyUserInfo: UserInfo = {
  id: '',
  username: '',
  nickname: '',
  avatar: '',
  roles: [],
  permissions: [],
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getAccessToken(),
    userInfo: getStorage<UserInfo>(STORAGE_KEYS.userInfo, emptyUserInfo),
    userInfoLoaded: false,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    async login(payload: LoginParams) {
      const result = await loginApi(payload);
      this.token = result.token;
      setAccessToken(result.token);
      this.userInfoLoaded = false;
    },
    async fetchUserInfo(force = false) {
      if (!force && this.userInfoLoaded && this.userInfo.id) {
        return this.userInfo;
      }

      const userInfo = await getUserInfoApi();
      this.userInfo = {
        ...userInfo,
        permissions: userInfo.permissions || [],
      };
      this.userInfoLoaded = true;
      setStorage(STORAGE_KEYS.userInfo, this.userInfo);
      return this.userInfo;
    },
    hasPermission(permission?: string) {
      if (!permission) {
        return true;
      }

      if (this.userInfo.roles.includes('admin')) {
        return true;
      }

      return this.userInfo.permissions.includes(permission);
    },
    async logout(needRequest = true) {
      if (needRequest && this.token) {
        try {
          await logoutApi();
        } catch {
          // ignore request errors on logout
        }
      }

      this.clearAuth();
    },
    clearAuth() {
      this.token = '';
      this.userInfo = emptyUserInfo;
      this.userInfoLoaded = false;
      clearAccessToken();
      removeStorage(STORAGE_KEYS.userInfo);
    },
  },
});
