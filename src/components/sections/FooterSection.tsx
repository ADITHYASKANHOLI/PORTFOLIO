import React from 'react';
import { FooterContent, SocialLink } from '@/types';
import { ArrowUp } from 'lucide-react';

interface FooterSectionProps {
  content: FooterContent;
  socials: SocialLink[];
}

export const FooterSection: React.FC<FooterSectionProps> = ({ content, socials }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'FOLE', href: '#fole' },
    { name: 'Projects', href: '#projects' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'Teaching', href: '#teaching' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#08090B] text-white border-t border-[#292D33] pt-16 pb-12 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-[#292D33]">
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded border border-[#292D33] bg-[#12151A] flex items-center justify-center font-display font-bold text-white text-xs">
                AK
              </span>
              <span className="font-display font-bold text-lg text-white">
                Adithya S. Kanholi
              </span>
            </div>

            <p className="font-sans text-[#9299A3] text-sm font-light">
              {content.tagline || "An independent engineering journal & archive."}
            </p>
          </div>

          {/* Quick Back to Top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] hover:text-white transition-colors py-2 px-4 rounded bg-[#12151A] border border-[#292D33] hover:border-[#D7DCE2] cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle Tier: Navigation & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-[#9299A3]">
          <div className="md:col-span-6 space-y-3">
            <span className="text-white block font-semibold uppercase tracking-technical">
              Navigation
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="hover:text-white transition-colors uppercase cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 md:text-right">
            <span className="text-white block font-semibold uppercase tracking-technical">
              Connect
            </span>
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2">
              {socials
                .filter((s) => s.enabled)
                .map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors uppercase"
                  >
                    {s.platform}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Bottom Tier: Colophon & Copyright */}
        <div className="pt-8 border-t border-[#292D33] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#9299A3]/60">
          <div>
            © {new Date().getFullYear()} {content.credit || "Adithya S. Kanholi. All rights reserved."}
          </div>
          <div>
            {content.colophon || "Built with React, TypeScript, Tailwind CSS, GSAP & Supabase."}
          </div>
        </div>

      </div>
    </footer>
  );
};

