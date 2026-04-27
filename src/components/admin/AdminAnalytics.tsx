'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils/cn';

const mockAnalyticsData = {
  revenue: {
    total: 456789,
    growth: 12.5,
    monthly: [35000, 42000, 38000, 45000, 52000, 48000, 56000, 51000, 49000, 53000, 58000, 62000],
  },
  orders: {
    total: 1245,
    growth: 8.3,
    monthly: [95, 110, 105, 120, 135, 125, 145, 140, 130, 150, 160, 170],
  },
  customers: {
    total: 890,
    growth: 15.2,
    monthly: [65, 72, 68, 75, 82, 78, 85, 80, 76, 90, 95, 100],
  },
  topProducts: [
    { name: 'Italian Leather Bag', sales: 156, revenue: 46799 },
    { name: 'Slim Leather Wallet', sales: 567, revenue: 45356 },
    { name: 'Oxford Shoes', sales: 234, revenue: 44459 },
    { name: 'Leather Belt', sales: 189, revenue: 11339 },
  ],
  topCategories: [
    { name: 'Bags', sales: 345, revenue: 103456 },
    { name: 'Wallet', sales: 678, revenue: 54234 },
    { name: 'Shoes', sales: 456, revenue: 86678 },
    { name: 'Belt', sales: 234, revenue: 14039 },
  ],
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  const analytics = mockAnalyticsData;

  const maxRevenue = Math.max(...analytics.revenue.monthly);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your store performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            <Download className="h-4 w-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: formatCurrency(analytics.revenue.total),
            growth: analytics.revenue.growth,
            icon: DollarSign,
            color: 'blue',
          },
          {
            label: 'Total Orders',
            value: analytics.orders.total,
            growth: analytics.orders.growth,
            icon: ShoppingBag,
            color: 'green',
          },
          {
            label: 'Total Customers',
            value: analytics.customers.total,
            growth: analytics.customers.growth,
            icon: Users,
            color: 'purple',
          },
          {
            label: 'Products Sold',
            value: analytics.orders.total,
            growth: analytics.orders.growth,
            icon: Package,
            color: 'orange',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
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
                <stat.icon
                  className={cn(
                    'h-5 w-5',
                    stat.color === 'blue' && 'text-blue-600',
                    stat.color === 'green' && 'text-green-600',
                    stat.color === 'purple' && 'text-purple-600',
                    stat.color === 'orange' && 'text-orange-600'
                  )}
                />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-sm',
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
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h2>
        <div className="h-64 flex items-end gap-2">
          {analytics.revenue.monthly.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-orange-500 rounded-t-lg hover:bg-orange-600 transition-colors cursor-pointer"
                style={{ height: `${(value / maxRevenue) * 100}%` }}
              />
              <span className="text-xs text-gray-500">
                {
                  [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ][index]
                }
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
          <div className="space-y-4">
            {analytics.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
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
        </div>
      </div>
    </div>
  );
}
