'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { formatCurrency, calculateDiscount } from '@/lib/utils/formatCurrency';

export default function ProductCard({ product }: { product: any }) {
  const addToCart = useCartStore((s) => s.addItem);
  const addWishlist = useWishlistStore((s) => s.add);

  const price = product.price ?? 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discounted = hasDiscount ? calculateDiscount(price, product.discount) : price;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
      <Link
        href={`/products/${product.id}`}
        className="block mb-4 overflow-hidden rounded-lg bg-gray-100 aspect-square"
      >
        <img
          src={product.images?.[0] ?? '/images/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(discounted)}</div>
          {hasDiscount && (
            <div className="text-xs text-gray-400 line-through">{formatCurrency(price)}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: discounted,
              originalPrice: price,
              discount: product.discount,
              quantity: 1,
              image: product.images?.[0] ?? '',
              stock: product.stock ?? 10,
            })
          }
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>

        <button
          onClick={() =>
            addWishlist({
              productId: product.id,
              name: product.name,
              price: discounted,
              image: product.images?.[0] ?? '',
            })
          }
          className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
