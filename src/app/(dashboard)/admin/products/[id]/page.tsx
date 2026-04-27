'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Package,
  Tag,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

const mockProductDetails = {
  id: '1',
  name: 'Italian Leather Weekend Bag',
  price: 299.99,
  discount: 15,
  category: 'Bags',
  stock: 25,
  status: 'active',
  rating: 4.8,
  reviews: 124,
  sales: 156,
  views: 2345,
  description: 'Handcrafted Italian leather weekend bag. Perfect for short trips with ample storage space and durable construction. Made from full-grain leather that develops a beautiful patina over time.',
  features: [
    'Full-grain Italian leather',
    'Hand-stitched details',
    'Brass hardware',
    'Cotton canvas lining',
    'Adjustable shoulder strap',
    'Multiple interior pockets',
    'Reinforced bottom',
  ],
  specifications: {
    dimensions: '20" x 12" x 8"',
    weight: '3.5 lbs',
    material: 'Full-grain Italian leather',
    color: 'Brown',
    capacity: '30L',
  },
  images: [
    '/images/products/bag-1.jpg',
    '/images/products/bag-2.jpg',
    '/images/products/bag-3.jpg',
    '/images/products/bag-4.jpg',
  ],
  sizes: ['One Size'],
  createdAt: '2024-01-15',
  updatedAt: '2024-03-20',
  salesHistory: [
    { month: 'Jan', sales: 12, revenue: 3599.88 },
    { month: 'Feb', sales: 18, revenue: 5399.82 },
    { month: 'Mar', sales: 25, revenue: 7499.75 },
    { month: 'Apr', sales: 20, revenue: 5999.80 },
  ],
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', date: '2024-03-25', quantity: 1, total: 254.99 },
    { id: 'ORD-010', customer: 'Alice Brown', date: '2024-03-23', quantity: 2, total: 509.98 },
    { id: 'ORD-015', customer: 'Bob Wilson', date: '2024-03-20', quantity: 1, total: 254.99 },
  ],
};

export default function AdminProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(mockProductDetails);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const handleDeleteProduct = () => {
    toast.success('Product deleted successfully');
    router.push('/dashboard/admin/products');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">Product ID: {product.id}</span>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                product.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              )}>
                {product.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            <Edit className="h-4 w-4" />
            Edit Product
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                  {selectedImage + 1} / {product.images.length}
                </span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0',
                    selectedImage === index ? 'border-orange-500' : 'border-transparent'
                  )}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 capitalize">{key}</p>
                  <p className="font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Orders */}
        <div className="space-y-6">
          {/* Price & Stock Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Info</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice)}
                  </span>
                  {product.discount > 0 && (
                    <div>
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-sm text-green-600 ml-2">
                        {product.discount}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600">Stock</span>
                <div className="flex items-center gap-2">
                  {product.stock <= 5 ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Package className="h-4 w-4 text-green-500" />
                  )}
                  <span className={cn(
                    'font-medium',
                    product.stock === 0 ? 'text-red-600' : 'text-gray-900'
                  )}>
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600">Category</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600">Sizes</span>
                <div className="flex gap-1">
                  {product.sizes.map((size) => (
                    <span key={size} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600">Sales</span>
                </div>
                <p className="text-xl font-bold text-blue-900">{product.sales}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-600">Views</span>
                </div>
                <p className="text-xl font-bold text-purple-900">{product.views}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">Conversion</span>
                </div>
                <p className="text-xl font-bold text-green-900">
                  {((product.sales / product.views) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-orange-600">Updated</span>
                </div>
                <p className="text-sm font-bold text-orange-900">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/dashboard/admin/orders"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {product.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
