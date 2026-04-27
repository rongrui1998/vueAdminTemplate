import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';
import { buildAuthHeaderConfig, handleResponseError, unwrapResponseData } from '@/utils/request';

function createAxiosError(status = 500, message = '请求失败') {
  return {
    message,
    response: {
      status,
      data: {
        code: status,
        data: null,
        msg: message,
      },
    },
  } as AxiosError<ApiResponse<unknown>>;
}

describe('request helpers', () => {
  it('injects bearer token into request headers', () => {
    const config = buildAuthHeaderConfig(
      {
        headers: {},
      } as InternalAxiosRequestConfig,
      'token-demo',
    );

    expect(config.headers.Authorization).toBe('Bearer token-demo');
  });

  it('clears session and redirects on 401 transport errors', async () => {
    const clearSession = vi.fn();
    const redirectToLogin = vi.fn();
    const notifyError = vi.fn();

    await expect(
      handleResponseError(createAxiosError(401, '登录已失效'), {
        clearSession,
        notifyError,
        redirectToLogin,
      }),
    ).rejects.toMatchObject({
      message: '登录已失效',
    });

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(redirectToLogin).toHaveBeenCalledTimes(1);
    expect(notifyError).toHaveBeenCalledWith('登录已失效');
  });

  it('unwraps successful business responses and rejects failed ones', async () => {
    expect(
      unwrapResponseData({
        code: 200,
        data: {
          id: '1',
        },
        msg: 'success',
      }),
    ).toEqual({ id: '1' });

    const clearSession = vi.fn();
    const redirectToLogin = vi.fn();
    const notifyError = vi.fn();

    await expect(
      Promise.resolve(
        unwrapResponseData(
          {
            code: 401,
            data: null,
            msg: '未授权',
            tip: '请重新登录',
          },
          {
            clearSession,
            notifyError,
            redirectToLogin,
          },
        ),
      ),
    ).rejects.toThrow('未授权');

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(redirectToLogin).toHaveBeenCalledTimes(1);
    expect(notifyError).toHaveBeenCalledWith('请重新登录');
  });
});
