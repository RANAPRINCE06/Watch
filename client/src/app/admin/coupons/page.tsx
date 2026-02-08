'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  validUntil: string;
  usedCount: number;
  active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.coupons().then((res) => {
      setCoupons((res as { coupons?: Coupon[] }).coupons || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl gold-text tracking-wider mb-8">Coupons</h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="border border-luxury-charcoal rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-charcoal/50 text-left">
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Code</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Type</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Value</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Valid Until</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Used</th>
                <th className="p-3 text-xs text-luxury-gold tracking-wider uppercase">Active</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-luxury-charcoal">
                  <td className="p-3 text-luxury-gold font-mono">{c.code}</td>
                  <td className="p-3 text-sm">{c.discountType}</td>
                  <td className="p-3 text-sm">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td className="p-3 text-sm text-luxury-cream/80">
                    {new Date(c.validUntil).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm">{c.usedCount}</td>
                  <td className="p-3">{c.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
