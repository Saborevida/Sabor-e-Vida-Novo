import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react'; // Importa LucideIcon

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  icon?: LucideIcon; // Usa LucideIcon para o tipo
  iconPosition?: 'left' | 'right';
}

// Componente Input exportado como named export
export const Input = React.forwardRef<HTMLInputElement, InputProps>( // Alterado para exportação nomeada e forwardRef
  ({ label, helpText, error, icon: Icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const baseClasses = `
      flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base
      ring-offset-white placeholder:text-neutral-400 focus:outline-none focus:ring-2
      focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    `;

    const containerClasses = `relative ${className}`;
    const inputClasses = `${baseClasses} ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''} ${error ? 'border-red-500' : ''}`;
    const labelClasses = `block text-sm font-medium text-neutral-700 mb-1`;
    const helpTextClasses = `text-xs text-neutral-500 mt-1`;
    const errorClasses = `text-xs text-red-600 mt-1`;

    return (
      <div className={containerClasses}>
        {label && <label htmlFor={props.id || props.name} className={labelClasses}>{label}</label>}
        <div className="relative flex items-center w-full">
          {Icon && iconPosition === 'left' && (
            <Icon className="absolute left-3 text-neutral-400" size={20} />
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {Icon && iconPosition === 'right' && (
            <Icon className="absolute right-3 text-neutral-400" size={20} />
          )}
        </div>
        {helpText && !error && <p className={helpTextClasses}>{helpText}</p>}
        {error && <p className={errorClasses}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Adiciona um display name para forwardRef
