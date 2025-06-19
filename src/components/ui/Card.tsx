import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Componente Card principal (exportado como named export)
export const Card: React.FC<CardProps> = ({ // Alterado de `export default Card` para `export const Card`
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `bg-white rounded-xl shadow-sm border border-neutral-200 ${paddingClasses[padding]} ${className}`;

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component className={baseClasses} {...motionProps}>
      {children}
    </Component>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// Componente CardContent (exportado como named export)
export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-neutral-700 ${className}`}>
      {children}
    </div>
  );
};