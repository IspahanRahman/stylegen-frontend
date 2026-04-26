'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mockOrderAPI } from '@/lib/mock/api';
import { formatCurrency, formatDate } from '@/lib/utils/formatCurrency';
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    description: 'Order is being processed',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Package,
    description: 'Order is being prepared',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Truck,
    description: 'Order is on the way',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
    description: 'Order has been delivered',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    description: 'Order has been cancelled',
  },
};

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      // Add more mock orders for demonstration
      const response = await mockOrderAPI.getUserOrders('user-1');
      const moreOrders = [
        {
          id: 'order-3',
          userId: 'user-1',
          items: [
            {
              productId: '2',
              name: 'Classic Leather Oxford Shoes',
              quantity: 1,
              price: 189.99,
              size: '9',
              image: '/images/products/shoes-1.jpg',
            },
          ],
          totalPrice: 189.99,
          status: 'shipped',
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-03-25',
          createdAt: '2024-03-18',
          shippedAt: '2024-03-20',
        },
        {
          id: 'order-4',
          userId: 'user-1',
          items: [
            {
              productId: '4',
              name: 'Handcrafted Leather Belt',
              quantity: 2,
              price: 59.99,
              size: '34',
              image: '/images/products/belt-1.jpg',
            },
            {
              productId: '3',
              name: 'Slim Leather Wallet',
              quantity: 1,
              price: 79.99,
              size: 'One Size',
              image: '/images/products/wallet-1.jpg',
            },
          ],
          totalPrice: 199.97,
          status: 'processing',
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          trackingNumber: null,
          estimatedDelivery: null,
          createdAt: '2024-03-22',
          shippedAt: null,
        },
        {
          id: 'order-5',
          userId: 'user-1',
          items: [
            {
              productId: '5',
              name: 'Premium Leather T-Shirt',
              quantity: 1,
              price: 149.99,
              size: 'L',
              image: '/images/products/tshirt-1.jpg',
            },
          ],
          totalPrice: 149.99,
          status: 'delivered',
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          trackingNumber: 'TRK555666777',
          estimatedDelivery: '2024-03-15',
          createdAt: '2024-03-10',
          shippedAt: '2024-03-12',
          deliveredAt: '2024-03-15',
        },
      ];

      setOrders([...response.orders, ...moreOrders]);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item: any) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleDownloadInvoice = (order: any) => {
    // Simulate invoice download
    alert(`Downloading invoice for Order #${order.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start shopping to create your first order'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Products
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                          status.color
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6 bg-gray-50">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.map((item: any) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {order.trackingNumber && (
                      <div>
                        <span className="text-gray-500">Tracking Number:</span>
                        <p className="font-medium text-gray-900">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <span className="text-gray-500">Estimated Delivery:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    {order.shippedAt && (
                      <div>
                        <span className="text-gray-500">Shipped Date:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(order.shippedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>

                  {order.status === 'shipped' && (
                    <Link
                      href={`/user/track-order?order=${order.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Truck className="h-4 w-4" />
                      Track Package
                    </Link>
                  )}

                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    statusConfig[selectedOrder.status as keyof typeof statusConfig].color
                  )}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{formatCurrency(selectedOrder.totalPrice)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} • {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-gray-700">
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
