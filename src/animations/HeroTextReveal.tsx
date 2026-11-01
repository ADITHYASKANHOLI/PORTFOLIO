import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsapSetup';

interface HeroTextRevealProps {
  line1: string;
  line2: string;
  subheading: string;
  className?: string;
}

export const HeroTextReveal: React.FC<HeroTextRevealProps> = ({
  line1,
  line2,
  subheading,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        line1Ref.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.1, delay: 0.2 }
      )
      .fromTo(
        line2Ref.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.1 },
        '-=0.8'
      )
      .fromTo(
        subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.6'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [line1, line2]);

  return (
    <div ref={containerRef} className={`space-y-4 ${className}`}>
      {/* Accessible Title */}
      <div className="overflow-hidden">
        <h1
          ref={line1Ref}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tightDisplay"
        >
          {line1}
        </h1>
      </div>

      <div className="overflow-hidden">
        <h1
          ref={line2Ref}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-silver leading-tightDisplay"
        >
          {line2}
        </h1>
      </div>

      <p
        ref={subRef}
        className="font-sans text-lg sm:text-xl md:text-2xl text-steel max-w-2xl font-light leading-editorial pt-2"
      >
        {subheading}
      </p>
    </div>
  );
};

