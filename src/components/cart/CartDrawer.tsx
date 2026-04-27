import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartDrawer() {
  const { items, getItemCount } = useCartStore();

  return (
    <div className="w-80 bg-white shadow-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Cart ({getItemCount()})</h3>
        <Link href="/cart" className="text-sm text-orange-500">
          View cart
        </Link>
      </div>
      <div className="space-y-2">
        {items.slice(0, 4).map((it: any) => (
          <div key={`${it.productId}-${it.size}`} className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-xs">
              Img
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-gray-500">{it.quantity} ×</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
