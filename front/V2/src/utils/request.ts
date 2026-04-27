import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import { STORAGE_KEYS } from '@/constants/app';
import { TOKEN_HEADER_KEY, TOKEN_PREFIX } from '@/constants/auth';
import { LOGIN_PATH } from '@/constants/route';
import type { ApiResponse } from '@/types/api';
import { clearAccessToken, getAccessToken } from '@/utils/auth';
import { removeStorage } from '@/utils/storage';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

function clearSession() {
  clearAccessToken();
  removeStorage(STORAGE_KEYS.userInfo);
  removeStorage(STORAGE_KEYS.tabs);
}

function redirectToLogin() {
  if (window.location.pathname !== LOGIN_PATH) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(`${LOGIN_PATH}?redirect=${redirect}`);
  }
}

interface RequestSideEffects {
  clearSession?: () => void;
  notifyError?: (message: string) => void;
  redirectToLogin?: () => void;
}

function getDefaultSideEffects(): Required<RequestSideEffects> {
  return {
    clearSession,
    notifyError: (message: string) => ElMessage.error(message),
    redirectToLogin,
  };
}

export function buildAuthHeaderConfig(config: InternalAxiosRequestConfig, token?: string) {
  if (!token) {
    return config;
  }

  const headers = (config.headers ??= {} as InternalAxiosRequestConfig['headers']);
  headers[TOKEN_HEADER_KEY] = `${TOKEN_PREFIX}${token}`;
  return config;
}

export function handleResponseError(
  error: AxiosError<ApiResponse<unknown>>,
  sideEffects: RequestSideEffects = {},
) {
  const { clearSession, notifyError, redirectToLogin } = {
    ...getDefaultSideEffects(),
    ...sideEffects,
  };
  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.msg || error.message || '网络异常';

  if (statusCode === 401) {
    clearSession();
    redirectToLogin();
  }

  notifyError(errorMessage);
  return Promise.reject(error);
}

export function unwrapResponseData<T>(
  result: ApiResponse<T>,
  sideEffects: RequestSideEffects = {},
) {
  const { clearSession, notifyError, redirectToLogin } = {
    ...getDefaultSideEffects(),
    ...sideEffects,
  };

  if (result.code === 200) {
    return result.data;
  }

  if (result.code === 401) {
    clearSession();
    redirectToLogin();
  }

  notifyError(result.tip || result.msg || '请求失败');
  return Promise.reject(new Error(result.msg || 'Request Error'));
}

service.interceptors.request.use((config) => {
  const token = getAccessToken();
  return buildAuthHeaderConfig(config, token);
});

service.interceptors.response.use((response) => response, handleResponseError);

export async function request<T>(config: AxiosRequestConfig) {
  const response = await service.request<ApiResponse<T>>(config);
  return unwrapResponseData(response.data);
}

export default service;
