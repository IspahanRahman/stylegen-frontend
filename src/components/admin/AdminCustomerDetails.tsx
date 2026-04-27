'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  Ban,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit,
  Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const mockCustomerDetails = {
  id: 'CUST-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  status: 'active',
  avatar: null,
  joined: '2024-01-15',
  lastActive: '2024-03-25',
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: 'addr-2',
      type: 'Work',
      street: '456 Business Ave',
      apartment: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ],
  stats: {
    totalOrders: 12,
    totalSpent: 2456.0,
    averageOrderValue: 204.67,
    lastOrderDate: '2024-03-25',
    productsPurchased: 15,
    returns: 1,
    reviews: 8,
    averageRating: 4.5,
  },
  recentOrders: [
    { id: 'ORD-001', date: '2024-03-25', total: 299.99, status: 'processing', items: 2 },
    { id: 'ORD-008', date: '2024-03-10', total: 189.99, status: 'delivered', items: 1 },
    { id: 'ORD-005', date: '2024-02-28', total: 459.99, status: 'delivered', items: 3 },
  ],
  activity: [
    { action: 'Order placed', description: 'Order #ORD-001', date: '2024-03-25' },
    {
      action: 'Review submitted',
      description: '5-star review for Leather Bag',
      date: '2024-03-15',
    },
    { action: 'Address updated', description: 'Added work address', date: '2024-03-01' },
    { action: 'Account created', description: 'Joined StyleGen', date: '2024-01-15' },
  ],
  notes: [
    {
      id: 1,
      content: 'VIP customer - prefers express shipping',
      author: 'Admin',
      date: '2024-02-15',
    },
    {
      id: 2,
      content: 'Contacted support about sizing - resolved',
      author: 'Support',
      date: '2024-01-20',
    },
  ],
};

const statusConfig = {
  active: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  inactive: { color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
  banned: { color: 'bg-red-100 text-red-700', icon: Ban },
};

export default function AdminCustomerDetails() {
  const router = useRouter();
  const [customer, setCustomer] = useState(mockCustomerDetails);
  const [newNote, setNewNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: customer.notes.length + 1,
      content: newNote,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
    };
    setCustomer({ ...customer, notes: [note, ...customer.notes] });
    setNewNote('');
    toast.success('Note added successfully');
  };

  const toggleCustomerStatus = (newStatus: string) => {
    setCustomer({ ...customer, status: newStatus });
    toast.success(`Customer status updated to ${newStatus}`);
    setShowStatusModal(false);
  };

  const status = statusConfig[customer.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Manage Status
          </button>
          <button className="px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            <Mail className="h-4 w-4 inline mr-2" />
            Email Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        status.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {customer.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined {formatDate(customer.joined)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{customer.stats.totalOrders}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(customer.stats.totalSpent)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Products Purchased</p>
                <p className="text-xl font-bold text-gray-900">
                  {customer.stats.productsPurchased}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
