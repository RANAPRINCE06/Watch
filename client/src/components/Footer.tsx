'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const links = [
  { href: '/products', label: 'Collection' },
  { href: '/products?category=men', label: 'Men' },
  { href: '/products?category=women', label: 'Women' },
  { href: '/dashboard', label: 'Orders' },
];

export default function Footer() {
  return (
    <footer className="border-t border-luxury-charcoal bg-luxury-dark mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link href="/" className="font-serif text-3xl tracking-[0.2em] gold-text">
              CHRONO
            </Link>
            <p className="mt-4 text-luxury-cream/70 text-sm leading-relaxed max-w-md">
              Crafted for those who demand excellence. Each timepiece is a testament to precision,
              heritage, and timeless elegance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-luxury-gold text-sm tracking-widest uppercase mb-4">Explore</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-luxury-cream/70 hover:text-luxury-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-luxury-gold text-sm tracking-widest uppercase mb-4">Contact</h4>
            <p className="text-luxury-cream/70 text-sm">support@chronoluxury.com</p>
            <p className="text-luxury-cream/70 text-sm mt-1">+91 98765 43210</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-luxury-charcoal flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-luxury-silver/60 text-xs tracking-wider">
            © {new Date().getFullYear()} CHRONO. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-luxury-silver/60">
            <Link href="#" className="hover:text-luxury-gold transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-luxury-gold transition-colors">Terms</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
