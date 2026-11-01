import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';
import { FoleContent } from '@/types';
import { BookOpen, Users, Cpu, Share2 } from 'lucide-react';

interface PinnedFoleStoryProps {
  content: FoleContent;
}

const STEP_ICONS = [BookOpen, Users, Cpu, Share2];

export const PinnedFoleStory: React.FC<PinnedFoleStoryProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stages = content.narrative_stages || [];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Only apply desktop pin if viewport width is at least 1024px
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const totalSteps = stages.length;

      // Pin the container for totalSteps * 100vh
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalSteps * 650}`,
        pin: pinSectionRef.current,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate: (self) => {
          const step = Math.min(
            Math.floor(self.progress * totalSteps),
            totalSteps - 1
          );
          setActiveStepIndex(step);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stages.length]);

  return (
    <section
      ref={containerRef}
      id="fole"
      className="relative bg-[#08090B] text-white border-t border-[#292D33]"
    >
      {/* Pinned Viewport Container for Desktop, Natural flow for mobile */}
      <div
        ref={pinSectionRef}
        className="w-full min-h-screen flex flex-col justify-between py-16 md:py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden"
      >
        {/* Subtle background ambient graphic */}
        <div className="pointer-events-none absolute inset-0 opacity-5 flex items-center justify-center">
          <span className="font-display text-[22vw] font-black text-white select-none tracking-tighter">
            FOLE
          </span>
        </div>

        {/* Section Header */}
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-technical text-white font-medium">
              Community & Learning Archive
            </span>
            <span className="w-8 h-px bg-white/40" />
            <span className="font-mono text-xs text-[#9299A3]">CEV Chapter</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {content.title}
          </h2>

          <p className="font-sans text-lg sm:text-xl text-[#9299A3] font-light mt-3 max-w-2xl">
            {content.tagline}
          </p>
        </div>

        {/* Desktop Interactive Stage Presentation (Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center my-auto relative z-10 py-12">
          {/* Progress Timeline on the left */}
          <div className="col-span-4 space-y-6">
            <div className="font-mono text-xs text-[#9299A3] tracking-technical uppercase mb-2">
              The Learning Manifesto
            </div>
            {stages.map((stage, idx) => {
              const Icon = STEP_ICONS[idx % STEP_ICONS.length];
              const isActive = activeStepIndex === idx;

              return (
                <div
                  key={stage.step}
                  className={`flex items-start gap-4 p-4 rounded transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#12151A] border-white/50 text-white translate-x-2 shadow-lg shadow-black/40'
                      : 'border-transparent text-[#9299A3] hover:text-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded flex items-center justify-center shrink-0 border ${
                      isActive
                        ? 'border-white bg-white/10 text-white'
                        : 'border-[#292D33] text-[#9299A3]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-white block font-medium">
                      STAGE {stage.step}
                    </span>
                    <span className="font-display text-base font-semibold block">
                      {stage.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Narrative Card on the right */}
          <div className="col-span-8">
            {stages[activeStepIndex] && (
              <div className="bg-[#12151A] border border-[#292D33] p-8 sm:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-white" />
                
                <div className="flex items-center justify-between font-mono text-xs text-[#9299A3] mb-6">
                  <span className="text-white uppercase tracking-technical font-medium">
                    STAGE {stages[activeStepIndex].step} OF 0{stages.length}
                  </span>
                  <span>PEER-TO-PEER KNOWLEDGE</span>
                </div>

                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white mb-6">
                  {stages[activeStepIndex].title}
                </h3>

                <p className="font-sans text-lg md:text-xl text-[#D7DCE2] leading-editorial font-light">
                  {stages[activeStepIndex].desc}
                </p>

                <div className="mt-8 pt-6 border-t border-[#292D33] flex items-center justify-between font-mono text-xs text-[#9299A3]">
                  <span>Open • Collaborative • Hands-on</span>
                  <span className="text-white">Scroll to navigate stages ↓</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Stacked Editorial Layout (Visible below lg) */}
        <div className="lg:hidden space-y-8 my-8 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length];
            return (
              <div
                key={stage.step}
                className="bg-[#12151A] border border-[#292D33] p-6 rounded-sm space-y-4"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <Icon className="w-4 h-4" />
                    <span>STAGE {stage.step}</span>
                  </div>
                  <span className="text-[#9299A3]">FOLE @ CEV</span>
                </div>

                <h3 className="font-display text-xl font-bold text-white">
                  {stage.title}
                </h3>

                <p className="font-sans text-base text-[#D7DCE2] leading-relaxed font-light">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section Footer / Metadata Bar */}
        <div className="relative z-10 pt-6 border-t border-[#292D33] flex flex-wrap justify-between items-center gap-4 font-mono text-xs text-[#9299A3]">
          <div>
            <span>COMMUNITY INITIATIVE: </span>
            <span className="text-white">FREE OPEN LEARNING & EDUCATION</span>
          </div>
          <div>
            <span>AFFILIATION: </span>
            <span className="text-[#D7DCE2]">COLLEGE OF ENGINEERING VADAKARA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

