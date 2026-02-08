'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'The craftsmanship is exceptional. Wore it to my daughter\'s wedding and received countless compliments.',
    author: 'Rajesh M.',
    role: 'Collector',
  },
  {
    quote: 'Finally a luxury watch brand that delivers on both design and reliability. The CHRONO Submariner is my daily driver.',
    author: 'Priya S.',
    role: 'Entrepreneur',
  },
  {
    quote: 'Impeccable service from order to delivery. The packaging alone felt like unboxing a piece of art.',
    author: 'Vikram K.',
    role: 'Finance Executive',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-luxury-dark/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl gold-text tracking-wider">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-luxury-cream/70 tracking-widest text-sm">
            TRUSTED BY COLLECTORS WORLDWIDE
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-luxury-charcoal rounded-sm bg-luxury-black/50 hover:border-luxury-gold/30 transition-colors"
            >
              <p className="text-6xl text-luxury-gold/30 font-serif">&ldquo;</p>
              <p className="text-luxury-cream/90 leading-relaxed mt-2">{t.quote}</p>
              <p className="mt-6 text-luxury-gold text-sm tracking-wider">{t.author}</p>
              <p className="text-luxury-silver/70 text-xs">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
