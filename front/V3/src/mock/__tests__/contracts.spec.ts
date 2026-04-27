import { findMockAccount, getMockUserInfoByToken, mockAccounts } from '@/mock/data/auth';
import { menuData } from '@/mock/data/menus';

function collectMenuIds(list: typeof menuData) {
  const ids: string[] = [];

  function walk(items: typeof menuData) {
    items.forEach((item) => {
      ids.push(item.id);

      if (item.children?.length) {
        walk(item.children as typeof menuData);
      }
    });
  }

  walk(list);
  return ids;
}

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

  it('keeps every menu id unique so dynamic route names do not collide', () => {
    const ids = collectMenuIds(menuData);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
