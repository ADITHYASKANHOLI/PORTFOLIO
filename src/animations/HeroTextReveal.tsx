import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsapSetup';
import TechText from '@/components/TechText';

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
      {/* Line 1 with TechText & Accessible Heading */}
      <div className="overflow-hidden">
        <h1
          ref={line1Ref}
          className="relative w-full max-w-4xl"
        >
          <span className="sr-only">{line1}</span>
          <div className="w-full h-16 sm:h-20 md:h-24 lg:h-28">
            <TechText
              text={line1}
              fontSize={86}
              fontWeight={700}
              fontFamily='"Space Grotesk", sans-serif'
              color="#FFFFFF"
              accentColor="#D7DCE2"
              align="left"
              reach={150}
              softness={0.75}
              labels={true}
              clickKick={true}
              selection={true}
              className="w-full h-full"
            />
          </div>
        </h1>
      </div>

      {/* Line 2 with TechText & Accessible Heading */}
      <div className="overflow-hidden">
        <h1
          ref={line2Ref}
          className="relative w-full max-w-4xl"
        >
          <span className="sr-only">{line2}</span>
          <div className="w-full h-16 sm:h-20 md:h-24 lg:h-28">
            <TechText
              text={line2}
              fontSize={86}
              fontWeight={700}
              fontFamily='"Space Grotesk", sans-serif'
              color="#D7DCE2"
              accentColor="#FFFFFF"
              align="left"
              reach={150}
              softness={0.75}
              labels={true}
              clickKick={true}
              selection={true}
              className="w-full h-full"
            />
          </div>
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

