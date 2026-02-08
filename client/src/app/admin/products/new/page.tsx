'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    model: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: 'false',
    caseSize: '',
    movement: '',
    waterResistance: '',
    strapType: '',
    dialColor: '',
    caseMaterial: '',
  });
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (images) for (let i = 0; i < images.length; i++) fd.append('images', images[i]);
      const res = await adminApi.addProduct(fd);
      if ((res as { success?: boolean }).success) {
        toast.success('Product added');
        router.push('/admin/products');
      } else throw new Error((res as { message?: string }).message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-luxury-gold/80 hover:text-luxury-gold text-sm">
          ← Products
        </Link>
        <h1 className="font-serif text-3xl gold-text tracking-wider">Add Product</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
          />
        </div>
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Model</label>
          <input
            required
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
          />
        </div>
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Price</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
            />
          </div>
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Category</label>
          <input
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="e.g. Classic, Sport"
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
          />
        </div>
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Featured</label>
          <select
            value={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.value }))}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Strap Type</label>
            <input
              value={form.strapType}
              onChange={(e) => setForm((f) => ({ ...f, strapType: e.target.value }))}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
            />
          </div>
          <div>
            <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Dial Color</label>
            <input
              value={form.dialColor}
              onChange={(e) => setForm((f) => ({ ...f, dialColor: e.target.value }))}
              className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream text-sm"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold px-6 py-2 text-sm tracking-wider text-luxury-gold rounded-sm hover:bg-luxury-gold/10 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Add Product'}
          </button>
          <Link href="/admin/products" className="px-6 py-2 text-sm text-luxury-cream/80 hover:text-luxury-gold">
            Cancel
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
