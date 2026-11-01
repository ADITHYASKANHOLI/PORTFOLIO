import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import CircularText from '@/components/CircularText';
import { LiquidActionButton } from '@/components/ui';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  // Exact 50% reduction per user specification:
  // Desktop: Outer CircularText diameter 75px, Central button 46px, Arrow icon ~18px, Font 6px
  // Mobile: Outer CircularText diameter 61px, Central button 25px (with 44px touch target), Font 5px
  const ringSize = isMobile ? 61 : 75;
  const buttonDimension = isMobile ? '25px' : '46px';
  const textSize = isMobile ? 5 : 6;

  return (
    <div
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-opacity duration-300"
      style={{
        width: `${ringSize}px`,
        height: `${ringSize}px`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="group relative w-full h-full">
        {/* Optical dark glass backdrop disc matching exact 75px ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#08090B]/90 backdrop-blur-xl border border-[#292D33]/80 shadow-[0_4px_20px_rgba(0,0,0,0.65)] pointer-events-none"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
          }}
          aria-hidden="true"
        />

        {/* Outer CircularText ring: exactly 75px desktop (61px mobile), centered via 50% offsets */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
          }}
          onClick={scrollToTop}
        >
          <CircularText
            text="BACK TO TOP • SCROLL UP • BACK TO TOP • "
            spinDuration={24}
            onHover="slowDown"
            size={ringSize}
            fontSize={textSize}
            fontWeight={700}
            className="back-to-top-circular-text"
          >
            {/* Central arrow button: exactly 46px desktop (25px mobile), centered via 50% offsets */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto flex items-center justify-center"
              style={{
                width: buttonDimension,
                height: buttonDimension,
              }}
            >
              <LiquidActionButton
                type="button"
                variant="glass"
                size="sm"
                intensity={5}
                thickness={2}
                shimmer
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToTop();
                }}
                aria-label="Back to top"
                icon={
                  <ArrowUp
                    className={`${
                      isMobile ? 'w-3 h-3' : 'w-[18px] h-[18px]'
                    } text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110`}
                  />
                }
                className="back-to-top-arrow-btn rounded-full shadow-lg border border-[#D7DCE2]/35 transition-all duration-300 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.35)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none flex items-center justify-center p-0 cursor-pointer"
                style={
                  {
                    '--lg-h': buttonDimension,
                    width: buttonDimension,
                    height: buttonDimension,
                  } as React.CSSProperties
                }
              />
            </div>
          </CircularText>
        </div>
      </div>
    </div>
  );
};
