'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersApi, paymentApi } from '@/lib/api';
import toast from 'react-hot-toast';
import GoldButton from '@/components/GoldButton';

const GST_RATE = 0.18;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  });

  const afterDiscount = Math.max(0, subtotal() - couponDiscount);
  const gst = Math.round(afterDiscount * GST_RATE);
  const grandTotal = afterDiscount + gst;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await ordersApi.validateCoupon(couponCode.trim(), subtotal());
      const data = res as { success?: boolean; discount?: number; couponCode?: string; message?: string };
      if (data.success && data.discount) {
        setCouponDiscount(data.discount);
        setAppliedCoupon(data.couponCode || couponCode);
        toast.success(`Coupon applied. Discount: ₹${data.discount}`);
      } else toast.error(data.message || 'Invalid coupon');
    } catch {
      toast.error('Invalid coupon');
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0 && !orderId) {
      router.replace('/cart');
    }
  }, [token, items.length, orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const orderRes = await ordersApi.create({
        products: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingDetails: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          pincode: form.pincode,
          city: form.city,
          state: form.state,
        },
        couponCode: appliedCoupon || undefined,
        paymentMethod,
      });
      const oid = (orderRes as { order?: { _id: string } }).order?._id;
      if (!oid) throw new Error('Order not created');
      setOrderId(oid);

      const payRes = await paymentApi.createOrder(oid, paymentMethod);
      const data = payRes as {
        razorpayOrderId?: string;
        key?: string;
        orderId?: string;
        clientSecret?: string;
      };

      if (paymentMethod === 'razorpay' && data.razorpayOrderId && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: data.key,
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          order_id: data.razorpayOrderId,
          name: 'CHRONO Luxury',
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            setConfirming(true);
            try {
              await paymentApi.verifyRazorpay({
                orderId: oid,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              clearCart();
              setConfirming(false);
              toast.success('Order placed successfully');
              router.push(`/dashboard?order=${oid}`);
            } catch {
              setConfirming(false);
              toast.error('Payment verification failed');
            }
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'stripe' && data.clientSecret) {
        // Stripe Elements would go here; for demo we'll show a message
        toast.success('Order created. Complete payment on next step.');
        router.push(`/dashboard?order=${oid}`);
      } else {
        // No payment UI (e.g. Razorpay script not loaded) – still create order and redirect
        clearCart();
        toast.success('Order placed');
        router.push(`/dashboard?order=${oid}`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;
  if (items.length === 0 && !orderId) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-4xl gold-text tracking-wider mb-10"
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-luxury-gold text-sm tracking-wider uppercase">Shipping Details</h2>
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
          />
          <input
            required
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
          />
          <textarea
            required
            placeholder="Address"
            rows={3}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none resize-none"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              required
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
              className="col-span-1 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="col-span-1 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="col-span-1 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream placeholder:text-luxury-cream/50 focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <h3 className="text-luxury-gold text-sm tracking-wider uppercase mb-3">Payment</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-luxury-gold"
                />
                <span className="text-sm">Razorpay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="accent-luxury-gold"
                />
                <span className="text-sm">Stripe</span>
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border border-luxury-charcoal rounded-sm p-6 bg-luxury-dark/30 h-fit"
        >
          <h2 className="text-luxury-gold text-sm tracking-wider uppercase mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-6">
            {items.map((item) => (
              <li key={item.product} className="flex gap-3">
                <div className="relative w-16 h-16 shrink-0 bg-luxury-charcoal rounded overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-luxury-cream/90 truncate">{item.name}</p>
                  <p className="text-xs text-luxury-cream/60">Qty: {item.quantity}</p>
                </div>
                <p className="text-luxury-gold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm border-t border-luxury-charcoal pt-4">
            <div className="flex justify-between text-luxury-cream/80">
              <span>Subtotal</span>
              <span>₹{subtotal().toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-400/90">
                <span>Coupon ({appliedCoupon})</span>
                <span>-₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-luxury-cream/80">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-luxury-gold font-medium pt-2">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-sm text-luxury-cream placeholder:text-luxury-cream/50"
            />
            <button type="button" onClick={applyCoupon} className="px-4 py-2 border border-luxury-gold/50 text-luxury-gold text-sm rounded-sm hover:bg-luxury-gold/10">
              Apply
            </button>
          </div>
          <GoldButton
            type="submit"
            className="w-full mt-6"
            disabled={loading || confirming}
          >
            {loading || confirming ? 'Processing…' : 'Place Order'}
          </GoldButton>
        </motion.div>
      </form>
    </div>
  );
}
