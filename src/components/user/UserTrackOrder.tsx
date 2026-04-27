'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockOrderAPI } from '@/lib/mock/api';
import { formatDate } from '@/lib/utils/formatCurrency';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const trackingSteps = [
  { id: 1, label: 'Order Placed', icon: Package },
  { id: 2, label: 'Processing', icon: Clock },
  { id: 3, label: 'Shipped', icon: Truck },
  { id: 4, label: 'Out for Delivery', icon: MapPin },
  { id: 5, label: 'Delivered', icon: CheckCircle2 },
];

const mockTrackingHistory = [
  {
    status: 'Package delivered',
    location: 'New York, NY',
    timestamp: '2024-03-25 14:30',
    completed: true,
  },
  {
    status: 'Out for delivery',
    location: 'New York, NY',
    timestamp: '2024-03-25 08:15',
    completed: true,
  },
  {
    status: 'Arrived at local facility',
    location: 'New York, NY',
    timestamp: '2024-03-25 06:00',
    completed: true,
  },
  {
    status: 'In transit',
    location: 'Philadelphia, PA',
    timestamp: '2024-03-24 22:45',
    completed: true,
  },
  {
    status: 'Departed facility',
    location: 'Newark, NJ',
    timestamp: '2024-03-24 15:30',
    completed: true,
  },
  {
    status: 'Package received',
    location: 'Newark, NJ',
    timestamp: '2024-03-24 10:00',
    completed: true,
  },
  {
    status: 'Order processed',
    location: 'StyleGen Warehouse',
    timestamp: '2024-03-23 16:00',
    completed: true,
  },
];

export default function UserTrackOrder() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [trackingHistory, setTrackingHistory] = useState(mockTrackingHistory);
  const [currentStep, setCurrentStep] = useState(3); // Simulating "Shipped" status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await mockOrderAPI.getUserOrders('user-1');
      const found = response.orders.find((o: any) => o.id === orderId);
      setOrder(found || response.orders[0]);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="text-center py-12">
        <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Track Your Order
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your tracking number to get started
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter tracking number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Track
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Order #{order?.id} • Tracking #{order?.trackingNumber || 'N/A'}
        </p>
      </div>

      {/* Tracking Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="relative">
          {/* Progress Bar */}
          <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (trackingSteps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row justify-between relative">
            {trackingSteps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className="flex sm:flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-0"
                >
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                      isCompleted
                        ? 'bg-orange-500 border-orange-500'
                        : isCurrent
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-white border-gray-300'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <StepIcon
                        className={cn(
                          'h-5 w-5',
                          isCurrent ? 'text-orange-500' : 'text-gray-400'
                        )}
                      />
                    )}
                  </div>
                  <div className="sm:text-center">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Tracking History
          </h2>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-6">
              {trackingHistory.map((event, index) => (
                <div key={index} className="relative flex gap-4 pl-10">
                  <div
                    className={cn(
                      'absolute left-2.5 w-3 h-3 rounded-full border-2 -translate-x-1/2',
                      event.completed
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white border-gray-300'
                    )}
                  />

                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.location}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {event.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Info Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shipment Details
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-medium text-gray-900">
                {order?.trackingNumber || 'Pending'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Carrier</p>
              <p className="font-medium text-gray-900">FedEx Express</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium text-gray-900">2-Day Shipping</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium text-gray-900">
                {order?.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : 'Pending'}
              </p>
            </div>

            <hr />

            <div>
              <p className="text-sm text-gray-500">Shipping To</p>
              {order?.shippingAddress && (
                <div className="mt-1 text-sm text-gray-900">
                  <p className="font-medium">
                    {order.shippingAddress.street}
                  </p>
                  <p>
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button className="w-full mt-6 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Get Updates
          </button>
        </div>
      </div>
    </div>
  );
}
