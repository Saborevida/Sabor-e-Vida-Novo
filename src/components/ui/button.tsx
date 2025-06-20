import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // Ícone de carregamento

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ElementType; // Tipo para ícone do lucide-react
  iconPosition?: 'left' | 'right';
}

// Componente Button exportado como named export
export const Button: React.FC<ButtonProps> = ({ // Alterado para exportação nomeada
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon: Icon, // Renomeado para Icon para fácil uso
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    outline: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-200',
    light: 'bg-white text-primary-600 hover:bg-neutral-100 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const fullWidthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${disabledClasses} ${className}`}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={20} /> // Ícone de carregamento
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2" size={20} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2" size={20} />}
        </>
      )}
    </motion.button>
  );
};
