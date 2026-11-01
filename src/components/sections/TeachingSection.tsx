import React, { useState, useMemo, useRef, useCallback } from 'react';
import { TeachingContent, TeachingCard } from '@/types';
import MorphSlider, { MorphSliderRef, MorphSliderItem } from '@/components/MorphSlider';
import { INITIAL_SITE_CONTENT } from '@/lib/data/initialData';
import { LiquidActionButton, LiquidGlassPanel } from '@/components/ui';
import { Users, ChevronLeft, ChevronRight, Sparkles, BookOpen, Wrench, Share2, ExternalLink } from 'lucide-react';

interface TeachingSectionProps {
  content: TeachingContent;
}

export const TeachingSection: React.FC<TeachingSectionProps> = ({ content }) => {
  const headline = content?.headline || "Learning is better when shared.";
  const description =
    content?.description || "Teaching, collaborating, experimenting, and learning together.";

  // Extract teaching cards from Supabase or fallback to initial seed
  const cards: TeachingCard[] = useMemo(() => {
    if (content?.cards && content.cards.length > 0) {
      return content.cards.filter((c) => c.published !== false);
    }
    return INITIAL_SITE_CONTENT.teaching.cards || [];
  }, [content]);

  // Synchronized active card index
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const morphRef = useRef<MorphSliderRef>(null);

  // Map into MorphSlider items
  const morphItems: MorphSliderItem[] = useMemo(() => {
    return cards.map((c, i) => ({
      image: c.image || `/teaching/learning-together.svg`,
      caption: `0${i + 1} — ${c.title}`,
      title: c.title,
    }));
  }, [cards]);

  const activeCard = cards[activeIndex] || cards[0];

  const handleSelectCard = useCallback((index: number) => {
    setActiveIndex(index);
    morphRef.current?.goToIndex(index);
  }, []);

  const handlePrev = useCallback(() => {
    const nextIdx = (activeIndex - 1 + cards.length) % cards.length;
    setActiveIndex(nextIdx);
    morphRef.current?.goToIndex(nextIdx);
  }, [activeIndex, cards.length]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % cards.length;
    setActiveIndex(nextIdx);
    morphRef.current?.goToIndex(nextIdx);
  }, [activeIndex, cards.length]);

  const getCardIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Users className="w-4 h-4" />;
      case 1:
        return <Wrench className="w-4 h-4" />;
      case 2:
        return <Share2 className="w-4 h-4" />;
      case 3:
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="teaching"
      className="relative w-full py-28 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 pb-8 border-b border-[#292D33]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-2 font-medium">
            <Users className="w-3.5 h-3.5 text-white" />
            <span>04 // Pedagogical Practice &amp; Community</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            {headline}
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#9299A3] font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Numbered Category Selector Tabs (01, 02, 03, 04) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {cards.map((card, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={card.id || idx}
                type="button"
                onClick={() => handleSelectCard(idx)}
                className={`group relative text-left p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#12151A] border-[#D7DCE2] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                    : 'bg-[#12151A]/40 border-[#292D33] hover:border-[#9299A3]/60 hover:bg-[#12151A]/80'
                }`}
                aria-selected={isSelected}
                role="tab"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs tracking-technical transition-colors ${
                      isSelected ? 'text-white font-bold' : 'text-[#9299A3] group-hover:text-[#D7DCE2]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`transition-colors ${
                      isSelected ? 'text-white' : 'text-[#9299A3] group-hover:text-[#D7DCE2]'
                    }`}
                  >
                    {getCardIcon(idx)}
                  </span>
                </div>

                <div
                  className={`font-sans text-sm font-semibold truncate transition-colors ${
                    isSelected ? 'text-white' : 'text-[#9299A3] group-hover:text-white'
                  }`}
                >
                  {card.title}
                </div>

                {/* Active indicator underline bar */}
                <div
                  className={`mt-2.5 h-[2px] w-full rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Main MorphSlider & Synchronized Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* WebGL MorphSlider Stage */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] bg-[#0E1116] rounded-2xl border border-[#292D33] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
              
              {/* OGL WebGL Displacement Morph Engine */}
              <MorphSlider
                ref={morphRef}
                items={morphItems}
                startIndex={0}
                activeIndex={activeIndex}
                onIndexChange={setActiveIndex}
                transition="melt"
                duration={1.0}
                intensity={0.55}
                scale={2.4}
                aberration={0.35}
                drift={0.4}
                autoplay={false}
                loop={true}
                radius={16}
                showCaptions={false}
                showControls={false}
                showIndicators={false}
                className="w-full h-full"
              />

              {/* In-canvas corner label */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="font-mono text-[11px] uppercase tracking-technical px-3 py-1 rounded-md bg-[#08090B]/80 text-[#D7DCE2] border border-[#292D33] backdrop-blur-md">
                  WEBGL DISPLACEMENT // MELT
                </span>
              </div>

              {/* In-canvas index counter */}
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="font-mono text-xs font-bold text-white px-3 py-1 rounded-md bg-[#08090B]/80 border border-[#292D33] backdrop-blur-md">
                  0{activeIndex + 1} / 0{cards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Synchronized Card Detail & Navigation Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <LiquidGlassPanel
              variant="regular"
              intensity={4}
              thickness={1.2}
              radius="16px"
              padding="0"
              className="p-8 sm:p-10 flex-1 flex flex-col justify-between border border-[#292D33] bg-[#12151A]/95 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-6">
                
                {/* Meta Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#292D33]">
                  <span className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    {activeCard.tag || `CARD 0${activeIndex + 1}`}
                  </span>
                  <span className="font-mono text-xs text-[#9299A3]">
                    SYNC // READY
                  </span>
                </div>

                {/* Card Title */}
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                    {activeCard.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm sm:text-base text-[#D7DCE2] font-normal leading-relaxed">
                    {activeCard.short_description}
                  </p>
                </div>

                {/* Detailed Description */}
                {activeCard.detailed_description && (
                  <div className="p-4 rounded-xl bg-[#08090B]/60 border border-[#292D33]/80">
                    <p className="font-sans text-xs sm:text-sm text-[#9299A3] font-light leading-relaxed">
                      {activeCard.detailed_description}
                    </p>
                  </div>
                )}

                {/* Learning Outcomes */}
                {activeCard.learning_outcomes && activeCard.learning_outcomes.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-[#9299A3] uppercase tracking-technical block">
                      Core Learning Outcomes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCard.learning_outcomes.map((outcome, oi) => (
                        <span
                          key={oi}
                          className="font-mono text-xs px-2.5 py-1 rounded bg-[#08090B] text-[#D7DCE2] border border-[#292D33]"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resource / Documentation Link */}
                {activeCard.resource_url && (
                  <div className="pt-1">
                    <a
                      href={activeCard.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-white hover:text-[#D7DCE2] underline underline-offset-4 decoration-[#292D33] hover:decoration-white transition-all"
                    >
                      <span>Explore Reference / Documentation</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Community Highlight Pill */}
                {activeIndex === 3 && (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.04] border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
                    <span className="font-mono text-xs text-white">
                      CEV Student Collective // Founded by Adithya
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive Navigation Controls */}
              <div className="pt-8 mt-6 border-t border-[#292D33] flex items-center justify-between">
                
                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCard(i)}
                      aria-label={`Go to teaching card 0${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? 'w-8 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                          : 'w-2 bg-[#9299A3]/40 hover:bg-[#D7DCE2]'
                      }`}
                    />
                  ))}
                </div>

                {/* Prev / Next Liquid Buttons */}
                <div className="flex items-center gap-2">
                  <LiquidActionButton
                    type="button"
                    variant="glass"
                    size="sm"
                    intensity={4}
                    thickness={1}
                    onClick={handlePrev}
                    aria-label="Previous card"
                    className="w-10 h-10 p-0 flex items-center justify-center text-[#D7DCE2] hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </LiquidActionButton>

                  <LiquidActionButton
                    type="button"
                    variant="glass"
                    size="sm"
                    intensity={4}
                    thickness={1}
                    onClick={handleNext}
                    aria-label="Next card"
                    className="w-10 h-10 p-0 flex items-center justify-center text-[#D7DCE2] hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </LiquidActionButton>
                </div>
              </div>
            </LiquidGlassPanel>
          </div>
        </div>

        {/* Community Collective Colophon */}
        <div className="mt-14 pt-8 border-t border-[#292D33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#9299A3]">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-white" />
            <span>
              Founded FOLE at College of Engineering Vadakara (CEV) to establish peer-to-peer technical learning without gatekeeping.
            </span>
          </div>
          <span className="text-white font-semibold tracking-technical">
            CEV STUDENT COLLECTIVE
          </span>
        </div>

      </div>
    </section>
  );
};
