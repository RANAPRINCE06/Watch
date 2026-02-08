'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isAdmin } = useAuthStore();

  useEffect(() => {
    if (typeof token === 'undefined') return;
    if (!token || !user) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (!isAdmin()) {
      router.replace('/');
    }
  }, [token, user, isAdmin, router]);

  if (!token || !user) return null;
  if (!isAdmin()) return null;

  const nav = [
    { href: '/admin', label: 'Orders' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/products/new', label: 'Add Product' },
    { href: '/admin/coupons', label: 'Coupons' },
  ];

  return (
    <div className="min-h-screen flex bg-luxury-black">
      <aside className="w-56 border-r border-luxury-charcoal bg-luxury-dark shrink-0 flex flex-col">
        <div className="p-6 border-b border-luxury-charcoal">
          <Link href="/" className="font-serif text-xl gold-text tracking-wider">
            CHRONO
          </Link>
          <p className="mt-1 text-xs text-luxury-silver/70">Admin</p>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-sm text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-luxury-gold/20 text-luxury-gold'
                  : 'text-luxury-cream/80 hover:text-luxury-gold hover:bg-luxury-charcoal/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-luxury-charcoal">
          <Link href="/" className="text-xs text-luxury-gold/80 hover:text-luxury-gold">
            ← Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
