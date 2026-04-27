'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Store,
  Tags,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

const adminNavItems = [
  {
    section: 'Main',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
      },
      {
        label: 'Analytics',
        icon: BarChart3,
        href: '/admin/analytics',
      },
    ],
  },
  {
    section: 'Management',
    items: [
      {
        label: 'Products',
        icon: ShoppingBag,
        href: '/admin/products',
      },
      {
        label: 'Categories',
        icon: Tags,
        href: '/admin/categories',
      },
      {
        label: 'Orders',
        icon: ClipboardList,
        href: '/admin/orders',
      },
      {
        label: 'Customers',
        icon: Users,
        href: '/admin/customers',
      },
    ],
  },
  {
    section: 'Settings',
    items: [
      {
        label: 'Settings',
        icon: Settings,
        href: '/admin/settings',
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              <Link href="/admin" className="flex items-center gap-2">
                <h1 className="text-xl font-bold">
                  <span className="text-gray-900">Style</span>
                  <span className="text-orange-500">Gen</span>
                </h1>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Admin
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100"
                title="View Store"
              >
                <Store className="h-5 w-5 text-gray-600" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Store className="h-4 w-4" />
                      View Store
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
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
            'overflow-y-auto',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="h-screen px-3 py-6 space-y-6">
            {adminNavItems.map((section) => (
              <div key={section.section}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
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
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="px-3 pt-4 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Need Help?
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Check the documentation or contact support
                </p>
                <a
                  href="#"
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  View Documentation →
                </a>
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
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
