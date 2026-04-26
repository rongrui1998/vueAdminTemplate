import { findMockAccount, getMockUserInfoByToken, mockAccounts } from '@/mock/data/auth';
import { menuData } from '@/mock/data/menus';

describe('mock contracts', () => {
  it('exposes the login accounts and user payload shape', () => {
    expect(mockAccounts[0]).toEqual(
      expect.objectContaining({
        password: expect.any(String),
        token: expect.any(String),
        username: expect.any(String),
      }),
    );

    expect(findMockAccount('admin', '123456')?.token).toBe('mock-access-token-admin');
    expect(getMockUserInfoByToken('mock-access-token-editor')).toEqual(
      expect.objectContaining({
        nickname: expect.any(String),
        permissions: expect.any(Array),
        roles: expect.any(Array),
      }),
    );
  });

  it('exposes a menu tree with permission metadata', () => {
    expect(Array.isArray(menuData)).toBe(true);
    expect(menuData[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        path: expect.any(String),
        type: expect.any(String),
      }),
    );
    expect(menuData[1]?.children?.[0]?.permission).toBe('demo:crud:view');
    expect(menuData[1]?.children?.[1]?.permission).toBe('demo:permission:view');
    expect(menuData[1]?.children?.[1]?.path).toBe('permission');
  });
});
