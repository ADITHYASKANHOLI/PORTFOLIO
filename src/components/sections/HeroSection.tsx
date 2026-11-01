import React from 'react';
import { HeroContent } from '@/types';
import FluxLines from '@/components/effects/FluxLines';
import { HeroTextReveal } from '@/animations/HeroTextReveal';
import { LiquidActionButton, LiquidGlassPanel } from '@/components/ui';
import { ArrowDown, Terminal, Sparkles, Layers } from 'lucide-react';

interface HeroSectionProps {
  content: HeroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 lg:px-16 bg-[#08090B] text-white overflow-hidden"
    >
      {/* Canonical React Bits FluxLines WebGL2 Interactive Component */}
      <FluxLines
        colors={['#FFFFFF', '#D7DCE2', '#FFFFFF']}
        speed={0.35}
        scale={1.0}
        turbulence={1.0}
        fluidity={0.12}
        rimWidth={0.16}
        sharpness={2.5}
        shimmer={1.2}
        glow={1.8}
        lineWidth={0.8}
        flowDirection="down"
        mouseInteraction={true}
        mouseStrength={1.0}
        mouseRadius={0.4}
        mouseDampening={0.15}
        clickSwirl={true}
        intro={true}
        lightMode={false}
        transparent={true}
        opacity={0.85}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content Layer (position: relative, z-index: 1) */}
      <div className="relative z-[1] w-full max-w-7xl mx-auto flex flex-col justify-between flex-1">
        {/* Top Metadata Pill */}
        <div>
          <LiquidGlassPanel
            variant="clear"
            intensity={4}
            thickness={1}
            radius="9999px"
            padding="4px 14px"
            className="inline-flex items-center gap-2.5 text-xs font-mono text-[#D7DCE2]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[#D7DCE2] font-medium tracking-wide">
              {content.status_badge || 'Adithya S. Kanholi • CEV'}
            </span>
          </LiquidGlassPanel>
        </div>

        {/* Main Headline & Supporting Reveal */}
        <div className="my-auto py-8">
          <HeroTextReveal
            line1={content.title_line_1 || "Engineering Ideas."}
            line2={content.title_line_2 || "Building Experiences."}
            subheading={content.subheading || "An engineering student exploring software, hardware, and the things we can learn by building."}
          />

          {/* Action CTAs with Optical Liquid Glass */}
          <div className="flex flex-wrap items-center gap-4 pt-8">
            <LiquidActionButton
              variant="glass"
              size="lg"
              intensity={5}
              thickness={2}
              shimmer
              onClick={() => scrollTo('projects')}
              className="font-mono text-xs font-semibold tracking-technical uppercase text-white shadow-2xl"
              aria-label="Explore My Work"
            >
              <span className="flex items-center gap-2">
                <span>{content.cta_work || "Explore My Work"}</span>
                <ArrowDown className="w-4 h-4" />
              </span>
            </LiquidActionButton>

            <LiquidActionButton
              variant="clear"
              size="lg"
              intensity={4}
              thickness={1}
              onClick={() => scrollTo('contact')}
              className="font-mono text-xs tracking-technical uppercase text-[#D7DCE2] hover:text-white"
              aria-label="Get in Touch"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D7DCE2]" />
                <span>{content.cta_contact || "Get in Touch"}</span>
              </span>
            </LiquidActionButton>
          </div>
        </div>

        {/* Bottom Technical Identity Strip */}
        <div className="pt-8 border-t border-[#292D33] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-[#9299A3]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#D7DCE2]">
              <Layers className="w-3.5 h-3.5" />
              <span>DISCIPLINES:</span>
            </span>
            <span className="text-white/90">Embedded Systems</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Python & Backend</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Peer Education</span>
          </div>

          <div className="flex items-center gap-2 text-[#9299A3]">
            <Sparkles className="w-3 h-3 text-[#D7DCE2]" />
            <span>CEV Vadakara // Kerala, India</span>
          </div>
        </div>
      </div>
    </section>
  );
};
