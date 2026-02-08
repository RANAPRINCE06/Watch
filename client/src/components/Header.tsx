'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Watches' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, logout, isAdmin } = useAuthStore();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-luxury-charcoal/80 bg-luxury-black/90 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-2xl tracking-[0.2em] gold-text">
          CHRONO
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm tracking-widest uppercase transition-colors hover:text-luxury-gold ${
                pathname === link.href ? 'text-luxury-gold' : 'text-luxury-cream/90'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-luxury-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          {isAdmin() && (
            <Link
              href="/admin"
              className="text-sm tracking-widest uppercase text-luxury-gold/80 hover:text-luxury-gold"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/cart"
                className="relative p-2 text-luxury-gold hover:text-luxury-gold-light transition-colors"
                aria-label="Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-luxury-gold text-luxury-black text-xs font-medium flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
              <div className="relative group">
                <button className="text-sm tracking-wider text-luxury-cream/90 hover:text-luxury-gold">
                  {user.name?.split(' ')[0]}
                </button>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-40 py-2 bg-luxury-charcoal border border-luxury-gold/30 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                  >
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-luxury-gold/10">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-luxury-gold/10">
                      Logout
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/cart" className="p-2 text-luxury-gold hover:text-luxury-gold-light transition-colors" aria-label="Cart">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-4 right-20 w-5 h-5 rounded-full bg-luxury-gold text-luxury-black text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link href="/login" className="text-sm tracking-wider text-luxury-cream/90 hover:text-luxury-gold">
                Login
              </Link>
              <Link
                href="/register"
                className="btn-gold px-4 py-2 text-sm tracking-wider rounded-sm text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
              >
                Register
              </Link>
            </>
          )}

          <button
            className="md:hidden p-2 text-luxury-gold"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-luxury-charcoal bg-luxury-black/98 flex flex-col gap-4 py-4 px-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={pathname === link.href ? 'text-luxury-gold' : 'text-luxury-cream/90'}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin() && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-luxury-gold/80">
                Admin
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
