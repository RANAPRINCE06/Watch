'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import type { Order } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.orders().then((res) => {
      setOrders((res as { orders?: Order[] }).orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <h1 className="font-serif text-3xl gold-text tracking-wider mb-8">Orders</h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-luxury-charcoal">
            <thead>
              <tr className="bg-luxury-charcoal/50 text-left">
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Order ID</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Customer</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Total</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Status</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Payment</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-luxury-charcoal">
                  <td className="p-3 text-sm text-luxury-cream/90">#{order._id.slice(-8)}</td>
                  <td className="p-3 text-sm">
                    {typeof (order as Order & { userId?: { name?: string; email?: string } }).userId === 'object'
                      ? (order as Order & { userId?: { name?: string; email?: string } }).userId?.email ?? '—'
                      : '—'}
                  </td>
                  <td className="p-3 text-sm text-luxury-gold">₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="text-sm capitalize">{order.orderStatus}</span>
                  </td>
                  <td className="p-3 text-sm">{order.paymentStatus}</td>
                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-luxury-charcoal border border-luxury-gold/30 rounded px-2 py-1 text-sm text-luxury-cream"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
