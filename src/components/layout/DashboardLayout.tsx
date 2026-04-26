'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  ShoppingCart,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/user',
  },
  {
    label: 'My Orders',
    icon: ShoppingBag,
    href: '/user/orders',
  },
  {
    label: 'Track Order',
    icon: Package,
    href: '/user/track-order',
  },
  {
    label: 'Wishlist',
    icon: Heart,
    href: '/user/wishlist',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/user/profile',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/user/settings',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              <Link href="/" className="flex items-center gap-2">
                <h1 className="text-xl font-bold">
                  <span className="text-gray-900">Style</span>
                  <span className="text-orange-500">Gen</span>
                </h1>
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-600" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:top-16 lg:bottom-0 lg:inset-auto',
            'pt-16 lg:pt-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="h-screen px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              );
            })}

            <hr className="my-4" />

            {/* Quick Links */}
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Quick Links
              </p>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Back to Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
