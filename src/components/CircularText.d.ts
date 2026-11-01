import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

export interface CircularTextProps extends ComponentPropsWithoutRef<'div'> {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  direction?: 'clockwise' | 'counterclockwise';
  size?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  color?: string;
  startAngle?: number;
  fill?: boolean;
  repeat?: number;
  ring?: boolean;
  ringColor?: string;
  tilt?: number;
  hoverTilt?: number;
  draggable?: boolean;
  children?: ReactNode;
  className?: string;
}

declare const CircularText: FC<CircularTextProps>;

export default CircularText;

