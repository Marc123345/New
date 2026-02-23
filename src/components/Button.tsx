import React from 'react';
import { getButtonHoverHandlers } from '../utils/buttonHover';

interface ButtonProps {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      className={`inline-block px-8 py-4 border-2 cursor-pointer transition-all duration-200 uppercase ${
        isPrimary
          ? 'bg-[var(--color-primary)] text-[var(--color-background-light)] border-[var(--color-primary)]'
          : 'bg-transparent text-[var(--color-primary)] border-[var(--color-primary)]'
      }`}
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        boxShadow: 'var(--shadow-button)',
      }}
      {...getButtonHoverHandlers()}
    >
      {children}
    </button>
  );
}
