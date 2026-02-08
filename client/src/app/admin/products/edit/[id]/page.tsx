'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { productsApi, adminApi } from '@/lib/api';
import type { Product } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    model: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: 'false',
    strapType: '',
    dialColor: '',
  });
  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (!id) return;
    productsApi.byId(id).then((res) => {
      const p = (res as { product?: Product }).product;
      if (p) {
        setProduct(p);
        setForm({
          name: p.name,
          model: p.model,
          description: p.description,
          price: String(p.price),
          category: p.category,
          stock: String(p.stock ?? 0),
          featured: p.featured ? 'true' : 'false',
          strapType: p.specifications?.strapType ?? '',
          dialColor: p.specifications?.dialColor ?? '',
        });
      }
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (newImages) for (let i = 0; i < newImages.length; i++) fd.append('images', newImages[i]);
      const res = await adminApi.updateProduct(id, fd);
      if ((res as { success?: boolean }).success) {
        toast.success('Product updated');
        router.push('/admin/products');
      } else throw new Error((res as { message?: string }).message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-luxury-gold/80 hover:text-luxury-gold text-sm">
          ← Products
        </Link>
        <h1 className="font-serif text-3xl gold-text tracking-wider">Edit Product</h1>
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
        <div>
          <label className="block text-xs text-luxury-gold tracking-wider uppercase mb-1">Add more images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
            className="w-full bg-luxury-charcoal border border-luxury-gold/30 rounded-sm px-4 py-2 text-luxury-cream text-sm"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold px-6 py-2 text-sm tracking-wider text-luxury-gold rounded-sm hover:bg-luxury-gold/10 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Update Product'}
          </button>
          <Link href="/admin/products" className="px-6 py-2 text-sm text-luxury-cream/80 hover:text-luxury-gold">
            Cancel
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
