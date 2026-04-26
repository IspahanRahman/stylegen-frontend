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

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  const analytics = mockAnalyticsData;

  const maxRevenue = Math.max(...analytics.revenue.monthly);

  return (
    <div className="space-y-6">
      {/* Header */}
