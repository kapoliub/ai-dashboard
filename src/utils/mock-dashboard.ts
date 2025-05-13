export interface Metrics {
    users: number;
    sales: number;
    activity: number; // %
  }
  
  export const getDashboardMetrics = (): Promise<Metrics> =>
    new Promise(res => {
      // імітуємо fetch 200 ms
      setTimeout(() => res({ users: 1234, sales: 5678, activity: 89 }), 200);
    });
  