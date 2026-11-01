import React from 'react';
import { GlassButton, GlassButtonProps } from '@zakisheriff/liquid-glass';
import { Loader2 } from 'lucide-react';

export interface LiquidActionButtonProps extends GlassButtonProps {
  loading?: boolean;
  loadingText?: string;
}

/**
 * Apple-inspired Liquid Glass Action Button powered by @zakisheriff/liquid-glass.
 * Preserves native HTML button semantics, keyboard accessibility, and iOS optical physics.
 */
export const LiquidActionButton = React.forwardRef<HTMLButtonElement, LiquidActionButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      disabled,
      variant = 'glass',
      size = 'md',
      intensity = 5,
      thickness = 2,
      shimmer = true,
      icon,
      className = '',
      type = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const effectiveDisabled = disabled || loading;

    return (
      <GlassButton
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        intensity={intensity}
        thickness={thickness}
        shimmer={shimmer}
        disabled={effectiveDisabled}
        aria-disabled={effectiveDisabled}
        aria-busy={loading ? 'true' : undefined}
        aria-label={ariaLabel}
        icon={
          loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white/90" aria-hidden="true" />
          ) : (
            icon
          )
        }
        className={`font-sans tracking-wide transition-colors ${className}`}
        {...rest}
      >
        {loading ? (loadingText || children) : children}
      </GlassButton>
    );
  }
);

LiquidActionButton.displayName = 'LiquidActionButton';

