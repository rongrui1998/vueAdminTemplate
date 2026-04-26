export interface DashboardStatCard {
  key: string;
  title: string;
  value: number;
  unit?: string;
  description: string;
}

export interface DashboardStatistics {
  cards: DashboardStatCard[];
}
