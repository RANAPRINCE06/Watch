'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

const heroImage = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1920&q=80';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const sub2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 2.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.7, ease: 'power2.out' }
      );
      gsap.fromTo(
        sub2Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.85, ease: 'power2.out' }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/40 to-luxury-black" />
      <div className="relative z-10 text-center px-4">
        <h1
          ref={titleRef}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] gold-text"
        >
          CHRONO
        </h1>
        <p
          ref={subRef}
          className="mt-4 text-luxury-gold-light/90 text-lg sm:text-xl tracking-[0.4em] uppercase"
        >
          Crafted for Eternity
        </p>
        <p ref={sub2Ref} className="mt-2 text-luxury-cream/80 text-sm sm:text-base tracking-widest">
          Swiss-inspired luxury timepieces
        </p>
        <div ref={ctaRef} className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="btn-gold px-8 py-4 text-sm tracking-[0.2em] rounded-sm text-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300"
          >
            Explore Collection
          </Link>
          <Link
            href="/products?featured=true"
            className="border border-luxury-gold/60 px-8 py-4 text-sm tracking-[0.2em] rounded-sm text-luxury-gold/90 hover:bg-luxury-gold/10 transition-all"
          >
            Featured
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="block w-6 h-10 border-2 border-luxury-gold/50 rounded-full">
          <span className="block w-1 h-2 bg-luxury-gold rounded-full mx-auto mt-2 animate-pulse" />
        </span>
      </div>
    </section>
  );
}
