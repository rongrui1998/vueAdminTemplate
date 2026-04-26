import { STORAGE_KEYS } from '@/constants/app';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

export function getAccessToken() {
  return getStorage<string>(STORAGE_KEYS.token, '');
}

export function setAccessToken(token: string) {
  setStorage(STORAGE_KEYS.token, token);
}

export function clearAccessToken() {
  removeStorage(STORAGE_KEYS.token);
}
