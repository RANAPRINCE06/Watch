'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/api';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import GoldButton from '@/components/GoldButton';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = !!useAuthStore((s) => s.token);

  useEffect(() => {
    if (!id) return;
    productsApi.byId(id).then((res) => {
      setProduct(res.product);
      setRelated(res.related || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isLoggedIn) {
      toast.error('Please login to add to cart');
      return;
    }
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity,
    });
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-luxury-cream/70">Product not found.</p>
        <Link href="/products" className="mt-4 inline-block text-luxury-gold hover:underline">
          Back to collection
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'];
  const spec = product.specifications || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <div className="relative">
          <div
            className="relative aspect-square bg-luxury-charcoal rounded-sm overflow-hidden"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${zoom ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 shrink-0 rounded border-2 overflow-hidden transition-colors ${
                    selectedImage === i ? 'border-luxury-gold' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-serif text-3xl md:text-4xl gold-text tracking-wider">
            {product.name}
          </h1>
          <p className="mt-2 text-luxury-cream/70">{product.model}</p>
          <p className="mt-6 text-2xl text-luxury-gold">₹{product.price?.toLocaleString()}</p>
          <p className="mt-6 text-luxury-cream/80 leading-relaxed">{product.description}</p>

          {Object.keys(spec).length > 0 && (
            <div className="mt-8 border-t border-luxury-charcoal pt-6">
              <h3 className="text-sm text-luxury-gold tracking-wider uppercase mb-4">Specifications</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {spec.caseSize && (
                  <>
                    <dt className="text-luxury-cream/60">Case Size</dt>
                    <dd>{spec.caseSize}</dd>
                  </>
                )}
                {spec.movement && (
                  <>
                    <dt className="text-luxury-cream/60">Movement</dt>
                    <dd>{spec.movement}</dd>
                  </>
                )}
                {spec.waterResistance && (
                  <>
                    <dt className="text-luxury-cream/60">Water Resistance</dt>
                    <dd>{spec.waterResistance}</dd>
                  </>
                )}
                {spec.strapType && (
                  <>
                    <dt className="text-luxury-cream/60">Strap</dt>
                    <dd>{spec.strapType}</dd>
                  </>
                )}
                {spec.dialColor && (
                  <>
                    <dt className="text-luxury-cream/60">Dial Color</dt>
                    <dd>{spec.dialColor}</dd>
                  </>
                )}
                {spec.caseMaterial && (
                  <>
                    <dt className="text-luxury-cream/60">Case Material</dt>
                    <dd>{spec.caseMaterial}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-luxury-gold/30 rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10"
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10"
              >
                +
              </button>
            </div>
            <GoldButton onClick={handleAddToCart} disabled={!product.stock}>
              Add to Cart
            </GoldButton>
            <GoldButton onClick={handleBuyNow} variant="outline" disabled={!product.stock}>
              Buy Now
            </GoldButton>
          </div>

          {product.stock !== undefined && (
            <p className="mt-4 text-sm text-luxury-cream/60">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          )}
        </div>
      </motion.div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-2xl gold-text tracking-wider mb-8">Related Watches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
