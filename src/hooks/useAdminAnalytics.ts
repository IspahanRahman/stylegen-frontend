import { useEffect, useCallback } from 'react';
import { useAdminAnalyticsStore } from '@/lib/store/adminAnalyticsStore';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export function useAdminAnalytics() {
  const store = useAdminAnalyticsStore();

  useEffect(() => {
    store.fetchAnalytics();
  }, []); // Fetch on mount

  const handleExport = useCallback(async () => {
    try {
      const downloadUrl = await store.exportReport();
      window.open(downloadUrl, '_blank');
      return true;
    } catch (error: any) {
      console.error('Export failed:', error);
      return false;
    }
  }, [store]);

  const handleTimeRangeChange = useCallback((range: 'weekly' | 'monthly' | 'yearly') => {
    store.setTimeRange(range);
  }, [store]);

  const getChartData = useCallback(() => {
    if (!store.data) return null;

    const monthlyData = store.data.revenue.monthly;
    const maxRevenue = Math.max(...monthlyData);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      labels: months,
      datasets: [
        {
          data: monthlyData,
          maxValue: maxRevenue,
          getBarHeight: (value: number) => {
            if (maxRevenue === 0) return '0%';
            return `${(value / maxRevenue) * 100}%`;
          },
        },
      ],
    };
  }, [store.data]);

  return {
    // State
    data: store.data,
    timeRange: store.timeRange,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,
    statsCards: store.getStatsCards(),

    // Actions
    fetchAnalytics: store.fetchAnalytics,
    handleExport,
    handleTimeRangeChange,
    clearError: store.clearError,
    getChartData,

    // Computed
    topProducts: store.data?.topProducts || [],
    topCategories: store.data?.topCategories || [],
    revenueData: store.data?.revenue || null,
    ordersData: store.data?.orders || null,
    customersData: store.data?.customers || null,
  };
}
