'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  AlertCircle,
  User,
} from 'lucide-react';
import { mockProductAPI, mockOrderAPI } from '@/lib/mock/api';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function UserDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    wishlistItems: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        mockOrderAPI.getUserOrders('user-1'),
        mockProductAPI.getAll({ featured: true }),
      ]);

      const orders = ordersResponse.orders;
      setStats({
        totalOrders: orders.length,
        activeOrders: orders.filter((o: any) =>
          ['pending', 'processing', 'shipped'].includes(o.status)
        ).length,
        wishlistItems: 5, // Mock data
        totalSpent: orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0),
      });

      setRecentOrders(orders.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton variant="card" count={4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <Skeleton variant="text" count={1} />
              </div>
              <div className="space-y-4">
                <Skeleton variant="avatar" count={3} />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Skeleton variant="text" count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-orange-100">Here's what's happening with your orders today.</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Shop Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
          <p className="text-sm text-gray-500">Active Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-50 rounded-lg">
              <Star className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
          <p className="text-sm text-gray-500">Wishlist Items</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/user/orders"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
                <Link
                  href="/products"
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium mt-2 inline-block"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item(s) • {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {order.items.slice(0, 2).map((item: any) => (
                      <div key={item.productId} className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                          {item.name.charAt(0)}
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-700">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-orange-50 rounded-lg">
                <ShoppingBag className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Browse Products
              </span>
            </Link>

            <Link
              href="/user/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Track Orders
              </span>
            </Link>

            <Link
              href="/user/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Update Profile
              </span>
            </Link>

            <Link
              href="/user/wishlist"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-pink-50 rounded-lg">
                <Star className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                View Wishlist
              </span>
            </Link>
          </div>

          {/* Need Help */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">
              Our support team is here to help you with any questions.
            </p>
            <Link
              href="/support"
              className="text-xs font-medium text-orange-500 hover:text-orange-600"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
