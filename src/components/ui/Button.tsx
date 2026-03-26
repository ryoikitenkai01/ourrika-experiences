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
    
    const baseStyles = "inline-flex items-center justify-center font-sans tracking-wide transition-colors duration-300 rounded-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-[#1A1A1A] text-white hover:bg-[#C56B5C]",
      secondary: "bg-[#1A1A1A] text-white hover:bg-[#333333]",
      outline: "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white",
      ghost: "text-[#1A1A1A] hover:text-[#C56B5C]"
    };

    const sizes = {
      sm: "h-9 px-4 text-[11px] tracking-[0.15em] uppercase",
      md: "h-12 px-6 text-[13px] tracking-[0.15em] uppercase",
      lg: "h-14 px-8 text-[13px] tracking-[0.15em] uppercase"
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
        {...(props as Record<string, unknown>)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
