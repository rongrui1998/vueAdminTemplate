import { readJson } from '../utils/json.js';

export function getDashboardStatistics() {
  return readJson('dashboard-statistics.json');
}
