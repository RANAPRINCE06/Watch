'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get('order');
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const downloadInvoice = (id: string) => {
    if (!token) return;
    fetch(`${API_URL}/orders/${id}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!token) {
      router.replace('/login?redirect=/dashboard');
      return;
    }
    ordersApi.list().then((res) => {
      setOrders((res as { orders?: Order[] }).orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, router]);

  const cancelOrder = async (id: string) => {
    try {
      await ordersApi.cancel(id);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus: 'cancelled' as const } : o))
      );
    } catch {
      // toast handled by api
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-4xl gold-text tracking-wider">Dashboard</h1>
        <p className="mt-2 text-luxury-cream/70">Welcome back, {user?.name}</p>
        {orderSuccess && (
          <p className="mt-4 p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm text-luxury-gold text-sm">
            Order #{orderSuccess} placed successfully.
          </p>
        )}
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-12"
      >
        <h2 className="text-xl font-serif text-luxury-gold tracking-wider mb-6">Your Orders</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-luxury-cream/60 py-8">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border border-luxury-charcoal rounded-sm p-6 bg-luxury-dark/30"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-luxury-gold font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-luxury-cream/60 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-900/40 text-green-400'
                          : order.orderStatus === 'shipped'
                          ? 'bg-blue-900/40 text-blue-400'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-luxury-gold/20 text-luxury-gold'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <button
                      onClick={() => downloadInvoice(order._id)}
                      className="text-xs text-luxury-gold hover:underline"
                    >
                      Invoice
                    </button>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {order.products?.map((item, j) => (
                    <li key={j} className="text-sm text-luxury-cream/80">
                      {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString()}
                    </li>
                  ))}
                </ul>
                {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="mt-4 text-sm text-red-400/80 hover:text-red-400"
                  >
                    Cancel order
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12 pt-8 border-t border-luxury-charcoal"
      >
        <Link href="/products" className="text-luxury-gold hover:underline text-sm tracking-wider">
          ← Continue shopping
        </Link>
      </motion.div>
    </div>
  );
}
