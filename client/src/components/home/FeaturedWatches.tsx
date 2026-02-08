'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi, type Product } from '@/lib/api';

export default function FeaturedWatches() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productsApi.featured().then((res) => setProducts(res.products || [])).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl gold-text tracking-wider">
            Featured Timepieces
          </h2>
          <p className="mt-4 text-luxury-cream/70 tracking-widest text-sm">
            HAND-PICKED FOR THE DISCRIMINATING COLLECTOR
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/products/${product._id}`}>
                <div className="group relative aspect-[3/4] bg-luxury-charcoal overflow-hidden rounded-sm">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-luxury-gold font-medium">{product.name}</p>
                    <p className="text-luxury-cream/80 text-sm">₹{product.price?.toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-3 text-center text-luxury-cream/90 group-hover:text-luxury-gold transition-colors">
                  {product.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-block border border-luxury-gold px-8 py-3 text-sm tracking-widest text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
          >
            View All Watches
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
