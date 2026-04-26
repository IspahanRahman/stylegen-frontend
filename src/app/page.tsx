'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProductAPI } from '@/lib/mock/api';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import Skeleton from '@/components/ui/Skeleton';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await mockProductAPI.getAll({ featured: true });
        if (!mounted) return;
        setFeatured(resp.products?.slice(0, 4) || []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load featured products');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              StyleGen — Curated Leather Goods
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Handcrafted premium leather products designed to last. Explore our curated selection
              and find your next statement piece.
            </p>

            <div className="flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-orange-600"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Browse Collection
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden bg-white shadow">
                <Image
                  src="/images/hero/hero-1.jpg"
                  alt="Hero 1"
                  width={560}
                  height={360}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-white shadow">
                <Image
                  src="/images/hero/hero-2.jpg"
                  alt="Hero 2"
                  width={560}
                  height={360}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Picks</h2>
            <Link href="/products" className="text-sm text-orange-500">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <Skeleton variant="product" count={4} />
            ) : error ? (
              <div className="col-span-full text-red-600">{error}</div>
            ) : featured.length === 0 ? (
              <div className="col-span-full text-gray-500">No featured products</div>
            ) : (
              featured.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md"
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={p.images?.[0] ?? '/images/placeholder.png'}
                      alt={p.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(p.price)}
                    </div>
                    <div className="text-xs text-gray-500">{p.rating} ★</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
