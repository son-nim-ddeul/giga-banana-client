'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  children: ReactNode;
  loadingText?: string;
  successText?: string;
  showArrow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading = false,
      isSuccess = false,
      children,
      loadingText,
      successText,
      showArrow = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isDisabled}
        className={cn(
          "group relative w-full py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-200 transform cursor-pointer",
          isSuccess
            ? "bg-success-2 hover:bg-success-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            : "bg-primary-2 hover:bg-primary-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
          isDisabled && "opacity-80 cursor-not-allowed hover:scale-100",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{loadingText || '처리 중...'}</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{successText || '성공!'}</span>
            </>
          ) : (
            <>
              <span>{children}</span>
              {showArrow && (
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
