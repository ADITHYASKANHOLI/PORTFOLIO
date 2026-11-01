import React from 'react';
import { AboutContent } from '@/types';
import { ScrollTextReveal } from '@/animations/ScrollTextReveal';
import { Compass, CornerDownRight } from 'lucide-react';

interface AboutSectionProps {
  content: AboutContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  return (
    <section
      id="about"
      className="relative w-full py-28 md:py-40 bg-[#F3F4F5] text-[#08090B] border-t border-[#D7DCE2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Editorial Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-technical text-[#08090B] font-semibold">
            01 // Engineering Journal
          </span>
          <span className="w-12 h-px bg-[#D7DCE2]" />
          <span className="font-mono text-xs text-[#6E747E]">About Me</span>
        </div>

        {/* Large Statement Headline */}
        <ScrollTextReveal className="max-w-4xl mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#08090B] leading-tight">
            {content.headline || "Curious, practical, collaborative, and interested in learning by building."}
          </h2>
        </ScrollTextReveal>

        {/* Asymmetric Split Layout: Left Content, Right Technical Annotation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Editorial Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6 font-sans text-base sm:text-lg text-[#08090B]/90 leading-editorial">
            {content.paragraphs && content.paragraphs.length > 0 ? (
              content.paragraphs.map((para, i) => (
                <ScrollTextReveal key={i} delay={i * 0.1}>
                  <p>{para}</p>
                </ScrollTextReveal>
              ))
            ) : (
              <p>
                I study Electrical and Electronics Engineering at College of Engineering Vadakara (CEV).
              </p>
            )}

            {/* Core Philosophy Highlight Callout */}
            <ScrollTextReveal delay={0.3} className="pt-6">
              <div className="border-l-2 border-[#08090B] pl-6 py-3 my-4 bg-white border border-y-[#E5E7EB] border-r-[#E5E7EB] rounded-r-sm shadow-sm">
                <p className="font-display text-xl sm:text-2xl font-semibold text-[#08090B] italic">
                  “{content.philosophy || "Learning becomes more meaningful when people learn together."}”
                </p>
                <span className="font-mono text-xs text-[#6E747E] tracking-technical uppercase mt-2 block">
                  — Operating Principle
                </span>
              </div>
            </ScrollTextReveal>
          </div>

          {/* Technical Annotations & Academic Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Institution Card */}
            <div className="p-6 rounded-sm bg-white border border-[#D7DCE2] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-xs text-[#08090B] uppercase tracking-technical font-semibold">
                <Compass className="w-4 h-4 text-[#08090B]" />
                <span>Academic Foundation</span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-[#08090B]">
                  College of Engineering Vadakara (CEV)
                </h3>
                <p className="font-sans text-sm text-[#6E747E] mt-1">
                  B.Tech in Electrical & Electronics Engineering
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between font-mono text-xs text-[#6E747E]">
                <span>Location: Kerala, IN</span>
                <span className="text-[#08090B] font-semibold">Active Degree</span>
              </div>
            </div>

            {/* Engineering Principles */}
            <div className="space-y-4 p-6 rounded-sm bg-white/70 border border-dashed border-[#D7DCE2]">
              <span className="font-mono text-xs text-[#6E747E] uppercase tracking-technical block">
                Engineering Approach
              </span>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CornerDownRight className="w-4 h-4 text-[#08090B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-[#08090B]">
                      Ground-Up Understanding
                    </h4>
                    <p className="font-sans text-xs text-[#6E747E] mt-0.5">
                      Understanding physical circuits and firmware before designing high-level abstractions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CornerDownRight className="w-4 h-4 text-[#08090B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-[#08090B]">
                      Open Knowledge Propagation
                    </h4>
                    <p className="font-sans text-xs text-[#6E747E] mt-0.5">
                      Documenting experiments openly so that knowledge is not hoarded or siloed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CornerDownRight className="w-4 h-4 text-[#08090B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-[#08090B]">
                      Prototyping over Presumption
                    </h4>
                    <p className="font-sans text-xs text-[#6E747E] mt-0.5">
                      Validating every engineering idea with working hardware and testable code.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
