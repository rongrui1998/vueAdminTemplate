export const STANDARD_DATA_SOURCE = {
  mock: 'mock',
  api: 'api',
} as const;

export type StandardDataSource = (typeof STANDARD_DATA_SOURCE)[keyof typeof STANDARD_DATA_SOURCE];

export function resolveStandardDataSource(
  source = import.meta.env.VITE_STANDARD_DATA_SOURCE,
): StandardDataSource {
  return source === STANDARD_DATA_SOURCE.api ? STANDARD_DATA_SOURCE.api : STANDARD_DATA_SOURCE.mock;
}

export function isStandardApiMode(source = import.meta.env.VITE_STANDARD_DATA_SOURCE) {
  return resolveStandardDataSource(source) === STANDARD_DATA_SOURCE.api;
}

export function getStandardDataSourceLabel(source = import.meta.env.VITE_STANDARD_DATA_SOURCE) {
  return resolveStandardDataSource(source) === STANDARD_DATA_SOURCE.api ? '真实接口' : '本地 Mock';
}
