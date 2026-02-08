'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = !!useAuthStore((s) => s.token);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding) return;
    if (!isLoggedIn) {
      toast.error('Please login to add to cart');
      return;
    }
    setAdding(true);
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: 1,
    });
    toast.success('Added to cart');
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-[3/4] bg-luxury-charcoal overflow-hidden rounded-sm">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-luxury-dark flex items-center justify-center text-luxury-gold/50">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div>
              <p className="text-luxury-gold font-medium">{product.name}</p>
              <p className="text-luxury-cream/80 text-sm">₹{product.price?.toLocaleString()}</p>
            </div>
            <motion.button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-gold px-4 py-2 text-xs tracking-wider rounded-sm text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-luxury-gold/10 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {adding ? 'Added' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
        <p className="mt-3 text-center text-luxury-cream/90 group-hover:text-luxury-gold transition-colors">
          {product.name}
        </p>
      </Link>
    </motion.article>
  );
}
