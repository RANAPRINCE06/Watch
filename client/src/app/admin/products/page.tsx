'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import type { Product } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.products().then((res) => {
      setProducts((res as { products?: Product[] }).products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl gold-text tracking-wider">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn-gold px-4 py-2 text-sm tracking-wider rounded-sm text-luxury-gold hover:bg-luxury-gold/10"
        >
          Add Product
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border border-luxury-charcoal rounded-sm overflow-hidden bg-luxury-dark/30"
            >
              <div className="relative aspect-[3/4] bg-luxury-charcoal">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luxury-gold/40">No image</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-luxury-gold">{p.name}</p>
                <p className="text-sm text-luxury-cream/70">₹{p.price?.toLocaleString()} · Stock: {p.stock}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/products/edit/${p._id}`}
                    className="text-sm text-luxury-gold hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p._id, p.name)}
                    className="text-sm text-red-400/80 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
