'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import GoldButton from '@/components/GoldButton';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      const data = res as { token?: string; user?: { id: string; name: string; email: string; role: string } };
      if (data.token && data.user) {
        setAuth(
          { _id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role },
          data.token
        );
        toast.success('Account created');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-luxury-charcoal rounded-sm p-8 bg-luxury-dark/50"
      >
        <h1 className="font-serif text-3xl gold-text tracking-wider text-center">Register</h1>
        <p className="mt-2 text-center text-luxury-cream/70 text-sm">Create your CHRONO account</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream focus:border-luxury-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream focus:border-luxury-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-3 text-luxury-cream focus:border-luxury-gold outline-none"
            />
            <p className="mt-1 text-xs text-luxury-cream/50">At least 6 characters</p>
          </div>
          <GoldButton type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </GoldButton>
        </form>
        <p className="mt-6 text-center text-sm text-luxury-cream/70">
          Already have an account?{' '}
          <Link href="/login" className="text-luxury-gold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
