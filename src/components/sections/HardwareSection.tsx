import React, { useMemo } from 'react';
import { HardwareContent, HardwarePanel } from '@/types';
import AccordionGallery, { AccordionGalleryItem } from '@/components/AccordionGallery';
import { INITIAL_SITE_CONTENT } from '@/lib/data/initialData';
import { Cpu, Radio, Layers } from 'lucide-react';
import TechText from '@/components/TechText';

interface HardwareSectionProps {
  content: HardwareContent;
}

export const HardwareSection: React.FC<HardwareSectionProps> = ({ content }) => {
  const headline = content?.headline || "Beyond the Screen.";
  const subheading = content?.subheading || "Exploring the intersection of electronics, embedded systems, and software.";

  // Extract panels dynamically from Supabase content, falling back to initial seed data
  const panels: HardwarePanel[] = useMemo(() => {
    if (content?.panels && content.panels.length > 0) {
      return content.panels.filter((p) => p.published !== false);
    }
    return INITIAL_SITE_CONTENT.hardware.panels || [];
  }, [content]);

  // Map into canonical AccordionGallery items
  const galleryItems: AccordionGalleryItem[] = useMemo(() => {
    return panels
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map((panel, idx) => ({
        image: panel.image || `/hardware/${panel.category.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`,
        label: panel.title,
        category: panel.category,
        description: panel.short_description,
        detailedDescription: panel.detailed_description,
        tags: panel.technologies || [],
        panelNumber: `0${idx + 1}`,
        link: panel.external_url || undefined,
        alt: `${panel.title} hardware exploration schematic`,
      }));
  }, [panels]);

  return (
    <section
      id="hardware"
      className="relative w-full py-28 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 pb-8 border-b border-[#292D33]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-2 font-medium">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>Interactive Exhibition</span>
          </div>

          <h2 className="relative w-full max-w-xl">
            <span className="sr-only">{headline}</span>
            <div className="w-full h-14 sm:h-20">
              <TechText
                text={headline}
                fontSize={56}
                fontWeight={700}
                fontFamily='"Space Grotesk", sans-serif'
                color="#FFFFFF"
                accentColor="#D7DCE2"
                align="left"
                reach={130}
                labels={false}
                clickKick={true}
                className="w-full h-full"
              />
            </div>
          </h2>

          <p className="font-sans text-[#9299A3] text-base sm:text-lg mt-3 font-light leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Canonical React Bits Accordion Gallery */}
        <div className="w-full my-auto">
          <AccordionGallery
            items={galleryItems}
            defaultIndex={0}
            height={520}
            gap={12}
            radius={14}
            expandRatio={0.52}
            orientation="horizontal"
            duration={0.65}
            ease="power3.out"
            parallax={0.6}
            tilt={5}
            stagger={0.05}
            trigger="hover"
            grayscale={true}
            showLabels={true}
            accentColor="#FFFFFF"
            overlayColor="#08090B"
            textColor="#FFFFFF"
            className="shadow-2xl"
          />
        </div>

        {/* Exhibition Telemetry Strip */}
        <div className="mt-16 pt-8 border-t border-[#292D33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#9299A3]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#D7DCE2]">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>EXPLORATION CATEGORIES:</span>
            </span>
            <span className="text-white/90">ESP32</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Servo Motors</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Sensors</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Embedded Systems</span>
            <span className="text-[#292D33]">•</span>
            <span className="text-white/90">Electronics</span>
          </div>

          <div className="flex items-center gap-2 text-[#9299A3]">
            <Radio className="w-3.5 h-3.5 text-white" />
            <span>Hover or tap to inspect hardware modules</span>
          </div>
        </div>

      </div>
    </section>
  );
};
