import { ComponentPropsWithoutRef, ForwardRefExoticComponent, RefAttributes } from 'react';

export interface MorphSliderItem {
  image: string;
  caption?: string;
  title?: string;
  [key: string]: any;
}

export interface MorphSliderRef {
  goToIndex: (target: number) => void;
  next: () => void;
  prev: () => void;
  getIndex: () => number;
}

export interface MorphSliderProps extends ComponentPropsWithoutRef<'div'> {
  items?: MorphSliderItem[];
  startIndex?: number;
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  transition?: 'melt' | 'ripple' | 'shear' | 'swirl';
  duration?: number;
  ease?: string;
  intensity?: number;
  scale?: number;
  aberration?: number;
  drift?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  radius?: number;
  overlayColor?: string;
  showCaptions?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

declare const MorphSlider: ForwardRefExoticComponent<MorphSliderProps & RefAttributes<MorphSliderRef>>;

export default MorphSlider;

