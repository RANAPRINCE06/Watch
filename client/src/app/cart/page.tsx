'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import GoldButton from '@/components/GoldButton';

const GST_RATE = 0.18;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore();
  const gst = Math.round(subtotal() * GST_RATE);
  const grandTotal = subtotal() + gst;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl gold-text">Your cart is empty</h1>
          <p className="mt-4 text-luxury-cream/70">Add timepieces you love from our collection.</p>
          <Link href="/products" className="mt-8 inline-block">
            <GoldButton>Explore Watches</GoldButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-4xl gold-text tracking-wider mb-10"
      >
        Shopping Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.product}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-6 p-4 border border-luxury-charcoal rounded-sm bg-luxury-dark/30"
            >
              <div className="relative w-28 h-28 shrink-0 bg-luxury-charcoal rounded overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luxury-gold/40 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product}`} className="text-luxury-gold hover:underline font-medium">
                  {item.name}
                </Link>
                <p className="mt-1 text-luxury-cream/80">₹{item.price?.toLocaleString()} each</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-luxury-gold/30 rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product)}
                    className="text-sm text-red-400/80 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-luxury-gold font-medium">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 h-fit border border-luxury-charcoal rounded-sm p-6 bg-luxury-dark/30"
        >
          <h2 className="text-lg font-serif text-luxury-gold tracking-wider mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-luxury-cream/80">
              <span>Subtotal</span>
              <span>₹{subtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-luxury-cream/80">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-luxury-gold font-medium pt-2 border-t border-luxury-charcoal">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <GoldButton className="w-full">Proceed to Checkout</GoldButton>
          </Link>
          <button
            onClick={clearCart}
            className="mt-4 w-full text-sm text-luxury-cream/60 hover:text-red-400/80"
          >
            Clear cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}
