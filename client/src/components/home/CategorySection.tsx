'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { productsApi } from '@/lib/api';

const fallbackCategories = [
  { name: 'Classic', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80' },
  { name: 'Sport', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { name: 'Diver', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80' },
  { name: 'Chronograph', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80' },
];

export default function CategorySection() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    productsApi.categories().then((res) => setCategories(res.categories || [])).catch(() => {});
  }, []);

  const items = categories.length
    ? categories.map((name, i) => ({ name, image: fallbackCategories[i % fallbackCategories.length]?.image || fallbackCategories[0].image }))
    : fallbackCategories;

  return (
    <section className="py-24 px-4 sm:px-6 bg-luxury-dark/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl gold-text tracking-wider">
            By Category
          </h2>
          <p className="mt-4 text-luxury-cream/70 tracking-widest text-sm">
            FIND YOUR SIGNATURE STYLE
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/products?category=${encodeURIComponent(item.name)}`}>
                <div className="group relative aspect-[4/5] rounded-sm overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-luxury-black/50 group-hover:bg-luxury-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <span className="text-xl font-serif text-luxury-gold tracking-wider border-b border-luxury-gold/50 pb-1 group-hover:border-luxury-gold transition-colors">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
