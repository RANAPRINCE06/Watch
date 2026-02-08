'use client';

import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-luxury-charcoal">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800&q=80)',
              }}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-luxury-gold rounded-sm" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl gold-text tracking-wider">
            Our Story
          </h2>
          <p className="mt-6 text-luxury-cream/80 leading-relaxed">
            Since our founding, CHRONO has stood for uncompromising quality and timeless design.
            Each timepiece is a fusion of heritage craftsmanship and contemporary precision—
            built for those who appreciate the finer things in life.
          </p>
          <p className="mt-4 text-luxury-cream/70 leading-relaxed">
            From the drawing board to your wrist, every detail is considered. We source the finest
            materials and partner with master watchmakers to create pieces that transcend trends.
          </p>
          <motion.div
            className="mt-8 flex gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <p className="text-3xl font-serif text-luxury-gold">150+</p>
              <p className="text-sm text-luxury-cream/60 tracking-wider">Designs</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-luxury-gold">50K+</p>
              <p className="text-sm text-luxury-cream/60 tracking-wider">Clients</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-luxury-gold">12</p>
              <p className="text-sm text-luxury-cream/60 tracking-wider">Countries</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
