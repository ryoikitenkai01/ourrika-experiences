"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Separate interface for custom props
interface CustomButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

// Join with React's base button attributes
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CustomButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, href, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-sans tracking-wide transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[var(--color-terracotta)] text-white hover:bg-[var(--color-terracotta-dark)]",
      secondary: "bg-[var(--color-charcoal)] text-white hover:bg-[var(--color-charcoal-light)]",
      outline: "border border-[var(--color-charcoal)] text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)] hover:text-white",
      ghost: "text-[var(--color-charcoal)] hover:text-[var(--color-terracotta)]"
    };

    const sizes = {
      sm: "h-9 px-4 text-xs uppercase",
      md: "h-12 px-6 text-sm uppercase",
      lg: "h-14 px-8 text-base uppercase"
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <motion.div
           className="inline-block"
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
        >
          <Link href={href} className={combinedClassName}>
            {children}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={combinedClassName}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
