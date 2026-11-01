import React, { useState } from 'react';
import { ContactContent, SocialLink } from '@/types';
import { Mail, ArrowUpRight, Github, Linkedin, Instagram, Copy, Check, Send } from 'lucide-react';
import { LiquidActionButton, LiquidActionLink, LiquidGlassPanel } from '@/components/ui';

interface ContactSectionProps {
  content: ContactContent;
  socials: SocialLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ content, socials }) => {
  const [copied, setCopied] = useState(false);

  const email = content.email || 'adithya@example.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSocialIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('git')) return Github;
    if (lower.includes('link')) return Linkedin;
    if (lower.includes('insta')) return Instagram;
    return ArrowUpRight;
  };

  return (
    <section
      id="contact"
      className="relative w-full py-28 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Header */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-4 font-medium">
          <Mail className="w-3.5 h-3.5 text-white" />
          <span>Direct Inquiries & Collaboration</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Inquiry Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              {content.headline || "Let’s start a conversation."}
            </h2>

            <p className="font-sans text-[#9299A3] text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              {content.subheading || "Whether you want to discuss embedded systems, collaborate on an open-source project, talk about FOLE, or share ideas."}
            </p>

            {/* Email Contact Box */}
            <div className="p-6 rounded-sm bg-[#12151A] border border-[#292D33] max-w-lg space-y-4">
              <span className="font-mono text-xs text-[#9299A3] uppercase tracking-technical block">
                Primary Contact Channel
              </span>

              <div className="flex items-center justify-between gap-4">
                <a
                  href={`mailto:${email}`}
                  className="font-display text-lg sm:text-xl font-semibold text-white hover:text-[#D7DCE2] transition-colors truncate"
                >
                  {email}
                </a>

                <LiquidActionButton
                  variant="clear"
                  size="sm"
                  intensity={4}
                  thickness={1}
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="font-mono text-xs text-[#D7DCE2] shrink-0"
                >
                  <span className="flex items-center gap-1.5">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span className="text-white">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                </LiquidActionButton>
              </div>

              <div className="pt-2">
                <LiquidActionLink
                  href={`mailto:${email}`}
                  variant="glass"
                  size="lg"
                  intensity={5}
                  thickness={2}
                  shimmer
                  icon={<Send className="w-3.5 h-3.5" />}
                  className="font-mono text-xs font-semibold tracking-technical uppercase text-white shadow-2xl"
                >
                  Send Direct Email
                </LiquidActionLink>
              </div>
            </div>

            {content.note && (
              <p className="font-mono text-xs text-[#9299A3]/60 max-w-md">
                * {content.note}
              </p>
            )}
          </div>

          {/* Social Links & Location Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <LiquidGlassPanel
              variant="clear"
              intensity={4}
              thickness={1}
              radius="16px"
              padding="28px"
              className="border border-[#292D33] space-y-6"
            >
              <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block font-medium">
                Verified Profiles
              </span>

              <div className="space-y-3">
                {socials && socials.length > 0 ? (
                  socials
                    .filter((s) => s.enabled)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((s) => {
                      const Icon = getSocialIcon(s.platform);
                      return (
                        <LiquidActionLink
                          key={s.id}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          variant="clear"
                          size="md"
                          intensity={3}
                          thickness={1}
                          className="w-full flex items-center justify-between text-white hover:text-[#D7DCE2] border border-[#292D33]/60"
                        >
                          <span className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-[#D7DCE2]" />
                              <span className="font-display text-sm font-medium">
                                {s.platform}
                              </span>
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-[#9299A3]" />
                          </span>
                        </LiquidActionLink>
                      );
                    })
                ) : (
                  <p className="font-mono text-xs text-[#9299A3]">No social links configured.</p>
                )}
              </div>

              <div className="pt-4 border-t border-[#292D33] text-xs font-mono text-[#9299A3] space-y-1">
                <p>Location: Vadakara, Kozhikode, Kerala</p>
                <p>Affiliation: College of Engineering Vadakara</p>
              </div>
            </LiquidGlassPanel>
          </div>

        </div>

      </div>
    </section>
  );
};
