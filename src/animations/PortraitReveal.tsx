import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsapSetup';
import { PortraitContent } from '@/types';
import { Camera, Sparkles } from 'lucide-react';
import TechText from '@/components/TechText';

interface PortraitRevealProps {
  content: PortraitContent;
}

export const PortraitReveal: React.FC<PortraitRevealProps> = ({ content }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Image scale & parallax on scroll
      gsap.fromTo(
        imageInnerRef.current,
        { scale: 1.15, y: -20 },
        {
          scale: 1,
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Text reveal
      gsap.fromTo(
        textColRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      id="portrait"
      className="relative w-full py-24 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Composition Column (7 cols) */}
          <div className="lg:col-span-7">
            <div
              ref={imageWrapperRef}
              className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full max-w-xl mx-auto lg:mx-0 overflow-hidden rounded-sm border border-[#292D33] bg-[#12151A] shadow-2xl"
            >
              <div
                ref={imageInnerRef}
                className="w-full h-full relative"
              >
                {content.image_url ? (
                  <img
                    src={content.image_url}
                    alt="Adithya S. Kanholi Portrait"
                    className="w-full h-full object-cover object-center filter contrast-[1.05] hover:contrast-100 transition-all duration-700"
                    loading="lazy"
                  />
                ) : (
                  /* Deliberate Editorial Placeholder */
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#12151A] text-[#9299A3] relative">
                    {/* Architectural coordinate lines */}
                    <div className="absolute inset-x-8 top-8 flex justify-between font-mono text-[10px] text-[#9299A3]/50">
                      <span>FIG. 01 — PORTRAIT COMPOSITION</span>
                      <span>11.6053° N, 75.5908° E</span>
                    </div>

                    <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center mb-6 bg-[#08090B]">
                      <Camera className="w-8 h-8 text-white" />
                    </div>

                    <p className="font-display text-xl md:text-2xl font-semibold text-white text-center mb-2">
                      Adithya S. Kanholi
                    </p>
                    <p className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] mb-4">
                      Portrait Placement
                    </p>
                    <p className="font-sans text-xs text-[#9299A3] max-w-xs text-center leading-relaxed">
                      Reserved space for Adithya’s actual portrait photograph.
                    </p>

                    <div className="absolute inset-x-8 bottom-8 flex justify-between font-mono text-[10px] text-[#9299A3]/50">
                      <span>CEV • EEE</span>
                      <span>ASPECT RATIO 4:5</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal corner brackets */}
              <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/60" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/60" />
            </div>
          </div>

          {/* Editorial Text Column (5 cols) */}
          <div ref={textColRef} className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#12151A] border border-[#292D33] font-mono text-xs text-[#D7DCE2]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Archive</span>
            </div>

            <h2 className="relative w-full max-w-xl">
              <span className="sr-only">{content.heading}</span>
              <div className="w-full h-14 sm:h-20">
                <TechText
                  text={content.heading || "Electrical Engineering & Systems"}
                  fontSize={46}
                  fontWeight={700}
                  fontFamily='"Space Grotesk", sans-serif'
                  color="#FFFFFF"
                  accentColor="#D7DCE2"
                  align="left"
                  reach={120}
                  labels={false}
                  clickKick={true}
                  className="w-full h-full"
                />
              </div>
            </h2>

            <p className="font-sans text-xl md:text-2xl text-[#D7DCE2] font-light leading-relaxed">
              {content.caption}
            </p>

            <div className="w-12 h-0.5 bg-white/40 my-4" />

            <p className="font-sans text-base text-[#9299A3] leading-editorial">
              {content.note}
            </p>

            <div className="pt-4 flex items-center gap-6 font-mono text-xs text-[#9299A3]">
              <div>
                <span className="text-white block font-semibold text-sm">College</span>
                <span>CE Vadakara</span>
              </div>
              <div className="w-px h-8 bg-[#292D33]" />
              <div>
                <span className="text-white block font-semibold text-sm">Discipline</span>
                <span>Electrical & Electronics</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
