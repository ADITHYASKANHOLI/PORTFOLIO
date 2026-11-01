import React from 'react';
import { GlassCard, GlassCardProps } from '@zakisheriff/liquid-glass';

export interface LiquidGlassPanelProps extends GlassCardProps {
  as?: React.ElementType;
}

/**
 * Optical Liquid Glass Panel using @zakisheriff/liquid-glass GlassCard.
 * Provides authentic iOS-inspired backdrop refraction, rim highlights, and surface depth.
 */
export const LiquidGlassPanel = React.forwardRef<HTMLDivElement, LiquidGlassPanelProps>(
  (
    {
      children,
      variant = 'clear',
      intensity = 4,
      thickness = 1,
      radius = '24px',
      padding = '16px',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <GlassCard
        ref={ref}
        variant={variant}
        intensity={intensity}
        thickness={thickness}
        radius={radius}
        padding={padding}
        className={`border border-white/10 shadow-2xl backdrop-blur-md ${className}`}
        style={style}
        {...rest}
      >
        {children}
      </GlassCard>
    );
  }
);

LiquidGlassPanel.displayName = 'LiquidGlassPanel';

