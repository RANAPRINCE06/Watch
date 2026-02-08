'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { productsApi, type Product } from '@/lib/api';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Latest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    model: searchParams.get('model') || '',
    strapType: searchParams.get('strapType') || '',
    dialColor: searchParams.get('dialColor') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });
  const [filterOptions, setFilterOptions] = useState<{
    models: string[];
    strapTypes: string[];
    dialColors: string[];
    categories: string[];
  }>({ models: [], strapTypes: [], dialColors: [], categories: [] });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 12,
        sort: filters.sort,
      };
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.model) params.model = filters.model;
      if (filters.strapType) params.strapType = filters.strapType;
      if (filters.dialColor) params.dialColor = filters.dialColor;
      const res = await productsApi.list(params);
      setProducts(res.products || []);
      setTotal(res.total ?? 0);
      setPages(res.pages ?? 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    Promise.all([
      productsApi.filters(),
      productsApi.categories(),
    ]).then(([f, c]) => {
      setFilterOptions({
        models: f.models || [],
        strapTypes: f.strapTypes || [],
        dialColors: f.dialColors || [],
        categories: (c as { categories?: string[] }).categories || [],
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-serif text-4xl gold-text tracking-wider">Collection</h1>
        <p className="mt-2 text-luxury-cream/70 tracking-widest text-sm">FILTER & SORT</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div>
            <label className="text-xs text-luxury-gold tracking-wider uppercase">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream focus:border-luxury-gold outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {filterOptions.categories.length > 0 && (
            <div>
              <label className="text-xs text-luxury-gold tracking-wider uppercase">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream"
              >
                <option value="">All</option>
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-luxury-gold tracking-wider uppercase">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
              className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream"
            />
          </div>
          <div>
            <label className="text-xs text-luxury-gold tracking-wider uppercase">Max Price</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream"
            />
          </div>
          {filterOptions.strapTypes.length > 0 && (
            <div>
              <label className="text-xs text-luxury-gold tracking-wider uppercase">Strap</label>
              <select
                value={filters.strapType}
                onChange={(e) => setFilters((f) => ({ ...f, strapType: e.target.value }))}
                className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream"
              >
                <option value="">All</option>
                {filterOptions.strapTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          {filterOptions.dialColors.length > 0 && (
            <div>
              <label className="text-xs text-luxury-gold tracking-wider uppercase">Dial Color</label>
              <select
                value={filters.dialColor}
                onChange={(e) => setFilters((f) => ({ ...f, dialColor: e.target.value }))}
                className="mt-2 w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-3 py-2 text-luxury-cream"
              >
                <option value="">All</option>
                {filterOptions.dialColors.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => setFilters({
              category: '', minPrice: '', maxPrice: '', model: '', strapType: '', dialColor: '', sort: '-createdAt',
            })}
            className="text-sm text-luxury-gold hover:underline"
          >
            Clear filters
          </button>
        </aside>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-luxury-charcoal rounded-sm animate-pulse" />
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-luxury-cream/60 py-20"
              >
                No watches match your filters.
              </motion.p>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-luxury-gold/50 text-luxury-gold disabled:opacity-40 rounded-sm"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-luxury-cream/80">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-4 py-2 border border-luxury-gold/50 text-luxury-gold disabled:opacity-40 rounded-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
