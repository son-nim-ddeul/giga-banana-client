'use client';

import React, { InputHTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onValueChange?: (value: string) => void;
  onValidation?: (value: string) => string | null;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className, onValueChange, onValidation, onBlur, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onValidation) {
        onValidation(e.target.value);
      }
      onBlur?.(e);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-3 block ml-1" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={cn("h-5 w-5 transition-colors duration-200", error ? "text-error-2" : "text-neutral-2 group-focus-within:text-primary-2")}>
                {icon}
              </div>
            </div>
          )}
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "block w-full py-3 border rounded-xl text-neutral-3 placeholder-neutral-2 focus:outline-none focus:ring-2 transition-all duration-200",
              icon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              error
                ? "border-error-1 bg-error-1 focus:ring-error-2"
                : "border-neutral-1 bg-white focus:ring-primary-2/20 focus:border-primary-2",
              className
            )}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-error-2 flex items-center gap-1 ml-1 mt-1"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
