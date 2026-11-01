import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassCard, GlassButton } from '@zakisheriff/liquid-glass';
import { Menu, X } from 'lucide-react';

interface NavLinkItem {
  name: string;
  href: string;
  id: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Skills', href: '/#skills', id: 'skills' },
  { name: 'FOLE', href: '/#fole', id: 'fole' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Hardware', href: '/#hardware', id: 'hardware' },
  { name: 'Teaching', href: '/#teaching', id: 'teaching' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
];

/**
 * Apple-inspired Floating Liquid Glass Navigation Bar.
 * Houses semantic navigation links inside an authentic optical GlassCard pill surface.
 * Dynamically highlights active section and collapses gracefully into a compact glass trigger on mobile.
 */
export const LiquidNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Section active observer
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      window.location.href = href;
      return;
    }

    const targetId = href.replace('/#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-3 sm:p-5 flex justify-center">
      <div className="w-full max-w-7xl flex items-center justify-between">
        
        {/* Brand Monogram Glass Capsule */}
        <div className="pointer-events-auto">
          <Link
            to="/"
            className="group block"
            aria-label="Adithya S. Kanholi Portfolio Home"
          >
            <GlassCard
              variant="clear"
              intensity={4}
              thickness={1}
              radius="9999px"
              padding="6px 14px"
              className="flex items-center gap-2.5 border border-white/10 hover:border-white/30 transition-all shadow-lg"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-display font-bold text-xs text-white group-hover:bg-white group-hover:text-[#08090B] transition-all">
                AK
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-white group-hover:text-[#D7DCE2] transition-colors leading-tight">
                  Adithya S. Kanholi
                </span>
                <span className="font-mono text-[9px] text-[#9299A3] tracking-widest uppercase">
                  CEV • EEE
                </span>
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* Center: Desktop Floating Liquid Glass Navigation Capsule */}
        <div className="hidden lg:block pointer-events-auto">
          <GlassCard
            variant="clear"
            intensity={4}
            thickness={1}
            radius="9999px"
            padding="4px 8px"
            className="border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <nav className="flex items-center gap-1" aria-label="Main Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(link.href, e)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-technical uppercase transition-all duration-200 select-none ${
                      isActive
                        ? 'text-white bg-white/15 font-semibold shadow-inner'
                        : 'text-[#9299A3] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>
          </GlassCard>
        </div>

        {/* Right: Mobile / Tablet Glass Trigger */}
        <div className="lg:hidden flex items-center pointer-events-auto">
          <GlassButton
            variant="clear"
            size="sm"
            intensity={4}
            thickness={1}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            icon={
              mobileMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )
            }
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          />
        </div>
      </div>

      {/* Mobile Drawer Floating Glass Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-4 right-4 pointer-events-auto z-50">
          <GlassCard
            variant="clear"
            intensity={6}
            thickness={2}
            radius="24px"
            padding="20px"
            className="border border-white/15 shadow-2xl space-y-4"
          >
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(link.href, e)}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-technical transition-all flex items-center justify-between ${
                      isActive
                        ? 'text-white bg-white/15 font-semibold'
                        : 'text-[#9299A3] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </a>
                );
              })}
            </nav>
          </GlassCard>
        </div>
      )}
    </header>
  );
};

