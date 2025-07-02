'use client';

import { cn } from '@/app/utils/cn';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  className?: string;
}

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition',
        variant === 'default' && 'bg-green-600 text-white hover:bg-green-700',
        variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        className
      )}
      {...props}
    />
  );
}
