import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsapSetup';

interface ScrollTextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = elRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};
