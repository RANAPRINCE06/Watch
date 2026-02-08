'use client';

import { motion } from 'framer-motion';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function GoldButton({
  children,
  onClick,
  href,
  type = 'button',
  className = '',
  disabled,
  variant = 'primary',
}: GoldButtonProps) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'btn-gold text-luxury-gold hover:bg-luxury-gold/10 rounded-sm',
    outline: 'border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 rounded-sm',
    ghost: 'text-luxury-gold hover:bg-luxury-gold/5 rounded-sm',
  };

  const Comp = motion.button;
  const props = {
    type: href ? undefined : type,
    onClick: href ? undefined : onClick,
    disabled,
    className: `${base} ${variants[variant]} ${className}`,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${base} ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return <Comp {...props}>{children}</Comp>;
}
