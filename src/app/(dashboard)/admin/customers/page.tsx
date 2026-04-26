'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Ban,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatDate } from '@/lib/utils/formatCurrency';
import toast from 'react-hot-toast';

const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    orders: 12,
    totalSpent: 2456.00,
    status: 'active',
    joined: '2024-01-15',
  },
  {
    id: 'CUST-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    orders: 8,
    totalSpent: 1587.00,
    status: 'active',
    joined: '2024-02-01',
  },
  {
    id: 'CUST-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    orders: 3,
    totalSpent: 459.00,
    status: 'inactive',
    joined: '2024-01-20',
  },
  {
    id: 'CUST-004',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Houston, USA',
    orders: 0,
    totalSpent: 0,
    status: 'banned',
    joined: '2024-03-01',
  },
];

const statusConfig = {
  active: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Active' },
  inactive: { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: 'Inactive' },
  banned: { color: 'bg-red-100 text-red-700', icon: Ban, label: 'Banned' },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleCustomerStatus = (customerId: string, newStatus: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === customerId ? { ...c, status: newStatus } : c
      )
    );
    toast.success(`Customer status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your customer base ({customers.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const status = statusConfig[customer.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={customer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-600">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.id}</p>
                  </div>
                </div>
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  status.color
                )}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {customer.location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="font-semibold text-gray-900">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowDetails(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  View Details
                </button>
                <select
                  value={customer.status}
                  onChange={(e) => toggleCustomerStatus(customer.id, e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Ban</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
