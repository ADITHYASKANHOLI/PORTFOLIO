import React, { CSSProperties, HTMLAttributes } from 'react';

export type FluxLinesFlow = 'up' | 'down' | 'left' | 'right';

export interface FluxLinesProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  lineWidth?: number;
  flowDirection?: FluxLinesFlow;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  mixBlendMode?: CSSProperties['mixBlendMode'];
}

declare const FluxLines: React.FC<FluxLinesProps>;
export default FluxLines;

