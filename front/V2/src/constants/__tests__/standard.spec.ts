import {
  STANDARD_DATA_SOURCE,
  getStandardDataSourceLabel,
  isStandardApiMode,
  resolveStandardDataSource,
} from '@/constants/standard';

describe('standard data source', () => {
  it('falls back to mock mode for unknown values', () => {
    expect(resolveStandardDataSource()).toBe(STANDARD_DATA_SOURCE.mock);
    expect(resolveStandardDataSource('anything-else')).toBe(STANDARD_DATA_SOURCE.mock);
    expect(isStandardApiMode('anything-else')).toBe(false);
    expect(getStandardDataSourceLabel('anything-else')).toBe('本地 Mock');
  });

  it('supports explicit api mode', () => {
    expect(resolveStandardDataSource(STANDARD_DATA_SOURCE.api)).toBe(STANDARD_DATA_SOURCE.api);
    expect(isStandardApiMode(STANDARD_DATA_SOURCE.api)).toBe(true);
    expect(getStandardDataSourceLabel(STANDARD_DATA_SOURCE.api)).toBe('真实接口');
  });
});
