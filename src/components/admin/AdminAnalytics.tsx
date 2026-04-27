'use client';

import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils/cn';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  Calendar,
  RefreshCcw,
} from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

const iconMap: Record<string, any> = {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
};

export default function AdminAnalytics() {
  const {
    data,
    timeRange,
    isLoading,
    error,
    lastUpdated,
    statsCards,
    handleExport,
    handleTimeRangeChange,
    clearError,
    getChartData,
    topProducts,
    topCategories,
  } = useAdminAnalytics();

  const chartData = getChartData();

  // Loading State
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your store performance
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-400">
                • Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const IconComponent = iconMap[stat.icon];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    stat.color === 'blue' && 'bg-blue-50',
                    stat.color === 'green' && 'bg-green-50',
                    stat.color === 'purple' && 'bg-purple-50',
                    stat.color === 'orange' && 'bg-orange-50'
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      className={cn(
                        'h-5 w-5',
                        stat.color === 'blue' && 'text-blue-600',
                        stat.color === 'green' && 'text-green-600',
                        stat.color === 'purple' && 'text-purple-600',
                        stat.color === 'orange' && 'text-orange-600'
                      )}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    stat.growth > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {stat.growth > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{stat.growth}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-4 w-4" />
            {timeRange === 'monthly' && 'Monthly Revenue'}
            {timeRange === 'weekly' && 'Weekly Revenue'}
            {timeRange === 'yearly' && 'Yearly Revenue'}
          </div>
        </div>

        {chartData && data ? (
          <div className="h-64 flex items-end gap-2">
            {data.revenue.monthly.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full">
                  <div
                    className="w-full bg-orange-500 rounded-t-lg hover:bg-orange-600 transition-all cursor-pointer group-hover:opacity-80"
                    style={{ height: chartData.datasets[0].getBarHeight(value) }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(value)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {chartData.labels[index]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-sm font-bold w-6',
                      index < 3 ? 'text-orange-500' : 'text-gray-400'
                    )}>
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No product data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-sm font-bold w-6',
                      index < 3 ? 'text-orange-500' : 'text-gray-400'
                    )}>
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.sales} items</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No category data available</p>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      {error && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
