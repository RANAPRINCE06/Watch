'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoaderContext = createContext<{ hide: () => void; isVisible: boolean }>({
  hide: () => {},
  isVisible: true,
});

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const hide = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    const t = setTimeout(hide, 2200);
    return () => clearTimeout(t);
  }, [hide]);

  return (
    <LoaderContext.Provider value={{ hide, isVisible }}>
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-luxury-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="relative w-24 h-24 rounded-full border-2 border-luxury-gold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-luxury-gold-light"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-serif text-xl gold-text">
                C
              </span>
            </motion.div>
            <motion.p
              className="mt-6 font-serif text-2xl tracking-[0.4em] text-luxury-gold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              CHRONO
            </motion.p>
            <motion.p
              className="mt-1 text-sm tracking-[0.3em] text-luxury-silver"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              LUXURY
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </LoaderContext.Provider>
  );
}
